'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, Download, Type, Sparkles, Film, RotateCcw, Wand2, Captions } from 'lucide-react'

const MAX_SECONDS = 60

const FONTS = [
  { label: 'Sans (Arial)', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Impact', value: 'Impact, Haettenschweiler, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
]

const EFFECTS = [
  { value: 'normal', label: 'Normal (sin efecto)' },
  { value: 'typewriter', label: 'Escribiéndose' },
  { value: 'scroll', label: 'Aparece desde abajo' },
  { value: 'word', label: 'Palabra por palabra' },
  { value: 'karaoke', label: 'Coloreado progresivo (karaoke)' },
]

const DEFAULT_STYLE = {
  size: 0.07,
  color: '#ffffff',
  outline: true,
  outlineColor: '#000000',
  bgColor: '#000000',
  bgOpacity: 0,        // 0 = transparente
  position: 'bottom',
  font: FONTS[0].value,
  effect: 'normal',
}

function hexToRgba(hex, a) {
  const h = (hex || '#000000').replace('#', '')
  const r = parseInt(h.substring(0, 2), 16), g = parseInt(h.substring(2, 4), 16), b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}

function fmtSrt(t) {
  const ms = Math.floor((t % 1) * 1000).toString().padStart(3, '0')
  const s = Math.floor(t % 60).toString().padStart(2, '0')
  const m = Math.floor((t / 60) % 60).toString().padStart(2, '0')
  const h = Math.floor(t / 3600).toString().padStart(2, '0')
  return `${h}:${m}:${s},${ms}`
}
function segmentsToSrt(segments) {
  return segments.map((seg, i) => `${i + 1}\n${fmtSrt(seg.start)} --> ${fmtSrt(seg.end)}\n${seg.text}\n`).join('\n')
}

// Reparte las palabras de un texto en una línea de tiempo dentro de [0, dur], dando más
// tiempo a las palabras largas. Se usa solo como respaldo cuando no hay tiempos reales por
// palabra (por ejemplo, si el usuario editó el texto del segmento a mano).
function wordTimeline(text, dur) {
  const words = text.split(/\s+/).filter(Boolean)
  const weights = words.map((w) => w.length + 1)
  const total = weights.reduce((a, b) => a + b, 0) || 1
  let acc = 0
  return words.map((w, i) => {
    const start = (acc / total) * dur
    acc += weights[i]
    return { word: w, start, end: (acc / total) * dur }
  })
}

// True si seg.words (tiempos reales por palabra de Whisper) sigue correspondiendo al texto
// actual del segmento. Si el usuario editó el texto a mano, dejan de coincidir.
function hasRealWords(seg) {
  if (!seg.words || !seg.words.length) return false
  const current = seg.text.split(/\s+/).filter(Boolean)
  return current.length === seg.words.length
}

// Avance (0..1) de "cuánto ya se habló" del segmento, usando los tiempos reales por palabra:
// cada palabra se llena mientras se está hablando (start..end) y queda llena una vez pasada,
// respetando pausas entre palabras (no es un barrido lineal parejo).
function realWordProgress(words, t) {
  const totalLen = words.reduce((a, w) => a + w.text.length + 1, 0) || 1
  let acc = 0
  for (const w of words) {
    const wLen = w.text.length + 1
    if (t >= w.end) { acc += wLen; continue }
    if (t >= w.start) acc += wLen * Math.min(1, Math.max(0, (t - w.start) / Math.max(0.01, w.end - w.start)))
    break
  }
  return Math.min(1, acc / totalLen)
}

// Para el karaoke: cada palabra del segmento con su estado "ya dicha" (lit) en el momento t.
// Una palabra se enciende en cuanto empieza a decirse y queda encendida (como letras de
// karaoke reales), en vez de un barrido de color parejo sobre todo el texto.
function karaokeWords(seg, t) {
  if (hasRealWords(seg)) {
    return seg.words.map((w) => ({ text: w.text, lit: t >= w.start }))
  }
  const dur = Math.max(0.01, seg.end - seg.start)
  const into = t - seg.start
  const timeline = wordTimeline(seg.text, dur)
  return timeline.map((w) => ({ text: w.word, lit: into >= w.start }))
}

// Devuelve el texto visible y el estado del efecto (opacidad/desplazamiento/escala/palabras) según el tiempo
function effectState(seg, t, effect) {
  let text = seg.text, alpha = 1, dyFrac = 0, scale = 1, words = null
  const dur = Math.max(0.01, seg.end - seg.start)
  const into = t - seg.start
  const realWords = hasRealWords(seg)
  if (effect === 'typewriter') {
    // Con tiempos reales, el texto se va revelando al ritmo real de cada palabra hablada
    // (en vez de un avance parejo estimado sobre el 60% de la duración del segmento).
    const rf = realWords ? realWordProgress(seg.words, t) : Math.min(1, into / (dur * 0.6))
    text = seg.text.slice(0, Math.ceil(rf * seg.text.length))
  } else if (effect === 'scroll') {
    const rf = Math.min(1, Math.max(0, into / 0.35))
    alpha = rf
    dyFrac = (1 - rf) * 0.04 // se desplaza hacia arriba al aparecer
  } else if (effect === 'word') {
    if (realWords) {
      const cur = seg.words.find((w) => t >= w.start && t < w.end) || seg.words[seg.words.length - 1]
      text = cur ? cur.text : ''
      const wordInto = cur ? t - cur.start : 0
      scale = 0.82 + 0.18 * Math.min(1, wordInto / 0.09)
    } else {
      const timeline = wordTimeline(seg.text, dur)
      const cur = timeline.find((w) => into >= w.start && into < w.end) || timeline[timeline.length - 1]
      text = cur ? cur.word : ''
      const wordInto = cur ? into - cur.start : 0
      scale = 0.82 + 0.18 * Math.min(1, wordInto / 0.09) // "pop" al aparecer cada palabra
    }
  } else if (effect === 'karaoke') {
    words = karaokeWords(seg, t) // cada palabra ya dicha o no, en vez de un barrido parejo
  }
  return { text, alpha, dyFrac, scale, words }
}

// Detección simple de inicio de habla por energía (RMS en ventanas de 20ms). Sirve para
// corregir el caso en que Whisper reporta el inicio de un segmento antes de que la persona
// realmente empiece a hablar (muy frecuente en el primer segmento, con silencio al inicio).
function computeEnergyProfile(audio, sampleRate) {
  const frameSize = Math.round(sampleRate * 0.02)
  const frames = Math.floor(audio.length / frameSize)
  const energies = new Float32Array(frames)
  for (let i = 0; i < frames; i++) {
    let sum = 0
    const base = i * frameSize
    for (let j = 0; j < frameSize; j++) { const v = audio[base + j]; sum += v * v }
    energies[i] = Math.sqrt(sum / frameSize)
  }
  return { energies, frameDur: frameSize / sampleRate }
}

function energyThreshold(energies) {
  if (!energies.length) return 0
  const sorted = Array.from(energies).sort((a, b) => a - b)
  const pct = (p) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))]
  const noiseFloor = pct(0.2), speechLevel = pct(0.85)
  return noiseFloor + (speechLevel - noiseFloor) * 0.25
}

