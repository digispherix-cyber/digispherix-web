'use client'

import { useState } from 'react'
import { Copy, Check, ArrowRightLeft } from 'lucide-react'

const enc = new TextEncoder()
const dec = new TextDecoder()

// ── Base64 (UTF-8 seguro) ──
function b64Encode(str) {
  let bin = ''
  enc.encode(str).forEach((b) => { bin += String.fromCharCode(b) })
  return btoa(bin)
}
function b64Decode(b64) {
  const bin = atob(b64.trim())
  return dec.decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)))
}

// ── Hexadecimal ──
function hexEncode(str) {
  return Array.from(enc.encode(str)).map((b) => b.toString(16).padStart(2, '0')).join(' ')
}
function hexDecode(hex) {
  const clean = hex.replace(/0x/gi, '').replace(/[^0-9a-f]/gi, '')
  if (clean.length % 2 !== 0) throw new Error('impar')
  const bytes = new Uint8Array(clean.length / 2)
  for (let i = 0; i < clean.length; i += 2) bytes[i / 2] = parseInt(clean.slice(i, i + 2), 16)
  return dec.decode(bytes)
}

// ── Binario ──
function binEncode(str) {
  return Array.from(enc.encode(str)).map((b) => b.toString(2).padStart(8, '0')).join(' ')
}
function binDecode(bin) {
  const clean = bin.replace(/[^01]/g, '')
  if (clean.length % 8 !== 0) throw new Error('no múltiplo de 8')
  const bytes = new Uint8Array(clean.length / 8)
  for (let i = 0; i < clean.length; i += 8) bytes[i / 8] = parseInt(clean.slice(i, i + 8), 2)
  return dec.decode(bytes)
}

const FORMATS = {
  base64: { label: 'Base64', encode: b64Encode, decode: b64Decode, mono: true },
  hex: { label: 'Hexadecimal', encode: hexEncode, decode: hexDecode, mono: true },
  binary: { label: 'Binario', encode: binEncode, decode: binDecode, mono: true },
  url: { label: 'URL', encode: encodeURIComponent, decode: decodeURIComponent, mono: false },
}

export default function Base64Tool() {
  const [format, setFormat] = useState('base64')
  const [mode, setMode] = useState('encode') // encode | decode
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const fmt = FORMATS[format]
  let output = ''
  let error = ''
  if (input.trim()) {
    try {
      output = mode === 'encode' ? fmt.encode(input) : fmt.decode(input)
    } catch {
      error = mode === 'encode' ? 'No se pudo convertir el texto.' : `El texto no es un ${fmt.label} válido.`
    }
  }

  const copy = async () => {
    if (!output) return
    try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* noop */ }
  }

  const swap = () => {
    setMode((m) => (m === 'encode' ? 'decode' : 'encode'))
    if (output && !error) setInput(output)
  }

  const outMono = mode === 'encode' ? fmt.mono : false
  const inMono = mode === 'decode' ? fmt.mono : false

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Formato */}
      <div>
        <label style={{ display: 'block', color: '#c4b5fd', fontSize: '0.82rem', fontWeight: 600, marginBottom: '8px' }}>Formato</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '8px' }}>
          {Object.entries(FORMATS).map(([key, f]) => (
            <button
              key={key}
              onClick={() => setFormat(key)}
              style={{
                padding: '10px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem',
                background: format === key ? 'linear-gradient(135deg, #0891b2, #7c3aed)' : 'rgba(12,9,35,0.6)',
                color: format === key ? 'white' : '#9d8fc2',
                border: `1px solid ${format === key ? 'transparent' : 'rgba(124,58,237,0.25)'}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dirección */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {[['encode', `Texto → ${fmt.label}`], ['decode', `${fmt.label} → Texto`]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            style={{
              flex: 1, padding: '11px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
              background: mode === key ? 'rgba(124,58,237,0.25)' : 'rgba(12,9,35,0.6)',
              color: mode === key ? 'white' : '#9d8fc2',
              border: `1px solid ${mode === key ? 'rgba(217,70,239,0.4)' : 'rgba(124,58,237,0.25)'}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Entrada */}
      <div>
        <label style={{ display: 'block', color: '#c4b5fd', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
          {mode === 'encode' ? 'Tu texto' : `Tu ${fmt.label}`}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          placeholder={mode === 'encode' ? 'Escribe o pega tu texto…' : `Pega tu ${fmt.label}…`}
          style={{ width: '100%', boxSizing: 'border-box', background: '#0c0923', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px', padding: '14px', color: 'white', fontSize: '0.92rem', lineHeight: 1.5, outline: 'none', resize: 'vertical', fontFamily: inMono ? 'monospace' : 'inherit' }}
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
            wordBreak: 'break-all', whiteSpace: 'pre-wrap', fontFamily: outMono ? 'monospace' : 'inherit',
          }}
        >
          {error || output || <span style={{ color: '#6b5fa0' }}>El resultado aparecerá aquí…</span>}
        </div>
      </div>
    </div>
  )
}
