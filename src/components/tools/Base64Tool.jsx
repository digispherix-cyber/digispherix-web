'use client'

import { useState } from 'react'
import { Copy, Check, ArrowRightLeft } from 'lucide-react'

const enc = new TextEncoder()
const dec = new TextDecoder()

// Cada formato sabe convertirse a bytes y desde bytes.
// Así cualquier combinación De → A funciona pasando por bytes.
const CODECS = {
  texto: {
    label: 'Texto',
    mono: false,
    placeholder: 'Escribe o pega tu texto…',
    toBytes: (s) => enc.encode(s),
    fromBytes: (b) => dec.decode(b),
  },
  base64: {
    label: 'Base64',
    mono: true,
    placeholder: 'Pega tu Base64…',
    toBytes: (s) => {
      const bin = atob(s.trim())
      return Uint8Array.from(bin, (c) => c.charCodeAt(0))
    },
    fromBytes: (b) => {
      let bin = ''
      b.forEach((x) => { bin += String.fromCharCode(x) })
      return btoa(bin)
    },
  },
  hex: {
    label: 'Hexadecimal',
    mono: true,
    placeholder: 'Pega tu hexadecimal… ej. 48 6f 6c 61',
    toBytes: (s) => {
      const clean = s.replace(/0x/gi, '').replace(/[^0-9a-f]/gi, '')
      if (clean.length % 2 !== 0) throw new Error('impar')
      const out = new Uint8Array(clean.length / 2)
      for (let i = 0; i < clean.length; i += 2) out[i / 2] = parseInt(clean.slice(i, i + 2), 16)
      return out
    },
    fromBytes: (b) => Array.from(b).map((x) => x.toString(16).padStart(2, '0')).join(' '),
  },
  binario: {
    label: 'Binario',
    mono: true,
    placeholder: 'Pega tu binario… ej. 01001000 01101111',
    toBytes: (s) => {
      const clean = s.replace(/[^01]/g, '')
      if (clean.length % 8 !== 0) throw new Error('no múltiplo de 8')
      const out = new Uint8Array(clean.length / 8)
      for (let i = 0; i < clean.length; i += 8) out[i / 8] = parseInt(clean.slice(i, i + 8), 2)
      return out
    },
    fromBytes: (b) => Array.from(b).map((x) => x.toString(2).padStart(8, '0')).join(' '),
  },
  decimal: {
    label: 'Decimal',
    mono: true,
    placeholder: 'Pega tus códigos… ej. 72 111 108 97',
    toBytes: (s) => {
      const nums = s.trim().split(/[^0-9]+/).filter(Boolean).map(Number)
      if (!nums.length || nums.some((n) => n > 255 || n < 0)) throw new Error('fuera de rango')
      return Uint8Array.from(nums)
    },
    fromBytes: (b) => Array.from(b).join(' '),
  },
}

const KEYS = Object.keys(CODECS)

export default function Base64Tool() {
  const [from, setFrom] = useState('texto')
  const [to, setTo] = useState('base64')
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const src = CODECS[from]
  const dst = CODECS[to]

  let output = ''
  let error = ''
  if (input.trim()) {
    if (from === to) {
      output = input
    } else {
      try {
        output = dst.fromBytes(src.toBytes(input))
      } catch {
        error = `El texto de entrada no es un ${src.label} válido.`
      }
    }
  }

  const copy = async () => {
    if (!output) return
    try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* noop */ }
  }

  const swap = () => {
    setFrom(to)
    setTo(from)
    if (output && !error) setInput(output)
  }

  const selectStyle = (active) => ({
    padding: '9px 6px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem',
    background: active ? 'linear-gradient(135deg, #0891b2, #7c3aed)' : 'rgba(12,9,35,0.6)',
    color: active ? 'white' : '#9d8fc2',
    border: `1px solid ${active ? 'transparent' : 'rgba(124,58,237,0.25)'}`,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* De */}
      <div>
        <label style={{ display: 'block', color: '#c4b5fd', fontSize: '0.82rem', fontWeight: 600, marginBottom: '8px' }}>Convertir de</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(78px, 1fr))', gap: '8px' }}>
          {KEYS.map((k) => (
            <button key={k} onClick={() => setFrom(k)} style={selectStyle(from === k)}>{CODECS[k].label}</button>
          ))}
        </div>
      </div>

      {/* A */}
      <div>
        <label style={{ display: 'block', color: '#c4b5fd', fontSize: '0.82rem', fontWeight: 600, marginBottom: '8px' }}>A</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(78px, 1fr))', gap: '8px' }}>
          {KEYS.map((k) => (
            <button key={k} onClick={() => setTo(k)} style={selectStyle(to === k)}>{CODECS[k].label}</button>
          ))}
        </div>
      </div>

      {/* Entrada */}
      <div>
        <label style={{ display: 'block', color: '#c4b5fd', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
          {src.label}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          placeholder={src.placeholder}
          style={{ width: '100%', boxSizing: 'border-box', background: '#0c0923', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px', padding: '14px', color: 'white', fontSize: '0.92rem', lineHeight: 1.5, outline: 'none', resize: 'vertical', fontFamily: src.mono ? 'monospace' : 'inherit' }}
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
          <label style={{ color: '#c4b5fd', fontSize: '0.85rem', fontWeight: 600 }}>{dst.label}</label>
          <button onClick={copy} disabled={!output} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem', opacity: output ? 1 : 0.5 }}>
            {copied ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar</>}
          </button>
        </div>
        <div
          style={{
            width: '100%', boxSizing: 'border-box', minHeight: '110px', background: '#0c0923',
            border: `1px solid ${error ? 'rgba(248,113,113,0.5)' : 'rgba(124,58,237,0.3)'}`, borderRadius: '10px',
            padding: '14px', color: error ? '#f87171' : 'white', fontSize: '0.92rem', lineHeight: 1.5,
            wordBreak: 'break-all', whiteSpace: 'pre-wrap', fontFamily: dst.mono ? 'monospace' : 'inherit',
          }}
        >
          {error || output || <span style={{ color: '#6b5fa0' }}>El resultado aparecerá aquí…</span>}
        </div>
      </div>
    </div>
  )
}
