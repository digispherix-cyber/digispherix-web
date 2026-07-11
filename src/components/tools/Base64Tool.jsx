'use client'

import { useState } from 'react'
import { Copy, Check, ArrowRightLeft } from 'lucide-react'

// UTF-8 seguro (acentos, ñ, emojis).
function encodeB64(str) {
  const bytes = new TextEncoder().encode(str)
  let bin = ''
  bytes.forEach((b) => { bin += String.fromCharCode(b) })
  return btoa(bin)
}
function decodeB64(b64) {
  const bin = atob(b64.trim())
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export default function Base64Tool() {
  const [mode, setMode] = useState('encode') // encode | decode
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  let output = ''
  let error = ''
  if (input.trim()) {
    try {
      output = mode === 'encode' ? encodeB64(input) : decodeB64(input)
    } catch {
      error = mode === 'encode' ? 'No se pudo codificar el texto.' : 'El texto no es un Base64 válido.'
    }
  }

  const copy = async () => {
    if (!output) return
    try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* noop */ }
  }

  const swap = () => {
    setMode((m) => (m === 'encode' ? 'decode' : 'encode'))
    // El resultado actual pasa a ser la entrada (flujo natural).
    if (output && !error) setInput(output)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Modo */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {[['encode', 'Texto → Base64'], ['decode', 'Base64 → Texto']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            style={{
              flex: 1, padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem',
              background: mode === key ? 'linear-gradient(135deg, #0891b2, #7c3aed)' : 'rgba(12,9,35,0.6)',
              color: mode === key ? 'white' : '#9d8fc2',
              border: `1px solid ${mode === key ? 'transparent' : 'rgba(124,58,237,0.25)'}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Entrada */}
      <div>
        <label style={{ display: 'block', color: '#c4b5fd', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
          {mode === 'encode' ? 'Tu texto' : 'Tu Base64'}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          placeholder={mode === 'encode' ? 'Escribe o pega tu texto…' : 'Pega tu código Base64…'}
          style={{ width: '100%', boxSizing: 'border-box', background: '#0c0923', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px', padding: '14px', color: 'white', fontSize: '0.92rem', lineHeight: 1.5, outline: 'none', resize: 'vertical', fontFamily: mode === 'decode' ? 'monospace' : 'inherit' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button onClick={swap} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.82rem' }}>
          <ArrowRightLeft size={15} /> Invertir
        </button>
      </div>

      {/* Salida */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ color: '#c4b5fd', fontSize: '0.85rem', fontWeight: 600 }}>Resultado</label>
          <button onClick={copy} disabled={!output} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem', opacity: output ? 1 : 0.5 }}>
            {copied ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar</>}
          </button>
        </div>
        <div
          style={{
            width: '100%', boxSizing: 'border-box', minHeight: '110px', background: '#0c0923',
            border: `1px solid ${error ? 'rgba(248,113,113,0.5)' : 'rgba(124,58,237,0.3)'}`, borderRadius: '10px',
            padding: '14px', color: error ? '#f87171' : 'white', fontSize: '0.92rem', lineHeight: 1.5,
            wordBreak: 'break-all', whiteSpace: 'pre-wrap', fontFamily: mode === 'encode' ? 'monospace' : 'inherit',
          }}
        >
          {error || output || <span style={{ color: '#6b5fa0' }}>El resultado aparecerá aquí…</span>}
        </div>
      </div>
    </div>
  )
}
