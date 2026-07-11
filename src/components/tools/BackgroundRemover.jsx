'use client'

import { useState, useRef } from 'react'
import { Upload, Download, Wand2, Loader2 } from 'lucide-react'

// Fondo a cuadros para que se note la transparencia del resultado.
const CHECKER =
  'repeating-conic-gradient(#2a2540 0% 25%, #1a1530 0% 50%) 50% / 20px 20px'

export default function BackgroundRemover() {
  const [src, setSrc] = useState(null)
  const [fileName, setFileName] = useState('')
  const [result, setResult] = useState(null) // object URL of transparent PNG
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const fileRef = useRef(null)
  const inputRef = useRef(null)

  const onFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return
    setFileName(f.name.replace(/\.[^.]+$/, ''))
    fileRef.current = f
    setResult(null)
    setSrc(URL.createObjectURL(f))
  }

  const reset = () => {
    if (src) URL.revokeObjectURL(src)
    if (result) URL.revokeObjectURL(result)
    setSrc(null); setResult(null); setProgress(''); fileRef.current = null
    if (inputRef.current) inputRef.current.value = ''
  }

  const run = async () => {
    if (!fileRef.current) return
    setBusy(true)
    setResult(null)
    setProgress('Cargando el modelo…')
    try {
      const { removeBackground } = await import('@imgly/background-removal')
      const blob = await removeBackground(fileRef.current, {
        output: { format: 'image/png' },
        progress: (key, current, total) => {
          if (key.startsWith('fetch')) {
            const pct = total ? Math.round((current / total) * 100) : 0
            setProgress(`Descargando el modelo… ${pct}%`)
          } else {
            setProgress('Quitando el fondo…')
          }
        },
      })
      setResult(URL.createObjectURL(blob))
    } catch {
      alert('No se pudo quitar el fondo. Intenta con otra imagen.')
    } finally {
      setBusy(false)
      setProgress('')
    }
  }

  const download = () => {
    if (!result) return
    const a = document.createElement('a')
    a.href = result
    a.download = `${fileName || 'imagen'}-sin-fondo.png`
    a.click()
  }

  if (!src) {
    return (
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files[0]) }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '48px 20px', border: '2px dashed rgba(124,58,237,0.4)', borderRadius: '16px', cursor: 'pointer', background: 'rgba(12,9,35,0.4)', textAlign: 'center' }}
      >
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Wand2 size={26} style={{ color: '#a78bfa' }} />
        </div>
        <div>
          <p style={{ color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Toca para elegir una imagen</p>
          <p style={{ color: '#9d8fc2', fontSize: '0.85rem' }}>o arrástrala aquí — JPG, PNG, WebP</p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={(e) => onFile(e.target.files[0])} style={{ display: 'none' }} />
      </label>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Antes / Después */}
      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '12px' }}>
        <div>
          <p style={{ color: '#9d8fc2', fontSize: '0.75rem', textAlign: 'center', marginBottom: '6px' }}>Original</p>
          <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#0c0923', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', justifyContent: 'center' }}>
            <img src={src} alt="Original" style={{ maxWidth: '100%', maxHeight: '260px', objectFit: 'contain', display: 'block' }} />
          </div>
        </div>
        {result && (
          <div>
            <p style={{ color: '#a78bfa', fontSize: '0.75rem', textAlign: 'center', marginBottom: '6px', fontWeight: 700 }}>Sin fondo</p>
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(124,58,237,0.35)', background: CHECKER, display: 'flex', justifyContent: 'center' }}>
              <img src={result} alt="Sin fondo" style={{ maxWidth: '100%', maxHeight: '260px', objectFit: 'contain', display: 'block' }} />
            </div>
          </div>
        )}
      </div>

      {result ? (
        <>
          <button onClick={download} className="btn-primary justify-center" style={{ width: '100%' }}>
            <Download size={18} /> Descargar PNG sin fondo
          </button>
          <button onClick={reset} className="btn-secondary justify-center" style={{ width: '100%' }}>
            Probar otra imagen
          </button>
        </>
      ) : (
        <>
          <button onClick={run} disabled={busy} className="btn-primary justify-center" style={{ width: '100%', opacity: busy ? 0.6 : 1 }}>
            {busy ? <><Loader2 size={18} className="spin" /> {progress || 'Procesando…'}</> : <><Wand2 size={18} /> Quitar fondo</>}
          </button>
          {!busy && (
            <button onClick={reset} className="btn-secondary justify-center" style={{ width: '100%' }}>
              Elegir otra imagen
            </button>
          )}
          {busy && progress.startsWith('Descargando') && (
            <p style={{ color: '#6b5fa0', fontSize: '0.78rem', textAlign: 'center', margin: 0 }}>
              La primera vez descarga el modelo de IA; luego es mucho más rápido.
            </p>
          )}
        </>
      )}
    </div>
  )
}
