'use client'

import { useState, useRef, useCallback } from 'react'
import { Reorder, useDragControls } from 'framer-motion'
import { Upload, Download, X, GripVertical, Loader2, FileText } from 'lucide-react'

let idCounter = 0

function fmtSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function SortableRow({ item, index, onRemove }) {
  const controls = useDragControls()
  return (
    <Reorder.Item
      value={item}
      as="div"
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.03, boxShadow: '0 16px 36px rgba(0,0,0,0.45)', zIndex: 20, cursor: 'grabbing' }}
      style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(12,9,35,0.85)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '12px', padding: '10px' }}
    >
      <button
        onPointerDown={(e) => controls.start(e)}
        aria-label="Arrastrar para reordenar"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: '34px', height: '40px', background: 'none', border: 'none', color: '#9d8fc2', cursor: 'grab', touchAction: 'none' }}
      >
        <GripVertical size={18} />
      </button>
      <span style={{ color: '#9d8fc2', fontSize: '0.8rem', fontWeight: 700, width: '18px', textAlign: 'center', flexShrink: 0 }}>{index + 1}</span>
      <FileText size={22} style={{ color: '#2dd4bf', flexShrink: 0 }} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', color: '#c4b5fd', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.file.name}</span>
        <span style={{ display: 'block', color: '#6b5fa0', fontSize: '0.72rem' }}>{fmtSize(item.file.size)}</span>
      </span>
      <button onClick={() => onRemove(item.id)} aria-label="Quitar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', flexShrink: 0, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '8px', color: '#c4b5fd', cursor: 'pointer' }}>
        <X size={16} />
      </button>
    </Reorder.Item>
  )
}

export default function PdfMerger() {
  const [items, setItems] = useState([]) // { id, file }
  const [busy, setBusy] = useState(false)
  const inputRef = useRef(null)

  const addFiles = useCallback((fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type === 'application/pdf')
    if (files.length === 0) return
    setItems((prev) => [...prev, ...files.map((file) => ({ id: ++idCounter, file }))])
  }, [])

  const remove = (id) => setItems((prev) => prev.filter((p) => p.id !== id))

  const merge = async () => {
    if (items.length < 1) return
    setBusy(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const out = await PDFDocument.create()
      for (const it of items) {
        const bytes = await it.file.arrayBuffer()
        const src = await PDFDocument.load(bytes)
        const pages = await out.copyPages(src, src.getPageIndices())
        pages.forEach((p) => out.addPage(p))
      }
      const merged = await out.save()
      const blob = new Blob([merged], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'pdf-unido-digispherix.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('No se pudo unir el PDF. Revisa que los archivos sean PDF válidos y no estén protegidos.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files) }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '32px 20px', border: '2px dashed rgba(13,148,136,0.4)', borderRadius: '16px', cursor: 'pointer', background: 'rgba(12,9,35,0.4)', textAlign: 'center' }}
      >
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(13,148,136,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Upload size={24} style={{ color: '#2dd4bf' }} />
        </div>
        <div>
          <p style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px' }}>Toca para agregar PDF</p>
          <p style={{ color: '#9d8fc2', fontSize: '0.82rem' }}>o arrástralos aquí</p>
        </div>
        <input ref={inputRef} type="file" accept="application/pdf" multiple onChange={(e) => addFiles(e.target.files)} style={{ display: 'none' }} />
      </label>

      {items.length > 0 && (
        <>
          <p style={{ color: '#9d8fc2', fontSize: '0.78rem', textAlign: 'center', margin: 0 }}>Arrastra los archivos para cambiar el orden</p>
          <Reorder.Group axis="y" values={items} onReorder={setItems} as="div" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {items.map((it, i) => (
              <SortableRow key={it.id} item={it} index={i} onRemove={remove} />
            ))}
          </Reorder.Group>
        </>
      )}

      <button onClick={merge} disabled={items.length < 2 || busy} className="btn-primary justify-center" style={{ width: '100%', opacity: items.length < 2 || busy ? 0.5 : 1 }}>
        {busy ? <><Loader2 size={18} className="spin" /> Uniendo…</> : <><Download size={18} /> Unir y descargar {items.length > 0 ? `(${items.length})` : ''}</>}
      </button>
      {items.length === 1 && (
        <p style={{ color: '#6b5fa0', fontSize: '0.78rem', textAlign: 'center', margin: '-8px 0 0' }}>Agrega al menos 2 PDF para unirlos.</p>
      )}
    </div>
  )
}