function findSpeechOnset(energies, frameDur, threshold, fromT, toT) {
  const fromI = Math.max(0, Math.floor(fromT / frameDur))
  const toI = Math.min(energies.length - 1, Math.ceil(toT / frameDur))
  const need = 3 // ~60ms sostenidos, para no disparar con un pico de ruido aislado
  let run = 0
  for (let i = fromI; i <= toI; i++) {
    if (energies[i] >= threshold) { run++; if (run >= need) return Math.max(fromT, (i - need + 1) * frameDur) }
    else run = 0
  }
  return null
}

// Agrupa palabras (con tiempos reales) en segmentos/frases editables: corta al terminar una
// oración, tras una pausa notable entre palabras, o si el segmento ya se hizo muy largo.
function groupWordsIntoSegments(words) {
  const MAX_WORDS = 14, MAX_DUR = 6, PAUSE_GAP = 0.6
  const segments = []
  let cur = []
  const flush = () => {
    if (!cur.length) return
    segments.push({ start: cur[0].start, end: cur[cur.length - 1].end, text: cur.map((w) => w.text).join(' '), words: cur })
    cur = []
  }
  words.forEach((w, i) => {
    cur.push(w)
    const dur = w.end - cur[0].start
    const endsSentence = /[.!?]$/.test(w.text)
    const nextGap = i + 1 < words.length ? words[i + 1].start - w.end : 0
    if (endsSentence || cur.length >= MAX_WORDS || dur >= MAX_DUR || nextGap >= PAUSE_GAP) flush()
  })
  flush()
  return segments
}

