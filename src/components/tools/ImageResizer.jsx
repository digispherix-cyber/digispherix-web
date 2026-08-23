'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Download, ImageIcon, X } from 'lucide-react'

export default function ImageResizer() {
  const [src, setSrc] = useState(null)
  const [fileName, setFileName] = useState('')
  const [natural, setNatural] = useState({ w: 0, h: 0 })
  const [dims, setDims] = useState({ w: 0, h: 0 })
  const [lock, setLock] = useState(true)
  const imgRef = useRef(null)
  const inputRef = useRef(null)

  const onFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    setFileName(file.name.replace(/\.[^.]+$/, ''))
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setNatural({ w: img.width, h: img.height })
        setDims({ w: img.width, h: img.height })
        imgRef.current = img
        setSrc(e.target.result)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }, [])

  const setWidth = (w) => {
    w = Math.max(1, Math.round(w || 0))
    if (lock && natural.w) setDims({ w, h: Math.max(1, Math.round((w / natural.w) * natural.h)) })
    else setDims((d) => ({ ...d, w }))
  }
  const setHeight = (h) => {
    h = Math.max(1, Math.round(h || 0))
    if (lock && natural.h) setDims({ w: Math.max(1, Math.round((h / natural.h) * natural.w)), h })
    else setDims((d) => ({ ...d, h }))
  }

  const download = () => {
    if (!imgRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = dims.w
    canvas.height = dims.h
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(imgRef.current, 0, 0, dims.w, dims.h)
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${fileName || 'imagen'}-${dims.w}x${dims.h}.png`
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  const reset = () => {
    setSrc(null)
    setNatural({ w: 0, h: 0 })
    setDims({ w: 0, h: 0 })
    imgRef.current = null
    if (inputRef.current) inputRef.current.value = ''
  }

  const preset = (factor) => {
    if (!natural.w) return
    setDims({ w: Math.max(1, Math.round(natural.w * factor)), h: Math.max(1, Math.round(natural.h * factor)) })
  }

  if (!src) {
    return (
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files[0]) }}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px',
          padding: '48px 20px', border: '2px dashed var(--border)', borderRadius: '16px', cursor: 'pointer',
          background: 'var(--bg-card-alt)', textAlign: 'center',
        }}
      >
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Upload size={26} style={{ color: 'var(--accent-2)' }} />
        </div>
        <div>
          <p style={{ color: 'var(--text-strong)', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Toca para elegir una imagen</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>o arrástrala aquí — JPG, PNG, WebP</p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={(e) => onFile(e.target.files[0])} style={{ display: 'none' }} />
      </label>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Vista previa */}
      <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', background: 'var(--bg-card-alt)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'center' }}>
        <img src={src} alt="Vista previa" style={{ maxWidth: '100%', maxHeight: '320px', objectFit: 'contain', display: 'block' }} />
        <button onClick={reset} aria-label="Quitar imagen" style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--bg-card-alt)', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'var(--text)', display: 'flex' }}>
          <X size={16} />
        </button>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <ImageIcon size={14} /> Original: {natural.w} × {natural.h} px
      </p>

      {/* Presets rápidos */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[['100%', 1], ['75%', 0.75], ['50%', 0.5], ['25%', 0.25]].map(([label, f]) => (
          <button key={label} onClick={() => preset(f)} style={{ padding: '7px 14px', borderRadius: '99px', background: 'rgba(124,58,237,0.12)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Inputs de tamaño */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 120px' }}>
          <label style={{ display: 'block', color: 'var(--text)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Ancho (px)</label>
          <input type="number" min="1" value={dims.w} onChange={(e) => setWidth(Number(e.target.value))} style={inputStyle} />
        </div>
        <div style={{ flex: '1 1 120px' }}>
          <label style={{ display: 'block', color: 'var(--text)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Alto (px)</label>
          <input type="number" min="1" value={dims.h} onChange={(e) => setHeight(Number(e.target.value))} style={inputStyle} />
        </div>
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'var(--text)', fontSize: '0.88rem' }}>
        <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} style={{ accentColor: 'var(--accent-2)', width: '17px', height: '17px' }} />
        Mantener proporción
      </label>

      <button onClick={download} className="btn-primary justify-center" style={{ width: '100%' }}>
        <Download size={18} /> Descargar imagen ({dims.w} × {dims.h})
      </button>
    </div>
  )
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box', background: 'var(--bg-card-alt)', border: '1px solid var(--border)',
  borderRadius: '10px', padding: '12px 14px', color: 'var(--text-strong)', fontSize: '1rem', outline: 'none',
}
