'use client'

import { useState } from 'react'
import { Copy, Check, Eraser } from 'lucide-react'

function toTitle(str) {
  return str.toLowerCase().replace(/([^\s.–—-]+)/g, (w) => w.charAt(0).toUpperCase() + w.slice(1))
}
function toSentence(str) {
  return str.toLowerCase().replace(/(^\s*\p{L})|([.!?¿¡]\s*\p{L})/gu, (m) => m.toUpperCase())
}
function toAlternating(str) {
  let i = 0
  return str.replace(/\p{L}/gu, (c) => (i++ % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
}

const FORMATS = [
  { key: 'upper', label: 'MAYÚSCULAS', fn: (s) => s.toUpperCase() },
  { key: 'lower', label: 'minúsculas', fn: (s) => s.toLowerCase() },
  { key: 'title', label: 'Tipo Título', fn: toTitle },
  { key: 'sentence', label: 'Tipo oración', fn: toSentence },
  { key: 'alt', label: 'aLtErNaDo', fn: toAlternating },
]

export default function CaseConverterTool() {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!input) return
    try { await navigator.clipboard.writeText(input); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* noop */ }
  }
  const apply = (fn) => setInput((s) => fn(s))

  const chars = input.length
  const words = input.trim() ? input.trim().split(/\s+/).length : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div>
        <label style={{ display: 'block', color: '#c4b5fd', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Tu texto</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={7}
          placeholder="Escribe o pega tu texto aquí…"
          style={{ width: '100%', boxSizing: 'border-box', background: '#0c0923', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px', padding: '14px', color: 'white', fontSize: '0.95rem', lineHeight: 1.6, outline: 'none', resize: 'vertical' }}
        />
        <div style={{ display: 'flex', gap: '14px', marginTop: '8px', color: '#6b5fa0', fontSize: '0.78rem' }}>
          <span>{words} palabras</span>
          <span>{chars} caracteres</span>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', color: '#c4b5fd', fontSize: '0.85rem', fontWeight: 600, marginBottom: '10px' }}>Convertir a</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
          {FORMATS.map((f) => (
            <button
              key={f.key}
              onClick={() => apply(f.fn)}
              disabled={!input}
              style={{
                padding: '12px', borderRadius: '10px', cursor: input ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: '0.85rem',
                background: 'rgba(12,9,35,0.6)', color: input ? 'white' : '#6b5fa0',
                border: '1px solid rgba(124,58,237,0.25)', opacity: input ? 1 : 0.6,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={copy} disabled={!input} className="btn-primary justify-center" style={{ flex: '1 1 160px', opacity: input ? 1 : 0.5 }}>
          {copied ? <><Check size={16} /> Copiado</> : <><Copy size={16} /> Copiar texto</>}
        </button>
        <button onClick={() => setInput('')} disabled={!input} className="btn-secondary" style={{ padding: '11px 18px', opacity: input ? 1 : 0.5 }}>
          <Eraser size={15} /> Limpiar
        </button>
      </div>
    </div>
  )
}