// Ajusta el inicio de cada segmento al momento real en que empieza a hablarse (con 1s de
// margen antes), en vez de confiar ciegamente en el timestamp de Whisper.
function fixSegmentStarts(segs, audio, sampleRate) {
  const { energies, frameDur } = computeEnergyProfile(audio, sampleRate)
  if (!energies.length) return segs
  const threshold = energyThreshold(energies)
  return segs.map((s) => {
    const onset = findSpeechOnset(energies, frameDur, threshold, s.start, s.end)
    if (onset == null) return s
    const start = Math.min(Math.max(s.start, onset - 1), Math.max(s.start, s.end - 0.05))
    return { ...s, start }
  })
}

async function decodeAudio(file) {
  const buf = await file.arrayBuffer()
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  const ctx = new AudioCtx()
  const decoded = await ctx.decodeAudioData(buf)
  ctx.close()
  const numCh = decoded.numberOfChannels, len = decoded.length
  const mono = new Float32Array(len)
  for (let c = 0; c < numCh; c++) { const d = decoded.getChannelData(c); for (let i = 0; i < len; i++) mono[i] += d[i] / numCh }
  const target = 16000
  if (decoded.sampleRate === target) return mono
  const ratio = decoded.sampleRate / target, newLen = Math.round(len / ratio), out = new Float32Array(newLen)
  for (let i = 0; i < newLen; i++) { const idx = i * ratio, i0 = Math.floor(idx), i1 = Math.min(i0 + 1, len - 1), frac = idx - i0; out[i] = mono[i0] * (1 - frac) + mono[i1] * frac }
  return out
}

// Agrupa una lista de palabras (strings) en líneas que quepan en maxW, midiendo con ctx.
// Devuelve arreglos de índices [desde, hasta) de `items` por línea, sin reordenar nada.
function wrapWordsByWidth(ctx, texts, maxW) {
  const ranges = []
  let start = 0, curText = ''
  for (let i = 0; i < texts.length; i++) {
    const test = curText ? curText + ' ' + texts[i] : texts[i]
    if (ctx.measureText(test).width > maxW && curText) { ranges.push([start, i]); start = i; curText = texts[i] }
    else curText = test
  }
  ranges.push([start, texts.length])
  return ranges
}

