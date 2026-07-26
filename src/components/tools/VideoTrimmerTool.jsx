'use client'

import { useState, useRef } from 'react'
import { Scissors, Upload, Download, Music, Film, Flag, RotateCcw } from 'lucide-react'

function fmt(s) {
  if (!isFinite(s)) return '00:00'
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const sec = Math.floor(s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

export default function VideoTrimmerTool() {
  const [file, setFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [duration, setDuration] = useState(0)
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(0)
  const [mode, setMode] = useState('trim') // trim | audio
  const [phase, setPhase] = useState('idle') // idle | loading | processing
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null) // { url, name, type }
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  const videoRef = useRef(null)
  const ffmpegRef = useRef(null)
  const inputRef = useRef(null)

  const onFile = (f) => {
    if (!f || !f.type.startsWith('video/')) return
    setError(''); setResult(null)
    setFile(f)
    const url = URL.createObjectURL(f)
    setVideoUrl(url)
    setStart(0); setEnd(0)
  }

  const onMeta = () => {
    const d = videoRef.current?.duration || 0
    setDuration(d)
    setEnd(d)
  }

  const markStart = () => { const t = videoRef.current?.currentTime || 0; setStart(Math.min(t, end)) }
  const markEnd = () => { const t = videoRef.current?.currentTime || 0; setEnd(Math.max(t, start)) }

  const loadFfmpeg = async () => {
    if (ffmpegRef.current) return ffmpegRef.current
    setPhase('loading')
    const { FFmpeg } = await import('@ffmpeg/ffmpeg')
    const { toBlobURL } = await import('@ffmpeg/util')
    const ffmpeg = new FFmpeg()
    ffmpeg.on('progress', ({ progress: p }) => setProgress(Math.max(0, Math.min(100, Math.round(p * 100)))))
    await ffmpeg.load({
      coreURL: await toBlobURL('/ffmpeg/ffmpeg-core.js', 'text/javascript'),
      wasmURL: await toBlobURL('/ffmpeg/ffmpeg-core.wasm', 'application/wasm'),
    })
    ffmpegRef.current = ffmpeg
    return ffmpeg
  }

  const process = async () => {
    if (!file) return
    setError(''); setResult(null); setProgress(0)
    try {
      const ffmpeg = await loadFfmpeg()
      const { fetchFile } = await import('@ffmpeg/util')
      setPhase('processing')
      const inName = 'input' + (file.name.match(/\.[a-z0-9]+$/i)?.[0] || '.mp4')
      await ffmpeg.writeFile(inName, await fetchFile(file))

      let outName, args, type
      if (mode === 'audio') {
        outName = 'salida.m4a'; type = 'audio/mp4'
        args = ['-i', inName, '-vn', '-acodec', 'copy', outName]
      } else {
        outName = 'recorte.mp4'; type = 'video/mp4'
        const dur = Math.max(0.1, end - start)
        args = ['-ss', String(start), '-i', inName, '-t', String(dur), '-c', 'copy', outName]
      }
      await ffmpeg.exec(args)
      const data = await ffmpeg.readFile(outName)
      const blob = new Blob([data.buffer], { type })
      setResult({ url: URL.createObjectURL(blob), name: outName, type })
      setPhase('idle')
    } catch (e) {
      setError('No se pudo procesar el video. Prueba con otro archivo o un tramo distinto.')
      setPhase('idle')
    }
  }

  const reset = () => {
    setFile(null); setVideoUrl(''); setResult(null); setError(''); setDuration(0); setStart(0); setEnd(0)
    if (inputRef.current) inputRef.current.value = ''
  }

  const busy = phase !== 'idle'

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
          <span style={{ color: '#9d8fc2', fontSize: '0.85rem' }}>MP4, WebM, MOV… Se procesa en tu navegador, no se sube a internet.</span>
          <input ref={inputRef} type="file" accept="video/*" onChange={(e) => onFile(e.target.files[0])} style={{ display: 'none' }} />
        </label>
      ) : (
        <>
          <video ref={videoRef} src={videoUrl} onLoadedMetadata={onMeta} controls style={{ display: 'block', margin: '0 auto', maxWidth: '100%', maxHeight: '380px', width: 'auto', height: 'auto', borderRadius: '14px', border: '1px solid rgba(124,58,237,0.3)', background: '#000' }} />

          {/* Modo */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {[['trim', 'Recortar', Scissors], ['audio', 'Extraer audio', Music]].map(([key, label, Icon]) => (
              <button key={key} onClick={() => setMode(key)} disabled={busy} style={{
                flex: 1, padding: '12px', borderRadius: '10px', cursor: busy ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.88rem',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: mode === key ? 'linear-gradient(135deg, #7c3aed, #d946ef)' : 'rgba(12,9,35,0.6)',
                color: mode === key ? 'white' : '#9d8fc2', border: `1px solid ${mode === key ? 'transparent' : 'rgba(124,58,237,0.25)'}`,
              }}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>

          {/* Controles de recorte */}
          {mode === 'trim' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(17,13,48,0.6)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '14px', padding: '18px' }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={markStart} disabled={busy} className="btn-secondary" style={{ flex: '1 1 140px', fontSize: '0.82rem', padding: '10px' }}>
                  <Flag size={14} /> Marcar inicio ({fmt(start)})
                </button>
                <button onClick={markEnd} disabled={busy} className="btn-secondary" style={{ flex: '1 1 140px', fontSize: '0.82rem', padding: '10px' }}>
                  <Flag size={14} /> Marcar fin ({fmt(end)})
                </button>
              </div>
              <p style={{ color: '#9d8fc2', fontSize: '0.82rem', margin: 0, textAlign: 'center' }}>
                Mueve el video al punto deseado y marca inicio o fin. Recorte: <strong style={{ color: '#e879f9' }}>{fmt(start)} → {fmt(end)}</strong> ({fmt(Math.max(0, end - start))})
              </p>
            </div>
          )}

          {/* Progreso */}
          {busy && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#c4b5fd', fontSize: '0.9rem', marginBottom: '8px' }}>
                {phase === 'loading' ? 'Cargando el editor por primera vez (~30 MB)…' : `Procesando… ${progress}%`}
              </p>
              <div style={{ height: '8px', borderRadius: '99px', background: 'rgba(124,58,237,0.2)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: phase === 'loading' ? '100%' : `${progress}%`, background: 'linear-gradient(90deg, #7c3aed, #d946ef)', transition: 'width 0.2s', animation: phase === 'loading' ? 'toolpulse 1.2s ease-in-out infinite' : 'none' }} />
              </div>
            </div>
          )}

          {/* Acciones */}
          {!busy && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={process} className="btn-primary justify-center" style={{ flex: '1 1 200px' }}>
                {mode === 'audio' ? <><Music size={16} /> Extraer audio</> : <><Scissors size={16} /> Recortar video</>}
              </button>
              <button onClick={reset} className="btn-secondary" style={{ padding: '11px 18px' }}>
                <RotateCcw size={15} /> Otro video
              </button>
            </div>
          )}

          {/* Resultado */}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.3)', borderRadius: '14px', padding: '18px' }}>
              <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Film size={16} /> ¡Listo!
              </div>
              {result.type.startsWith('video') ? (
                <video src={result.url} controls style={{ display: 'block', margin: '0 auto', maxWidth: '100%', maxHeight: '300px', width: 'auto', height: 'auto', borderRadius: '10px', background: '#000' }} />
              ) : (
                <audio src={result.url} controls style={{ width: '100%' }} />
              )}
              <a href={result.url} download={result.name} className="btn-primary justify-center" style={{ width: '100%' }}>
                <Download size={16} /> Descargar {result.name}
              </a>
            </div>
          )}
        </>
      )}

      {error && <p style={{ color: '#f87171', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>{error}</p>}

      <p style={{ color: '#6b5fa0', fontSize: '0.78rem', lineHeight: 1.6, textAlign: 'center', margin: 0 }}>
        La primera vez se descarga el motor de edición (~30 MB); después es más rápido. Todo el proceso ocurre en tu navegador.
      </p>
    </div>
  )
}
