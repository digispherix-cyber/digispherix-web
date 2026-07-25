'use client'

import { useState, useRef } from 'react'
import { Upload, Download, Type, Sparkles, Film, RotateCcw, Wand2, Captions } from 'lucide-react'

const MAX_SECONDS = 60

const FONTS = [
  { label: 'Sans (Arial)', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Impact', value: 'Impact, Haettenschweiler, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
]

const DEFAULT_STYLE = {
  size: 0.07,          // fracción del alto del video
  color: '#ffffff',
  outline: true,
  outlineColor: '#000000',
  bg: false,
  bgColor: '#000000',
  position: 'bottom',  // bottom | center | top
  font: FONTS[0].value,
}

function fmtSrt(t) {
  const ms = Math.floor((t % 1) * 1000).toString().padStart(3, '0')
  const s = Math.floor(t % 60).toString().padStart(2, '0')
  const m = Math.floor((t / 60) % 60).toString().padStart(2, '0')
  const h = Math.floor(t / 3600).toString().padStart(2, '0')
  return `${h}:${m}:${s},${ms}`
}

function segmentsToSrt(segments) {
  return segments.map((seg, i) =>
    `${i + 1}\n${fmtSrt(seg.start)} --> ${fmtSrt(seg.end)}\n${seg.text}\n`
  ).join('\n')
}

// Decodifica el audio del archivo a Float32 mono 16 kHz (lo que Whisper espera)
async function decodeAudio(file) {
  const buf = await file.arrayBuffer()
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  const ctx = new AudioCtx()
  const decoded = await ctx.decodeAudioData(buf)
  ctx.close()
  const numCh = decoded.numberOfChannels
  const len = decoded.length
  const mono = new Float32Array(len)
  for (let c = 0; c < numCh; c++) {
    const d = decoded.getChannelData(c)
    for (let i = 0; i < len; i++) mono[i] += d[i] / numCh
  }
  const target = 16000
  if (decoded.sampleRate === target) return mono
  const ratio = decoded.sampleRate / target
  const newLen = Math.round(len / ratio)
  const out = new Float32Array(newLen)
  for (let i = 0; i < newLen; i++) {
    const idx = i * ratio
    const i0 = Math.floor(idx)
    const i1 = Math.min(i0 + 1, len - 1)
    const frac = idx - i0
    out[i] = mono[i0] * (1 - frac) + mono[i1] * frac
  }
  return out
}

// Dibuja el subtítulo con estilo sobre el canvas
function drawSubtitle(ctx, text, W, H, style) {
  if (!text) return
  const fontSize = Math.round(style.size * H)
  ctx.font = `bold ${fontSize}px ${style.font}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  // dividir en líneas que quepan al 90% del ancho
  const maxW = W * 0.9
  const words = text.split(/\s+/)
  const lines = []
  let cur = ''
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w
    if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w }
    else cur = test
  }
  if (cur) lines.push(cur)

  const lineH = fontSize * 1.25
  const totalH = lines.length * lineH
  let y
  if (style.position === 'top') y = H * 0.08 + fontSize
  else if (style.position === 'center') y = H / 2 - totalH / 2 + fontSize
  else y = H - H * 0.08 - totalH + fontSize

  const cx = W / 2
  lines.forEach((line, i) => {
    const ly = y + i * lineH
    if (style.bg) {
      const tw = ctx.measureText(line).width
      ctx.fillStyle = style.bgColor + 'b3' // ~70% opacidad
      ctx.fillRect(cx - tw / 2 - fontSize * 0.3, ly - fontSize, tw + fontSize * 0.6, lineH)
    }
    if (style.outline) {
      ctx.lineWidth = Math.max(2, fontSize * 0.12)
      ctx.strokeStyle = style.outlineColor
      ctx.lineJoin = 'round'
      ctx.strokeText(line, cx, ly)
    }
    ctx.fillStyle = style.color
    ctx.fillText(line, cx, ly)
  })
}

export default function SubtitleGeneratorTool() {
  const [file, setFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [language, setLanguage] = useState('spanish')
  const [phase, setPhase] = useState('idle') // idle | model | transcribing | ready | exporting
  const [progress, setProgress] = useState(0)
  const [segments, setSegments] = useState([])
  const [current, setCurrent] = useState('') // texto del subtítulo en el momento actual (preview)
  const [style, setStyle] = useState(DEFAULT_STYLE)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const videoRef = useRef(null)
  const inputRef = useRef(null)
  const transcriberRef = useRef(null)
  const audioCtxRef = useRef(null)
  const sourceRef = useRef(null)

  const setSt = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setStyle((s) => ({ ...s, [k]: v }))
  }

  const onFile = (f) => {
    if (!f || !f.type.startsWith('video/')) return
    setError(''); setResult(null); setSegments([])
    const url = URL.createObjectURL(f)
    // validar duración
    const v = document.createElement('video')
    v.preload = 'metadata'
    v.onloadedmetadata = () => {
      if (v.duration > MAX_SECONDS + 0.5) {
        setError(`El video dura ${Math.round(v.duration)}s. Por ahora el máximo es ${MAX_SECONDS} segundos.`)
        URL.revokeObjectURL(url)
        return
      }
      setFile(f); setVideoUrl(url)
    }
    v.onerror = () => { setError('No se pudo leer el video.'); URL.revokeObjectURL(url) }
    v.src = url
  }

  const transcribe = async () => {
    if (!file) return
    setError(''); setResult(null); setProgress(0)
    try {
      if (!transcriberRef.current) {
        setPhase('model')
        const { pipeline, env } = await import('@xenova/transformers')
        env.allowRemoteModels = false
        env.localModelPath = '/models/'
        env.backends.onnx.wasm.wasmPaths = '/ort/'
        env.backends.onnx.wasm.numThreads = 1
        transcriberRef.current = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny', {
          quantized: true,
          progress_callback: (p) => { if (p.status === 'progress' && p.progress) setProgress(Math.round(p.progress)) },
        })
      }
      setPhase('transcribing')
      const audio = await decodeAudio(file)
      const out = await transcriberRef.current(audio, {
        language: language === 'auto' ? null : language,
        task: 'transcribe',
        return_timestamps: true,
        chunk_length_s: 30,
        stride_length_s: 5,
      })
      const segs = (out.chunks || [])
        .map((c) => ({ start: c.timestamp?.[0] ?? 0, end: c.timestamp?.[1] ?? 0, text: (c.text || '').trim() }))
        .filter((s) => s.text)
      if (!segs.length && out.text) segs.push({ start: 0, end: videoRef.current?.duration || MAX_SECONDS, text: out.text.trim() })
      setSegments(segs)
      setPhase('ready')
    } catch (e) {
      setError('No se pudo transcribir. Revisa que el video tenga audio claro y vuelve a intentar.')
      setPhase('idle')
    }
  }

  const onTimeUpdate = () => {
    const t = videoRef.current?.currentTime ?? 0
    const seg = segments.find((s) => t >= s.start && t <= s.end)
    setCurrent(seg ? seg.text : '')
  }

  const editSeg = (i, text) => setSegments((segs) => segs.map((s, j) => (j === i ? { ...s, text } : s)))

  const exportVideo = async () => {
    const video = videoRef.current
    if (!video || !segments.length) return
    setError(''); setResult(null); setPhase('exporting'); setProgress(0)
    try {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth || 720
      canvas.height = video.videoHeight || 1280
      const ctx = canvas.getContext('2d')

      // audio del video -> stream
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext
        audioCtxRef.current = new AudioCtx()
        sourceRef.current = audioCtxRef.current.createMediaElementSource(video)
      }
      const actx = audioCtxRef.current
      if (actx.state === 'suspended') await actx.resume()
      const dest = actx.createMediaStreamDestination()
      sourceRef.current.connect(dest)
      sourceRef.current.connect(actx.destination)

      const canvasStream = canvas.captureStream(30)
      const mixed = new MediaStream([...canvasStream.getVideoTracks(), ...dest.stream.getAudioTracks()])
      const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ? 'video/webm;codecs=vp9,opus' : 'video/webm'
      const rec = new MediaRecorder(mixed, { mimeType: mime })
      const chunks = []
      rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data) }
      const stopped = new Promise((res) => { rec.onstop = res })

      let raf
      const draw = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const t = video.currentTime
        const seg = segments.find((s) => t >= s.start && t <= s.end)
        if (seg) drawSubtitle(ctx, seg.text, canvas.width, canvas.height, style)
        setProgress(Math.min(99, Math.round((t / (video.duration || 1)) * 100)))
        if (!video.paused && !video.ended) raf = requestAnimationFrame(draw)
      }

      video.currentTime = 0
      video.muted = true // evita eco por las bocinas durante el render
      await video.play()
      rec.start()
      draw()
      video.onended = () => { cancelAnimationFrame(raf); if (rec.state !== 'inactive') rec.stop() }

      await stopped
      video.muted = false
      let blob = new Blob(chunks, { type: 'video/webm' })
      try {
        const mod = await import('fix-webm-duration')
        const fix = mod.default || mod
        blob = await fix(blob, Math.round((video.duration || 0) * 1000), { logger: false })
      } catch { /* noop */ }
      setResult(URL.createObjectURL(blob))
      setProgress(100)
      setPhase('ready')
    } catch (e) {
      setError('No se pudo generar el video con subtítulos. Intenta de nuevo.')
      setPhase('ready')
    }
  }

  const downloadSrt = () => {
    const blob = new Blob([segmentsToSrt(segments)], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'subtitulos.srt'
    a.click()
  }

  const reset = () => {
    setFile(null); setVideoUrl(''); setSegments([]); setResult(null); setError(''); setCurrent('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const busy = phase === 'model' || phase === 'transcribing' || phase === 'exporting'
  const subPos = style.position === 'top' ? { top: '8%' } : style.position === 'center' ? { top: '50%', transform: 'translateY(-50%)' } : { bottom: '8%' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {!file ? (
        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '48px 24px', borderRadius: '16px', border: '2px dashed rgba(124,58,237,0.4)', background: 'rgba(12,9,35,0.5)', cursor: 'pointer', textAlign: 'center' }}>
          <Upload size={30} style={{ color: '#e879f9' }} />
          <span style={{ color: 'white', fontWeight: 700 }}>Sube tu video (máximo 60 segundos)</span>
          <span style={{ color: '#9d8fc2', fontSize: '0.85rem' }}>Se procesa en tu navegador; tu video no se sube a internet.</span>
          <input ref={inputRef} type="file" accept="video/*" onChange={(e) => onFile(e.target.files[0])} style={{ display: 'none' }} />
        </label>
      ) : (
        <>
          {/* Preview con subtítulo superpuesto */}
          <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(124,58,237,0.3)', background: '#000' }}>
            <video ref={videoRef} src={videoUrl} controls onTimeUpdate={onTimeUpdate} style={{ width: '100%', display: 'block', maxHeight: '420px', margin: '0 auto' }} />
            {current && (
              <div style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', padding: '0 5%', pointerEvents: 'none', ...subPos }}>
                <span style={{
                  fontFamily: style.font, fontWeight: 'bold', color: style.color,
                  fontSize: 'clamp(16px, 4.5vw, 30px)', lineHeight: 1.25,
                  background: style.bg ? style.bgColor + 'b3' : 'transparent',
                  padding: style.bg ? '2px 8px' : 0, borderRadius: '4px',
                  WebkitTextStroke: style.outline ? `1.5px ${style.outlineColor}` : 'none',
                  paintOrder: 'stroke fill',
                }}>{current}</span>
              </div>
            )}
          </div>

          {segments.length === 0 ? (
            <>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', fontSize: '0.88rem' }}>
                  Idioma
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} disabled={busy} style={{ background: '#0c0923', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '8px', padding: '8px 10px', color: 'white', outline: 'none' }}>
                    <option value="spanish">Español</option>
                    <option value="auto">Detección automática</option>
                    <option value="english">Inglés</option>
                  </select>
                </label>
                <button onClick={reset} disabled={busy} className="btn-secondary" style={{ padding: '9px 16px', fontSize: '0.82rem' }}><RotateCcw size={14} /> Otro video</button>
              </div>
              {busy ? (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#c4b5fd', fontSize: '0.9rem', marginBottom: '8px' }}>
                    {phase === 'model' ? `Descargando el modelo de IA por primera vez… ${progress}%` : 'Transcribiendo tu video con IA…'}
                  </p>
                  <div style={{ height: '8px', borderRadius: '99px', background: 'rgba(124,58,237,0.2)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: phase === 'model' ? `${progress}%` : '100%', background: 'linear-gradient(90deg, #7c3aed, #d946ef)', transition: 'width 0.2s', animation: phase === 'transcribing' ? 'toolpulse 1.2s ease-in-out infinite' : 'none' }} />
                  </div>
                </div>
              ) : (
                <button onClick={transcribe} className="btn-primary justify-center" style={{ width: '100%', padding: '15px' }}>
                  <Wand2 size={18} /> Generar subtítulos con IA
                </button>
              )}
            </>
          ) : (
            <>
              {/* Estilos */}
              <div style={{ background: 'rgba(17,13,48,0.6)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ color: '#c4b5fd', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><Type size={15} /> Estilo de los subtítulos</div>
                <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', fontSize: '0.82rem' }}>
                    Fuente
                    <select value={style.font} onChange={setSt('font')} style={{ background: '#0c0923', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '8px', padding: '6px 8px', color: 'white', outline: 'none' }}>
                      {FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', fontSize: '0.82rem' }}>
                    Posición
                    <select value={style.position} onChange={setSt('position')} style={{ background: '#0c0923', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '8px', padding: '6px 8px', color: 'white', outline: 'none' }}>
                      <option value="bottom">Abajo</option>
                      <option value="center">Centro</option>
                      <option value="top">Arriba</option>
                    </select>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', fontSize: '0.82rem' }}>
                    Tamaño
                    <input type="range" min="0.04" max="0.12" step="0.005" value={style.size} onChange={setSt('size')} style={{ accentColor: '#d946ef' }} />
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', fontSize: '0.82rem' }}>
                    Texto <input type="color" value={style.color} onChange={setSt('color')} style={{ width: '34px', height: '28px', border: 'none', borderRadius: '6px', background: 'none', cursor: 'pointer' }} />
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', fontSize: '0.82rem' }}>
                    <input type="checkbox" checked={style.outline} onChange={setSt('outline')} style={{ accentColor: '#d946ef', width: '16px', height: '16px' }} /> Borde
                    <input type="color" value={style.outlineColor} onChange={setSt('outlineColor')} style={{ width: '34px', height: '28px', border: 'none', borderRadius: '6px', background: 'none', cursor: 'pointer' }} />
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', fontSize: '0.82rem' }}>
                    <input type="checkbox" checked={style.bg} onChange={setSt('bg')} style={{ accentColor: '#d946ef', width: '16px', height: '16px' }} /> Fondo
                    <input type="color" value={style.bgColor} onChange={setSt('bgColor')} style={{ width: '34px', height: '28px', border: 'none', borderRadius: '6px', background: 'none', cursor: 'pointer' }} />
                  </label>
                </div>
              </div>

              {/* Segmentos editables */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '260px', overflowY: 'auto' }}>
                <div style={{ color: '#c4b5fd', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><Captions size={15} /> Subtítulos (edítalos si hace falta)</div>
                {segments.map((seg, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ color: '#6b5fa0', fontSize: '0.72rem', fontFamily: 'monospace', paddingTop: '10px', flexShrink: 0, width: '44px' }}>{fmtSrt(seg.start).slice(3, 8)}</span>
                    <input value={seg.text} onChange={(e) => editSeg(i, e.target.value)} style={{ flex: 1, background: '#0c0923', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '8px', padding: '8px 10px', color: 'white', fontSize: '0.88rem', outline: 'none' }} />
                  </div>
                ))}
              </div>

              {/* Exportar */}
              {phase === 'exporting' ? (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#c4b5fd', fontSize: '0.9rem', marginBottom: '8px' }}>Generando video con subtítulos… {progress}% (se procesa en tiempo real)</p>
                  <div style={{ height: '8px', borderRadius: '99px', background: 'rgba(124,58,237,0.2)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #7c3aed, #d946ef)', transition: 'width 0.2s' }} />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button onClick={exportVideo} className="btn-primary justify-center" style={{ flex: '1 1 220px' }}><Film size={16} /> Generar video con subtítulos</button>
                  <button onClick={downloadSrt} className="btn-secondary" style={{ padding: '11px 16px' }}><Download size={15} /> Descargar .SRT</button>
                  <button onClick={reset} className="btn-secondary" style={{ padding: '11px 16px' }}><RotateCcw size={15} /> Otro video</button>
                </div>
              )}

              {result && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.3)', borderRadius: '14px', padding: '18px' }}>
                  <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={16} /> ¡Video con subtítulos listo!</div>
                  <video src={result} controls style={{ width: '100%', borderRadius: '10px', background: '#000', maxHeight: '320px' }} />
                  <a href={result} download="video-subtitulado.webm" className="btn-primary justify-center" style={{ width: '100%' }}><Download size={16} /> Descargar video</a>
                </div>
              )}
            </>
          )}
        </>
      )}

      {error && <p style={{ color: '#f87171', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>{error}</p>}

      <p style={{ color: '#6b5fa0', fontSize: '0.78rem', lineHeight: 1.6, textAlign: 'center', margin: 0 }}>
        La primera vez se descarga el modelo de IA (~40 MB). Todo ocurre en tu navegador; tu video nunca se sube a internet.
      </p>
    </div>
  )
}
