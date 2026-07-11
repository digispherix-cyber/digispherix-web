'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Upload, Download, X } from 'lucide-react'

const FORMATS = [
  { key: 'image/jpeg', label: 'JPG', ext: 'jpg' },
  { key: 'image/webp', label: 'WebP', ext: 'webp' },
]

function fmtSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function ImageCompressor() {
  const [src, setSrc] = useState(null)
  const [fileName, setFileName] = useState('')
  const [originalSize, setOriginalSize] = useState(0)
  const [format, setFormat] = useState('image/jpeg')
  const [quality, setQuality] = useState(0.7)
  const [outBlob, setOutBlob] = useState(null)
  const imgRef = useRef(null)
  const inputRef = useRef(null)

  const onFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    setFileName(file.name.replace(/\.[^.]+$/, ''))
    setOriginalSize(file.size)
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => { imgRef.current = img; setSrc(e.target.result) }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }, [])

  // Recalcula el tamaño comprimido cuando cambia calidad/formato/imagen.
  useEffect(() => {
    if (!imgRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = imgRef.current.width
    canvas.height = imgRef.current.height
    const ctx = canvas.getContext('2d')
    if (format === 'image/jpeg') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height) }
    ctx.drawImage(imgRef.current, 0, 0)
    canvas.toBlob((blob) => setOutBlob(blob), format, quality)
  }, [src, format, quality])

  const download = () => {
    if (!outBlob) return
    const fmt = FORMATS.find((f) => f.key === format)
    const url = URL.createObjectURL(outBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fileName || 'imagen'}-comprimida.${fmt.ext}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const reset = () => {
    setSrc(null); setOriginalSize(0); setOutBlob(null); imgRef.current = null
    if (inputRef.current) inputRef.current.value = ''
  }

  if (!src) {
    return (
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files[0]) }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '48px 20px', border: '2px dashed rgba(8,145,178,0.4)', borderRadius: '16px', cursor: 'pointer', background: 'rgba(12,9,35,0.4)', textAlign: 'center' }}
      >
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(8,145,178,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Upload size={26} style={{ color: '#22d3ee' }} />
        </div>
        <div>
          <p style={{ color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Toca para elegir una imagen</p>
          <p style={{ color: '#9d8fc2', fontSize: '0.85rem' }}>o arrástrala aquí — JPG, PNG, WebP</p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={(e) => onFile(e.target.files[0])} style={{ display: 'none' }} />
      </label>
    )
  }

  const fmt = FORMATS.find((f) => f.key === format)
  const saved = outBlob && originalSize ? Math.round((1 - outBlob.size / originalSize) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', background: '#0c0923', border: '1px solid rgba(124,58,237,0.2)', display: 'flex', justifyContent: 'center' }}>
        <img src={src} alt="Vista previa" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', display: 'block' }} />
        <button onClick={reset} aria-label="Quitar imagen" style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(12,9,35,0.85)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#e9d5ff', display: 'flex' }}>
          <X size={16} />
        </button>
      </div>

      {/* Resultado */}
      <div style={{ background: 'rgba(8,145,178,0.1)', border: '1px solid rgba(8,145,178,0.3)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
        <p style={{ color: '#9d8fc2', fontSize: '0.85rem', margin: '0 0 4px' }}>
          {fmtSize(originalSize)} → <strong style={{ color: '#22d3ee' }}>{fmtSize(outBlob?.size)}</strong>
        </p>
        <p style={{ color: '#22d3ee', fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
          {saved > 0 ? `${saved}% más ligero` : 'Prueba bajar la calidad para reducir más'}
        </p>
      </div>

      {/* Formato */}
      <div>
        <label style={{ display: 'block', color: '#c4b5fd', fontSize: '0.88rem', fontWeight: 600, marginBottom: '10px' }}>Formato de salida</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {FORMATS.map((f) => (
            <button key={f.key} onClick={() => setFormat(f.key)} style={{ flex: 1, padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', background: format === f.key ? 'linear-gradient(135deg, #0891b2, #7c3aed)' : 'rgba(12,9,35,0.6)', color: format === f.key ? 'white' : '#9d8fc2', border: `1px solid ${format === f.key ? 'transparent' : 'rgba(124,58,237,0.25)'}` }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calidad */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <label htmlFor="q" style={{ color: '#c4b5fd', fontSize: '0.88rem', fontWeight: 600 }}>Calidad</label>
          <span style={{ color: 'white', fontWeight: 700 }}>{Math.round(quality * 100)}%</span>
        </div>
        <input id="q" type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(Number(e.target.value))} style={{ width: '100%', accentColor: '#0891b2', cursor: 'pointer' }} />
      </div>

      <button onClick={download} disabled={!outBlob} className="btn-primary justify-center" style={{ width: '100%', opacity: outBlob ? 1 : 0.5 }}>
        <Download size={18} /> Descargar {fmt.label}
      </button>
    </div>
  )
}
