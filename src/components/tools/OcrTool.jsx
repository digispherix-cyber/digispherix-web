'use client'

import { useState, useRef } from 'react'
import { Upload, Copy, Check, Loader2, X, FileText } from 'lucide-react'

const TESS_OPTS = {
  workerPath: '/tesseract/worker.min.js',
  corePath: '/tesseract/tesseract-core-simd-lstm.wasm.js',
  langPath: '/tesseract/lang',
  workerBlobURL: false,
}

const MAX_PDF_PAGES = 15

export default function OcrTool() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)
  const inputRef = useRef(null)

  const onFile = (f) => {
    if (!f) return
    const isImg = f.type.startsWith('image/')
    const isPdf = f.type === 'application/pdf'
    if (!isImg && !isPdf) return
    setFile(f)
    setText('')
    setPreview(isImg ? URL.createObjectURL(f) : null)
  }

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null); setPreview(null); setText(''); setProgress('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const extract = async () => {
    if (!file) return
    setBusy(true)
    setText('')
    setProgress('Preparando el reconocimiento…')
    let worker
    try {
      const { createWorker } = await import('tesseract.js')
      worker = await createWorker('spa', 1, TESS_OPTS)

      let out = ''
      if (file.type === 'application/pdf') {
        const pdfjsLib = await import('pdfjs-dist')
        if (!pdfjsLib.GlobalWorkerOptions.workerPort) {
          pdfjsLib.GlobalWorkerOptions.workerPort = new Worker(
            new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url),
            { type: 'module' },
          )
        }
        const buf = await file.arrayBuffer()
        const doc = await pdfjsLib.getDocument({ data: buf }).promise
        const pages = Math.min(doc.numPages, MAX_PDF_PAGES)
        for (let i = 1; i <= pages; i++) {
          setProgress(`Leyendo página ${i} de ${pages}…`)
          const page = await doc.getPage(i)
          const viewport = page.getViewport({ scale: 2 })
          const canvas = document.createElement('canvas')
          canvas.width = Math.floor(viewport.width)
          canvas.height = Math.floor(viewport.height)
          const ctx = canvas.getContext('2d')
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          await page.render({ canvasContext: ctx, viewport, canvas, intent: 'print' }).promise
          const { data } = await worker.recognize(canvas)
          out += (out ? '\n\n' : '') + data.text.trim()
        }
        if (doc.numPages > MAX_PDF_PAGES) {
          out += `\n\n[Se procesaron las primeras ${MAX_PDF_PAGES} páginas de ${doc.numPages}.]`
        }
      } else {
        setProgress('Reconociendo el texto…')
        const { data } = await worker.recognize(file)
        out = data.text.trim()
      }

      setText(out || 'No se detectó texto en el archivo. Prueba con una imagen más clara.')
    } catch {
      setText('')
      alert('No se pudo procesar el archivo. Prueba con una imagen clara o un PDF válido.')
    } finally {
      if (worker) await worker.terminate()
      setBusy(false)
      setProgress('')
    }
  }

  const copy = async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* noop */ }
  }

  if (!file) {
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
          <p style={{ color: 'white', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Toca para elegir una imagen o PDF</p>
          <p style={{ color: '#9d8fc2', fontSize: '0.85rem' }}>foto de un documento, captura o PDF escaneado</p>
        </div>
        <input ref={inputRef} type="file" accept="image/*,application/pdf" onChange={(e) => onFile(e.target.files[0])} style={{ display: 'none' }} />
      </label>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Archivo / vista previa */}
      <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', background: '#0c0923', border: '1px solid rgba(124,58,237,0.2)' }}>
        {preview ? (
          <img src={preview} alt="Vista previa" style={{ width: '100%', maxHeight: '280px', objectFit: 'contain', display: 'block' }} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '18px' }}>
            <FileText size={22} style={{ color: '#22d3ee', flexShrink: 0 }} />
            <span style={{ color: '#c4b5fd', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
          </div>
        )}
        <button onClick={reset} aria-label="Quitar" style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(12,9,35,0.85)', border: '1px solid rgba(124,58,237,0.4)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#e9d5ff', display: 'flex' }}>
          <X size={16} />
        </button>
      </div>

      {!text && (
        <button onClick={extract} disabled={busy} className="btn-primary justify-center" style={{ width: '100%', opacity: busy ? 0.6 : 1 }}>
          {busy ? <><Loader2 size={18} className="spin" /> {progress || 'Procesando…'}</> : <>Extraer texto</>}
        </button>
      )}

      {/* Resultado */}
      {text && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ color: '#c4b5fd', fontSize: '0.88rem', fontWeight: 600 }}>Texto extraído</label>
            <button onClick={copy} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              {copied ? <><Check size={15} /> Copiado</> : <><Copy size={15} /> Copiar</>}
            </button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            style={{ width: '100%', boxSizing: 'border-box', background: '#0c0923', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px', padding: '14px', color: 'white', fontSize: '0.9rem', lineHeight: 1.6, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
          />
          <button onClick={reset} className="btn-secondary justify-center" style={{ width: '100%' }}>
            Procesar otro archivo
          </button>
        </>
      )}
    </div>
  )
}
