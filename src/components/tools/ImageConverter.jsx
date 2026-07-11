'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Download, X } from 'lucide-react'

const FORMATS = [
  { key: 'image/jpeg', label: 'JPG', ext: 'jpg', lossy: true },
  { key: 'image/png', label: 'PNG', ext: 'png', lossy: false },
  { key: 'image/webp', label: 'WebP', ext: 'webp', lossy: true },
]

function fmtSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function ImageConverter() {
  const [src, setSrc] = useState(null)
  const [fileName, setFileName] = useState('')
  const [originalSize, setOriginalSize] = useState(0)
  const [target, setTarget] = useState('image/webp')
  const [quality, setQuality] = useState(0.85)
  const imgRef = useRef(null)
  const inputRef = useRef(null)

  const onFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    setFileName(file.name.replace(/\.[^.]+$/, ''))
    setOriginalSize(file.size)
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        imgRef.current = img
        setSrc(e.target.result)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }, [])

  const targetFmt = FORMATS.find((f) => f.key === target)

  const download = () => {
    if (!imgRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = imgRef.current.width
    canvas.height = imgRef.current.height
    const ctx = canvas.getContext('2d')
    if (target === 'image/jpeg') {
      // JPG no soporta transparencia: fondo blanco.
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    ctx.drawImage(imgRef.current, 0, 0)
    canvas.toBlob(
      (blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${fileName || 'imagen'}.${targetFmt.ext}`
        a.click()
        URL.revokeObjectURL(url)
      },
      target,
      targetFmt.lossy ? quality : undefined,
    )
  }

  const reset = () => {
    setSrc(null)
    setOriginalSize(0)
    imgRef.current = null
    if (inputRef.current) inputRef.current.value = ''
  }

  if (!src) {
    return (
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files[0]) }}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px',
          padding: '48px 20px', border: '2px dashed rgba(217,70,239,0.4)', borderRadius: '16px', cursor: 'pointer',
          background: 'rgba(12,9,35,0.4)', textAlign: 'center',
        }}
      >
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(217,70,239,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Upload size={26} style={{ color: '#d946ef' }} />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', background: '#0c0923', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', justifyContent: 'center' }}>
        <img src={src} alt="Vista previa" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', display: 'block' }} />
        <button onClick={reset} aria-label="Quitar imagen" style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(12,9,35,0.85)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#e9d5ff', display: 'flex' }}>
          <X size={16} />
        </button>
      </div>

      <p style={{ color: '#9d8fc2', fontSize: '0.82rem' }}>Tamaño original: {fmtSize(originalSize)}</p>

      {/* Formato destino */}
      <div>
        <label style={{ display: 'block', color: '#c4b5fd', fontSize: '0.88rem', fontWeight: 600, marginBottom: '10px' }}>Convertir a</label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {FORMATS.map((f) => (
            <button
              key={f.key}
              onClick={() => setTarget(f.key)}
              style={{
                flex: '1 1 90px', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem',
                background: target === f.key ? 'linear-gradient(135deg, #7c3aed, #d946ef)' : 'rgba(12,9,35,0.6)',
                color: target === f.key ? 'white' : '#9d8fc2',
                border: `1px solid ${target === f.key ? 'transparent' : 'rgba(124,58,237,0.25)'}`,
                transition: 'all 0.2s',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calidad (solo formatos con pérdida) */}
      {targetFmt.lossy && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label htmlFor="q" style={{ color: '#c4b5fd', fontSize: '0.88rem', fontWeight: 600 }}>Calidad</label>
            <span style={{ color: 'white', fontWeight: 700 }}>{Math.round(quality * 100)}%</span>
          </div>
          <input id="q" type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(Number(e.target.value))} style={{ width: '100%', accentColor: '#d946ef', cursor: 'pointer' }} />
        </div>
      )}

      <button onClick={download} className="btn-primary justify-center" style={{ width: '100%' }}>
        <Download size={18} /> Descargar {targetFmt.label}
      </button>
    </div>
  )
}
