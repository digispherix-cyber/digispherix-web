'use client'

import { useState, useRef, useCallback } from 'react'
import { Reorder, useDragControls } from 'framer-motion'
import { Upload, Download, X, GripVertical, Loader2 } from 'lucide-react'

let idCounter = 0

function SortableRow({ item, index, onRemove }) {
  const controls = useDragControls()
  return (
    <Reorder.Item
      value={item}
      as="div"
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.03, boxShadow: '0 16px 36px rgba(0,0,0,0.45)', zIndex: 20, cursor: 'grabbing' }}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        background: 'rgba(12,9,35,0.85)', border: '1px solid rgba(124,58,237,0.25)',
        borderRadius: '12px', padding: '8px 10px',
      }}
    >
      <button
        onPointerDown={(e) => controls.start(e)}
        aria-label="Arrastrar para reordenar"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          width: '34px', height: '40px', background: 'none', border: 'none',
          color: '#9d8fc2', cursor: 'grab', touchAction: 'none',
        }}
      >
        <GripVertical size={18} />
      </button>
      <span style={{ color: '#9d8fc2', fontSize: '0.8rem', fontWeight: 700, width: '18px', textAlign: 'center', flexShrink: 0 }}>{index + 1}</span>
      <img src={item.url} alt="" draggable={false} style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
      <span style={{ color: '#c4b5fd', fontSize: '0.82rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.file.name}</span>
      <button onClick={() => onRemove(item.id)} aria-label="Quitar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', flexShrink: 0, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '8px', color: '#c4b5fd', cursor: 'pointer' }}>
        <X size={16} />
      </button>
    </Reorder.Item>
  )
}

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

      {/* Lista de imágenes (arrastra para reordenar) */}
      {items.length > 0 && (
        <>
          <p style={{ color: '#9d8fc2', fontSize: '0.78rem', textAlign: 'center', margin: 0 }}>
            Arrastra las imágenes para cambiar el orden
          </p>
          <Reorder.Group axis="y" values={items} onReorder={setItems} as="div" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {items.map((it, i) => (
              <SortableRow key={it.id} item={it} index={i} onRemove={remove} />
            ))}
          </Reorder.Group>
        </>
      )}

      <button onClick={generate} disabled={items.length === 0 || busy} className="btn-primary justify-center" style={{ width: '100%', opacity: items.length === 0 || busy ? 0.5 : 1 }}>
        {busy ? <><Loader2 size={18} className="spin" /> Generando…</> : <><Download size={18} /> Descargar PDF ({items.length} {items.length === 1 ? 'imagen' : 'imágenes'})</>}
      </button>
    </div>
  )
}
