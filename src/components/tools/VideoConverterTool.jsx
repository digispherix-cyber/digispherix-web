'use client'

import { useState, useRef } from 'react'
import { FileVideo, Upload, Download, RotateCcw, Zap, Clock } from 'lucide-react'

const MAX_SECONDS = 60

// reencode = argumentos si hay que recomprimir (cuando la copia directa no aplica).
// previewable = el navegador puede reproducirlo en un <video>. .ts y .mkv no se
// pueden previsualizar en el navegador (pero se convierten y descargan bien).
// Nota: no ofrecemos WebM como destino porque el motor ligero (self-hosted) no
// incluye el codificador libvpx. Los WebM sí se pueden convertir a estos formatos.
const REENC = ['-c:v', 'libx264', '-preset', 'ultrafast', '-pix_fmt', 'yuv420p', '-c:a', 'aac']
const FORMATS = [
  { ext: 'mp4', label: 'MP4', mime: 'video/mp4',        reencode: REENC, previewable: true },
  { ext: 'mov', label: 'MOV', mime: 'video/quicktime',  reencode: REENC, previewable: false },
  { ext: 'mkv', label: 'MKV', mime: 'video/x-matroska', reencode: REENC, previewable: false },
  { ext: 'ts',  label: 'TS',  mime: 'video/mp2t',       reencode: [...REENC, '-bsf:v', 'h264_mp4toannexb'], previewable: false },
]

