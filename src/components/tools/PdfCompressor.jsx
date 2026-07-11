'use client'

import { useState, useRef } from 'react'
import { Upload, Download, X, Loader2, FileText } from 'lucide-react'

const LEVELS = [
  { key: 'light', label: 'Ligera', hint: 'Mejor calidad', scale: 2.0, quality: 0.72 },
  { key: 'medium', label: 'Media', hint: 'Equilibrada', scale: 1.5, quality: 0.6 },
  { key: 'strong', label: 'Fuerte', hint: 'Menor peso', scale: 1.1, quality: 0.5 },
]

function fmtSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function PdfCompressor() {
  const [file, setFile] = useState(null)
  const [level, setLevel] = useState('medium')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const [result, setResult] = useState(null) // { blob, size, originalSize }
  const inputRef = useRef(null)

  const onFile = (f) => {
    if (!f || f.type !== 'application/pdf') return
    setFile(f)
    setResult(null)
  }

  const reset = () => {
    setFile(null)
    setResult(null)
    setProgress('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const compress = async () => {
    if (!file) return
    setBusy(true)
    setResult(null)
    setProgress('Cargando PDF…')
    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()
      const { PDFDocument } = await import('pdf-lib')

      const cfg = LEVELS.find((l) => l.key === level)
      const buf = await file.arrayBuffer()
      const doc = await pdfjsLib.getDocument({ data: buf }).promise
      const outPdf = await PDFDocument.create()

      for (let i = 1; i <= doc.numPages; i++) {
        setProgress(`Procesando página ${i} de ${doc.numPages}…`)
        const page = await doc.getPage(i)
        const viewport = page.getViewport({ scale: cfg.scale })
        const canvas = document.createElement('canvas')
        canvas.width = Math.floor(viewport.width)
        canvas.height = Math.floor(viewport.height)
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        await page.render({ canvasContext: ctx, viewport, canvas }).promise
        const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', cfg.quality))
        const jpegBytes = await blob.arrayBuffer()
        const img = await outPdf.embedJpg(jpegBytes)
        const p = outPdf.addPage([canvas.width, canvas.height])
        p.drawImage(img, { x: 0, y: 0, width: canvas.width, height: canvas.height })
      }

      setProgress('Finalizando…')
      const out = await outPdf.save()
      const outBlob = new Blob([out], { type: 'application/pdf' })
      setResult({ blob: outBlob, size: outBlob.size, originalSize: file.size })
    } catch {
      alert('No se pudo comprimir el PDF. Puede estar protegido o dañado.')
    } finally {
      setBusy(false)
      setProgress('')
    }
  }

  const download = () => {
    if (!result) return
    const url = URL.createObjectURL(result.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = (file?.name?.replace(/\.pdf$/i, '') || 'documento') + '-comprimido.pdf'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!file) {
    return (
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files[0]) }}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px',
          padding: '48px 20px', border: '2px dashed rgba(225,29,72,0.4)', borderRadius: '16px', cursor: 'pointer',
          background: 'rgba(12,9,35,0.4)', textAlign: 'center',
        }}
      >
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(225,29,72,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Upload size={26} style={{ color: '#f43f5e' }} />
        </div>
        <div>
          <p style={{ color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Toca para elegir un PDF</p>
          <p style={{ color: '#9d8fc2', fontSize: '0.85rem' }}>o arrástralo aquí</p>
        </div>
        <input ref={inputRef} type="file" accept="application/pdf" onChange={(e) => onFile(e.target.files[0])} style={{ display: 'none' }} />
      </label>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Archivo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(12,9,35,0.6)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '12px', padding: '14px 16px' }}>
        <FileText size={22} style={{ color: '#f43f5e', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{file.name}</p>
          <p style={{ color: '#9d8fc2', fontSize: '0.78rem', margin: 0 }}>{fmtSize(file.size)}</p>
        </div>
        <button onClick={reset} aria-label="Quitar" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#c4b5fd', display: 'flex' }}>
          <X size={16} />
        </button>
      </div>

      {/* Nivel */}
      <div>
        <label style={{ display: 'block', color: '#c4b5fd', fontSize: '0.88rem', fontWeight: 600, marginBottom: '10px' }}>Nivel de compresión</label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {LEVELS.map((l) => (
            <button
              key={l.key}
              onClick={() => setLevel(l.key)}
              disabled={busy}
              style={{
                flex: '1 1 90px', padding: '12px', borderRadius: '10px', cursor: busy ? 'default' : 'pointer', fontWeight: 700, fontSize: '0.88rem',
                background: level === l.key ? 'linear-gradient(135deg, #e11d48, #7c3aed)' : 'rgba(12,9,35,0.6)',
                color: level === l.key ? 'white' : '#9d8fc2',
                border: `1px solid ${level === l.key ? 'transparent' : 'rgba(124,58,237,0.25)'}`,
              }}
            >
              {l.label}
              <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 500, opacity: 0.8 }}>{l.hint}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Resultado */}
      {result && (
        <div style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.3)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
          <p style={{ color: '#9d8fc2', fontSize: '0.85rem', margin: '0 0 6px' }}>
            {fmtSize(result.originalSize)} → <strong style={{ color: '#34d399' }}>{fmtSize(result.size)}</strong>
          </p>
          <p style={{ color: '#34d399', fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
            {result.size < result.originalSize
              ? `${Math.round((1 - result.size / result.originalSize) * 100)}% más ligero`
              : 'Este PDF ya estaba optimizado (prueba un nivel más fuerte)'}
          </p>
        </div>
      )}

      {result ? (
        <button onClick={download} className="btn-primary justify-center" style={{ width: '100%' }}>
          <Download size={18} /> Descargar PDF comprimido
        </button>
      ) : (
        <button onClick={compress} disabled={busy} className="btn-primary justify-center" style={{ width: '100%', opacity: busy ? 0.6 : 1 }}>
          {busy ? <><Loader2 size={18} className="spin" /> {progress || 'Comprimiendo…'}</> : <>Comprimir PDF</>}
        </button>
      )}
    </div>
  )
}
