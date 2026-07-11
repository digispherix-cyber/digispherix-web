'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Download, X, ArrowUp, ArrowDown, Loader2 } from 'lucide-react'

let idCounter = 0

export default function ImageToPdf() {
  const [items, setItems] = useState([]) // { id, file, url }
  const [busy, setBusy] = useState(false)
  const inputRef = useRef(null)

  const addFiles = useCallback((fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type === 'image/jpeg' || f.type === 'image/png')
    if (files.length === 0) return
    setItems((prev) => [
      ...prev,
      ...files.map((file) => ({ id: ++idCounter, file, url: URL.createObjectURL(file) })),
    ])
  }, [])

  const remove = (id) => {
    setItems((prev) => {
      const it = prev.find((p) => p.id === id)
      if (it) URL.revokeObjectURL(it.url)
      return prev.filter((p) => p.id !== id)
    })
  }

  const move = (index, dir) => {
    setItems((prev) => {
      const next = [...prev]
      const target = index + dir
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  const generate = async () => {
    if (items.length === 0) return
    setBusy(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const pdf = await PDFDocument.create()
      for (const it of items) {
        const bytes = await it.file.arrayBuffer()
        const img = it.file.type === 'image/png' ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes)
        const page = pdf.addPage([img.width, img.height])
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height })
      }
      const out = await pdf.save()
      const blob = new Blob([out], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'documento-digispherix.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('No se pudo generar el PDF. Revisa que las imágenes sean JPG o PNG válidas.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Zona de carga */}
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files) }}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px',
          padding: '32px 20px', border: '2px dashed rgba(217,119,6,0.4)', borderRadius: '16px', cursor: 'pointer',
          background: 'rgba(12,9,35,0.4)', textAlign: 'center',
        }}
      >
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(217,119,6,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Upload size={24} style={{ color: '#f59e0b' }} />
        </div>
        <div>
          <p style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px' }}>Toca para agregar imágenes</p>
          <p style={{ color: '#9d8fc2', fontSize: '0.82rem' }}>o arrástralas aquí — JPG o PNG</p>
        </div>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png" multiple onChange={(e) => addFiles(e.target.files)} style={{ display: 'none' }} />
      </label>

      {/* Lista de imágenes */}
      {items.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map((it, i) => (
            <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(12,9,35,0.6)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '12px', padding: '8px 10px' }}>
              <span style={{ color: '#9d8fc2', fontSize: '0.8rem', fontWeight: 700, width: '20px', textAlign: 'center', flexShrink: 0 }}>{i + 1}</span>
              <img src={it.url} alt="" style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
              <span style={{ color: '#c4b5fd', fontSize: '0.82rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.file.name}</span>
              <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Subir" style={iconBtn(i === 0)}><ArrowUp size={16} /></button>
              <button onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Bajar" style={iconBtn(i === items.length - 1)}><ArrowDown size={16} /></button>
              <button onClick={() => remove(it.id)} aria-label="Quitar" style={iconBtn(false)}><X size={16} /></button>
            </div>
          ))}
        </div>
      )}

      <button onClick={generate} disabled={items.length === 0 || busy} className="btn-primary justify-center" style={{ width: '100%', opacity: items.length === 0 || busy ? 0.5 : 1 }}>
        {busy ? <><Loader2 size={18} className="spin" /> Generando…</> : <><Download size={18} /> Descargar PDF ({items.length} {items.length === 1 ? 'imagen' : 'imágenes'})</>}
      </button>
    </div>
  )
}

function iconBtn(disabled) {
  return {
    display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', flexShrink: 0,
    background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '8px',
    color: disabled ? '#4c4470' : '#c4b5fd', cursor: disabled ? 'default' : 'pointer',
  }
}