// Dibuja el subtítulo sobre el canvas (para el video exportado)
function drawSubtitle(ctx, seg, t, W, H, style) {
  const { text, alpha, dyFrac, scale, words } = effectState(seg, t, style.effect)
  if (!text) return
  const fontSize = Math.round(style.size * H)
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.font = `bold ${fontSize}px ${style.font}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  const maxW = W * 0.9
  const spaceW = ctx.measureText(' ').width
  const lineRanges = wrapWordsByWidth(ctx, words ? words.map((w) => w.text) : text.split(/\s+/), maxW)
  const lines = words
    ? lineRanges.map(([a, b]) => words.slice(a, b))
    : lineRanges.map(([a, b]) => text.split(/\s+/).slice(a, b).join(' '))

  const lineH = fontSize * 1.25
  const totalH = lines.length * lineH
  const dy = dyFrac * H
  let y
  if (style.position === 'top') y = H * 0.08 + fontSize
  else if (style.position === 'center') y = H / 2 - totalH / 2 + fontSize
  else y = H - H * 0.08 - totalH + fontSize
  y += dy

  const cx = W / 2

  // Efecto "palabra por palabra": pequeño "pop" de escala centrado en el texto.
  if (scale !== 1) {
    const pivotY = y - fontSize * 0.35
    ctx.translate(cx, pivotY)
    ctx.scale(scale, scale)
    ctx.translate(-cx, -pivotY)
  }

  lines.forEach((line, i) => {
    const ly = y + i * lineH
    const lineText = words ? line.map((w) => w.text).join(' ') : line
    const tw = ctx.measureText(lineText).width
    if (style.bgOpacity > 0) {
      ctx.fillStyle = hexToRgba(style.bgColor, style.bgOpacity)
      ctx.fillRect(cx - tw / 2 - fontSize * 0.3, ly - fontSize, tw + fontSize * 0.6, lineH)
    }
    if (style.outline) {
      ctx.lineWidth = Math.max(2, fontSize * 0.12); ctx.strokeStyle = style.outlineColor; ctx.lineJoin = 'round'
      ctx.strokeText(lineText, cx, ly)
    }

    if (!words) {
      ctx.fillStyle = style.color
      ctx.fillText(lineText, cx, ly)
    } else {
      // Karaoke: cada palabra se dibuja en el color activo si ya se dijo, o apagado si no.
      ctx.textAlign = 'left'
      let x = cx - tw / 2
      line.forEach((w) => {
        ctx.fillStyle = w.lit ? style.color : hexToRgba(style.color, 0.35)
        ctx.fillText(w.text, x, ly)
        x += ctx.measureText(w.text).width + spaceW
      })
      ctx.textAlign = 'center'
    }
  })
  ctx.restore()
}

export default function SubtitleGeneratorTool() {
  const [file, setFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [language, setLanguage] = useState('spanish')
  const [phase, setPhase] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [segments, setSegments] = useState([])
  const [style, setStyle] = useState(DEFAULT_STYLE)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  const videoRef = useRef(null)
  const inputRef = useRef(null)
  const subRef = useRef(null)          // nodo del subtítulo en la vista previa (capa base)
  const transcriberRef = useRef(null)
  const audioCtxRef = useRef(null)
  const sourceRef = useRef(null)
  const rafRef = useRef(null)
  const segmentsRef = useRef(segments)
  const styleRef = useRef(style)
  segmentsRef.current = segments
  styleRef.current = style

  // Bucle de vista previa: actualiza el subtítulo cada frame (imperativo, sin re-render)
  useEffect(() => {
    if (!videoUrl) return
    const tick = () => {
      const video = videoRef.current, node = subRef.current
      if (video && node) {
        const t = video.currentTime
        const seg = segmentsRef.current.find((s) => t >= s.start && t <= s.end)
        const st = styleRef.current
        if (seg) {
          const { text, alpha, dyFrac, scale, words } = effectState(seg, t, st.effect)
          const ph = video.clientHeight || 240
          const fontPx = Math.round(st.size * ph)
          node.style.fontFamily = st.font
          node.style.fontWeight = 'bold'
          node.style.fontSize = fontPx + 'px'
          node.style.lineHeight = '1.25'
          node.style.WebkitTextStroke = st.outline ? `${Math.max(1, fontPx * 0.06)}px ${st.outlineColor}` : '0'
          node.style.paintOrder = 'stroke fill'
          node.style.padding = st.bgOpacity > 0 ? '0.1em 0.35em' : '0'
          node.style.borderRadius = '6px'
          node.style.opacity = alpha
          node.style.transform = `translateY(${dyFrac * ph}px) scale(${scale})`
          node.style.background = st.bgOpacity > 0 ? hexToRgba(st.bgColor, st.bgOpacity) : 'transparent'
          node.style.display = 'inline-block'

          if (words) {
            // Karaoke: cada palabra se pinta en el color activo si ya se dijo, apagada si no.
            node.textContent = ''
            node.innerHTML = words
              .map((w) => `<span style="color:${w.lit ? st.color : hexToRgba(st.color, 0.35)}">${w.text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span>`)
              .join(' ')
          } else {
            node.textContent = text
            node.style.color = st.color
          }
        } else {
          node.textContent = ''
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [videoUrl])

  const setSt = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : (e.target.type === 'range' ? Number(e.target.value) : e.target.value)
    setStyle((s) => ({ ...s, [k]: v }))
  }

  const onFile = (f) => {
    if (!f || !f.type.startsWith('video/')) return
    setError(''); setResult(null); setSegments([])
    const url = URL.createObjectURL(f)
    const v = document.createElement('video')
    v.preload = 'metadata'
    v.onloadedmetadata = () => {
      if (v.duration > MAX_SECONDS + 0.5) { setError(`El video dura ${Math.round(v.duration)}s. Por ahora el máximo es ${MAX_SECONDS} segundos.`); URL.revokeObjectURL(url); return }
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
        transcriberRef.current = await pipeline('automatic-speech-recognition', 'Xenova/whisper-base', {
          quantized: true,
          progress_callback: (p) => { if (p.status === 'progress' && p.progress) setProgress(Math.round(p.progress)) },
        })
      }
      setPhase('transcribing')
      const audio = await decodeAudio(file)
      // 'word' pide tiempos reales por palabra (no solo por frase), necesarios para que los
      // efectos "palabra por palabra" y "karaoke" vayan sincronizados con el audio.
      const out = await transcriberRef.current(audio, { language: language === 'auto' ? null : language, task: 'transcribe', return_timestamps: 'word', chunk_length_s: 30, stride_length_s: 5 })
      const words = (out.chunks || []).map((c) => ({ start: c.timestamp?.[0] ?? 0, end: c.timestamp?.[1] ?? 0, text: (c.text || '').trim() })).filter((w) => w.text)
      let segs = groupWordsIntoSegments(words)
      if (!segs.length && out.text) segs.push({ start: 0, end: videoRef.current?.duration || MAX_SECONDS, text: out.text.trim() })
      setSegments(fixSegmentStarts(segs, audio, 16000))
      setPhase('ready')
    } catch (e) {
      setError('No se pudo transcribir. Revisa que el video tenga audio claro y vuelve a intentar.')
      setPhase('idle')
    }
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

      // Audio: se toma directo del elemento con captureStream (conserva el audio).
      const canvasStream = canvas.captureStream(30)
      let audioTracks = []
      try {
        const cap = typeof video.captureStream === 'function' ? video.captureStream() : (video.mozCaptureStream ? video.mozCaptureStream() : null)
        if (cap) audioTracks = cap.getAudioTracks()
      } catch { audioTracks = [] }
      const mixed = new MediaStream([...canvasStream.getVideoTracks(), ...audioTracks])
      const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ? 'video/webm;codecs=vp9,opus' : 'video/webm'
      const rec = new MediaRecorder(mixed, { mimeType: mime })
      const chunks = []
      rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data) }
      const stopped = new Promise((res) => { rec.onstop = res })
      const st = styleRef.current
      let raf
      const draw = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const t = video.currentTime
        const seg = segments.find((s) => t >= s.start && t <= s.end)
        if (seg) drawSubtitle(ctx, seg, t, canvas.width, canvas.height, st)
        setProgress(Math.min(99, Math.round((t / (video.duration || 1)) * 100)))
        if (!video.paused && !video.ended) raf = requestAnimationFrame(draw)
      }
      video.currentTime = 0
      await video.play()
      rec.start()
      draw()
      video.onended = () => { cancelAnimationFrame(raf); if (rec.state !== 'inactive') rec.stop() }
      await stopped
      let blob = new Blob(chunks, { type: 'video/webm' })
      try { const mod = await import('fix-webm-duration'); const fix = mod.default || mod; blob = await fix(blob, Math.round((video.duration || 0) * 1000), { logger: false }) } catch { /* noop */ }
      setResult(URL.createObjectURL(blob)); setProgress(100); setPhase('ready')
    } catch (e) {
      setError('No se pudo generar el video con subtítulos. Intenta de nuevo.'); setPhase('ready')
    }
  }

  const downloadSrt = () => {
    const blob = new Blob([segmentsToSrt(segments)], { type: 'text/plain' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'subtitulos.srt'; a.click()
  }
  const reset = () => { setFile(null); setVideoUrl(''); setSegments([]); setResult(null); setError('') ; if (inputRef.current) inputRef.current.value = '' }

  const busy = phase === 'model' || phase === 'transcribing' || phase === 'exporting'
  const subPos = style.position === 'top' ? { top: '8%' } : style.position === 'center' ? { top: '50%', transform: 'translateY(-50%)' } : { bottom: '8%' }
  const colorInput = { width: '34px', height: '28px', border: 'none', borderRadius: '6px', background: 'none', cursor: 'pointer' }
  const selectS = { background: '#0c0923', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '8px', padding: '6px 8px', color: 'white', outline: 'none' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {!file ? (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); onFile(e.dataTransfer.files?.[0]) }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '48px 24px', borderRadius: '16px', border: `2px dashed ${dragging ? '#e879f9' : 'rgba(124,58,237,0.4)'}`, background: dragging ? 'rgba(124,58,237,0.12)' : 'rgba(12,9,35,0.5)', cursor: 'pointer', textAlign: 'center', transition: 'border-color 0.2s, background 0.2s' }}
        >
          <Upload size={30} style={{ color: '#e879f9' }} />
          <span style={{ color: 'white', fontWeight: 700 }}>Arrastra tu video aquí o haz clic para subirlo</span>
          <span style={{ color: '#9d8fc2', fontSize: '0.85rem' }}>Máximo 60 segundos. Se procesa en tu navegador; tu video no se sube a internet.</span>
          <input ref={inputRef} type="file" accept="video/*" onChange={(e) => onFile(e.target.files[0])} style={{ display: 'none' }} />
        </label>
      ) : (
        <>
          <div style={{ position: 'relative', width: 'fit-content', maxWidth: '100%', margin: '0 auto', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(124,58,237,0.3)', background: '#000' }}>
            <video ref={videoRef} src={videoUrl} controls style={{ display: 'block', maxHeight: '460px', maxWidth: '100%', height: 'auto', width: 'auto' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', padding: '0 5%', pointerEvents: 'none', ...subPos }}>
              <span ref={subRef} style={{ display: 'inline-block' }} />
            </div>
          </div>

          {segments.length === 0 ? (
            <>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', fontSize: '0.88rem' }}>
                  Idioma
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} disabled={busy} style={selectS}>
                    <option value="spanish">Español</option>
                    <option value="auto">Detección automática</option>
                    <option value="english">Inglés</option>
                  </select>
                </label>
                <button onClick={reset} disabled={busy} className="btn-secondary" style={{ padding: '9px 16px', fontSize: '0.82rem' }}><RotateCcw size={14} /> Otro video</button>
              </div>
              {busy ? (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#c4b5fd', fontSize: '0.9rem', marginBottom: '8px' }}>{phase === 'model' ? `Descargando el modelo de IA por primera vez… ${progress}%` : 'Transcribiendo tu video con IA…'}</p>
                  <div style={{ height: '8px', borderRadius: '99px', background: 'rgba(124,58,237,0.2)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: phase === 'model' ? `${progress}%` : '100%', background: 'linear-gradient(90deg, #7c3aed, #d946ef)', transition: 'width 0.2s', animation: phase === 'transcribing' ? 'toolpulse 1.2s ease-in-out infinite' : 'none' }} />
                  </div>
                </div>
              ) : (
                <button onClick={transcribe} className="btn-primary justify-center" style={{ width: '100%', padding: '15px' }}><Wand2 size={18} /> Generar subtítulos con IA</button>
              )}
            </>
          ) : (
            <>
              {/* Estilos */}
              <div style={{ background: 'rgba(17,13,48,0.6)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ color: '#c4b5fd', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><Type size={15} /> Estilo de los subtítulos</div>
                <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', fontSize: '0.82rem' }}>Efecto
                    <select value={style.effect} onChange={setSt('effect')} style={selectS}>{EFFECTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}</select>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', fontSize: '0.82rem' }}>Fuente
                    <select value={style.font} onChange={setSt('font')} style={selectS}>{FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}</select>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', fontSize: '0.82rem' }}>Posición
                    <select value={style.position} onChange={setSt('position')} style={selectS}><option value="bottom">Abajo</option><option value="center">Centro</option><option value="top">Arriba</option></select>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', fontSize: '0.82rem' }}>Tamaño
                    <input type="range" min="0.04" max="0.14" step="0.005" value={style.size} onChange={setSt('size')} style={{ accentColor: '#d946ef' }} />
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', fontSize: '0.82rem' }}>Texto <input type="color" value={style.color} onChange={setSt('color')} style={colorInput} /></label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', fontSize: '0.82rem' }}>
                    <input type="checkbox" checked={style.outline} onChange={setSt('outline')} style={{ accentColor: '#d946ef', width: '16px', height: '16px' }} /> Borde <input type="color" value={style.outlineColor} onChange={setSt('outlineColor')} style={colorInput} />
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', fontSize: '0.82rem' }}>
                    Fondo <input type="color" value={style.bgColor} onChange={setSt('bgColor')} style={colorInput} />
                    <span style={{ color: '#6b5fa0' }}>opacidad</span>
                    <input type="range" min="0" max="1" step="0.05" value={style.bgOpacity} onChange={setSt('bgOpacity')} style={{ accentColor: '#d946ef', width: '90px' }} />
                    <span style={{ color: '#9d8fc2', minWidth: '34px' }}>{Math.round(style.bgOpacity * 100)}%</span>
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
                  <video src={result} controls style={{ display: 'block', margin: '0 auto', maxWidth: '100%', maxHeight: '340px', width: 'auto', height: 'auto', borderRadius: '10px', background: '#000' }} />
                  <a href={result} download="video-subtitulado.webm" className="btn-primary justify-center" style={{ width: '100%' }}><Download size={16} /> Descargar video</a>
                </div>
              )}
            </>
          )}
        </>
      )}

      {error && <p style={{ color: '#f87171', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>{error}</p>}

      <p style={{ color: '#6b5fa0', fontSize: '0.78rem', lineHeight: 1.6, textAlign: 'center', margin: 0 }}>
        La primera vez se descarga el modelo de IA (~80 MB). Todo ocurre en tu navegador; tu video nunca se sube a internet.
      </p>
    </div>
  )
}