export default function VideoConverterTool() {
  const [file, setFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [duration, setDuration] = useState(0)
  const [target, setTarget] = useState('mp4')
  const [phase, setPhase] = useState('idle') // idle | loading | processing
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null) // { url, name, mime }
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  const videoRef = useRef(null)
  const ffmpegRef = useRef(null)
  const inputRef = useRef(null)

  const srcExt = (file?.name.match(/\.([a-z0-9]+)$/i)?.[1] || '').toLowerCase()

  const onFile = (f) => {
    if (!f || !f.type.startsWith('video/')) return
    setError(''); setResult(null)
    setFile(f)
    setVideoUrl(URL.createObjectURL(f))
    // sugerir un destino distinto al de origen
    const inExt = (f.name.match(/\.([a-z0-9]+)$/i)?.[1] || '').toLowerCase()
    setTarget(inExt === 'mp4' ? 'mov' : 'mp4')
  }

  const onMeta = () => setDuration(videoRef.current?.duration || 0)

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

  const fileExists = async (ffmpeg, name) => {
    try {
      const list = await ffmpeg.listDir('/')
      return list.some((e) => e.name === name && !e.isDir)
    } catch { return false }
  }

  const convert = async () => {
    if (!file) return
    if (duration && duration > MAX_SECONDS + 1) {
      setError(`El video dura ${Math.round(duration)}s. Para que la conversión sea rápida, usa videos de máximo ${MAX_SECONDS} segundos.`)
      return
    }
    setError(''); setResult(null); setProgress(0)
    const fmt = FORMATS.find((f) => f.ext === target)
    try {
      const ffmpeg = await loadFfmpeg()
      const { fetchFile } = await import('@ffmpeg/util')
      setPhase('processing')
      const inName = 'entrada.' + (srcExt || 'mp4')
      const outName = 'salida.' + fmt.ext
      await ffmpeg.writeFile(inName, await fetchFile(file))
      try { await ffmpeg.deleteFile(outName) } catch {}

      let ok = false
      // 1) intento rápido: solo cambiar contenedor (sin recomprimir)
      try {
        const args = ['-i', inName, '-c', 'copy']
        if (fmt.ext === 'ts') args.push('-bsf:v', 'h264_mp4toannexb')
        if (fmt.ext === 'mp4' || fmt.ext === 'mov') args.push('-movflags', 'faststart')
        args.push(outName)
        await ffmpeg.exec(args)
        ok = await fileExists(ffmpeg, outName)
      } catch { ok = false }
      // 2) si no funcionó (códecs incompatibles con el contenedor): recomprimir
      if (!ok) {
        try { await ffmpeg.deleteFile(outName) } catch {}
        setProgress(0)
        const args = ['-i', inName, ...fmt.reencode]
        if (fmt.ext === 'mp4' || fmt.ext === 'mov') args.push('-movflags', 'faststart')
        args.push(outName)
        await ffmpeg.exec(args)
        ok = await fileExists(ffmpeg, outName)
      }
      if (!ok) throw new Error('conversion failed')

      const data = await ffmpeg.readFile(outName)
      const blob = new Blob([data.buffer], { type: fmt.mime })
      const base = (file.name.replace(/\.[a-z0-9]+$/i, '') || 'video')
      setResult({ url: URL.createObjectURL(blob), name: `${base}.${fmt.ext}`, mime: fmt.mime, previewable: fmt.previewable })
      setPhase('idle')
    } catch (e) {
      // El motor puede quedar en mal estado tras un fallo: lo reiniciamos para
      // que el siguiente intento arranque limpio (y no se cuelgue).
      ffmpegRef.current = null
      setError('No se pudo convertir el video a ' + fmt.label + '. Prueba con otro formato de destino o un video distinto.')
      setPhase('idle')
    }
  }

  const reset = () => {
    setFile(null); setVideoUrl(''); setResult(null); setError(''); setDuration(0); setProgress(0)
    if (inputRef.current) inputRef.current.value = ''
  }

  const busy = phase !== 'idle'
  const targetFmt = FORMATS.find((f) => f.ext === target)
  // Un WebM de origen no se puede copiar directo a estos contenedores, así que
  // hay que recomprimirlo (lento). Cualquier otro origen suele ir por copia (rápido).
  const fromWebm = srcExt === 'webm'
  const slow = fromWebm

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {!file ? (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); onFile(e.dataTransfer.files?.[0]) }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '48px 24px', borderRadius: '16px', border: `2px dashed ${dragging ? 'var(--accent-4)' : 'var(--border)'}`, background: dragging ? 'rgba(124,58,237,0.12)' : 'var(--bg-card-alt)', cursor: 'pointer', textAlign: 'center', transition: 'border-color 0.2s, background 0.2s' }}
        >
          <Upload size={30} style={{ color: 'var(--accent-4)' }} />
          <span style={{ color: 'var(--text-strong)', fontWeight: 700 }}>Arrastra tu video aquí o haz clic para subirlo</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>MP4, WebM, MOV, MKV… Se convierte en tu navegador, no se sube a internet.</span>
          <input ref={inputRef} type="file" accept="video/*" onChange={(e) => onFile(e.target.files[0])} style={{ display: 'none' }} />
        </label>
      ) : (
        <>
          <video ref={videoRef} src={videoUrl} onLoadedMetadata={onMeta} controls style={{ display: 'block', margin: '0 auto', maxWidth: '100%', maxHeight: '340px', width: 'auto', height: 'auto', borderRadius: '14px', border: '1px solid var(--border)', background: '#000' }} />

          {/* Formato de destino */}
          <div style={{ background: 'var(--bg-card-alt)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
            <p style={{ color: 'var(--text)', fontSize: '0.85rem', fontWeight: 700, margin: '0 0 12px' }}>Convertir a:</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {FORMATS.map((f) => {
                const active = target === f.ext
                const same = f.ext === srcExt
                return (
                  <button key={f.ext} onClick={() => !same && setTarget(f.ext)} disabled={busy || same} title={same ? 'El video ya está en este formato' : ''} style={{
                    flex: '1 1 90px', padding: '11px 10px', borderRadius: '10px', cursor: (busy || same) ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.9rem',
                    display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '3px', opacity: same ? 0.4 : 1,
                    background: active ? 'linear-gradient(135deg, #7c3aed, #d946ef)' : 'var(--bg-card-alt)',
                    color: active ? 'white' : 'var(--text-muted)', border: `1px solid ${active ? 'transparent' : 'var(--border)'}`,
                  }}>
                    {f.label}
                    <span style={{ fontSize: '0.62rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px', color: active ? 'rgba(255,255,255,0.85)' : (fromWebm ? '#fbbf24' : '#34d399') }}>
                      {fromWebm ? <><Clock size={9} /> lento</> : <><Zap size={9} /> rápido</>}
                    </span>
                  </button>
                )
              })}
            </div>
            {slow && (
              <p style={{ color: '#fbbf24', fontSize: '0.78rem', lineHeight: 1.5, margin: '12px 0 0', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <Clock size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
                Tu video es WebM, así que hay que recomprimirlo y puede tardar varios minutos (todo ocurre en tu navegador).
              </p>
            )}
          </div>

          {/* Progreso */}
          {busy && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--text)', fontSize: '0.9rem', marginBottom: '8px' }}>
                {phase === 'loading' ? 'Cargando el motor por primera vez (~30 MB)…' : (slow ? `Convirtiendo… ${progress}% (puede tardar)` : `Convirtiendo… ${progress}%`)}
              </p>
              <div style={{ height: '8px', borderRadius: '99px', background: 'var(--bg-card-alt)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: phase === 'loading' ? '100%' : `${progress}%`, background: 'linear-gradient(90deg, #7c3aed, #d946ef)', transition: 'width 0.2s', animation: phase === 'loading' ? 'toolpulse 1.2s ease-in-out infinite' : 'none' }} />
              </div>
            </div>
          )}

          {/* Acciones */}
          {!busy && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={convert} className="btn-primary justify-center" style={{ flex: '1 1 200px' }}>
                <FileVideo size={16} /> Convertir a {targetFmt?.label}
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
                <FileVideo size={16} /> ¡Listo! {result.name}
              </div>
              {result.previewable ? (
                <video src={result.url} controls style={{ display: 'block', margin: '0 auto', maxWidth: '100%', maxHeight: '300px', width: 'auto', height: 'auto', borderRadius: '10px', background: '#000' }} />
              ) : (
                <p style={{ color: 'var(--text)', fontSize: '0.82rem', lineHeight: 1.5, margin: 0, textAlign: 'center' }}>
                  Tu navegador no puede reproducir el formato {targetFmt?.label} aquí, pero el video se convirtió correctamente. Descárgalo para verlo o usarlo.
                </p>
              )}
              <a href={result.url} download={result.name} className="btn-primary justify-center" style={{ width: '100%' }}>
                <Download size={16} /> Descargar {result.name}
              </a>
            </div>
          )}
        </>
      )}

      {error && <p style={{ color: '#f87171', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>{error}</p>}

      <p style={{ color: 'var(--text-dim)', fontSize: '0.78rem', lineHeight: 1.6, textAlign: 'center', margin: 0 }}>
        La primera vez se descarga el motor de conversión (~30 MB); después es más rápido. Ideal para videos de máximo 1 minuto. Todo ocurre en tu navegador, sin subir nada a internet.
      </p>
    </div>
  )
}
