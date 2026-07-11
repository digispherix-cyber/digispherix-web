'use client'

import { useState } from 'react'

function stats(text) {
  const trimmed = text.trim()
  const words = trimmed ? trimmed.split(/\s+/).length : 0
  const chars = text.length
  const charsNoSpaces = text.replace(/\s/g, '').length
  const paragraphs = trimmed ? trimmed.split(/\n+/).filter((p) => p.trim()).length : 0
  const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+/g) || [trimmed]).length : 0
  const minutes = words / 200
  const readTime = words === 0 ? '0 s' : minutes < 1 ? `${Math.max(1, Math.round(minutes * 60))} s` : `${Math.ceil(minutes)} min`
  return { words, chars, charsNoSpaces, paragraphs, sentences, readTime }
}

const CARDS = [
  { key: 'words', label: 'Palabras' },
  { key: 'chars', label: 'Caracteres' },
  { key: 'charsNoSpaces', label: 'Sin espacios' },
  { key: 'paragraphs', label: 'Párrafos' },
  { key: 'sentences', label: 'Oraciones' },
  { key: 'readTime', label: 'Lectura' },
]

export default function WordCounter() {
  const [text, setText] = useState('')
  const s = stats(text)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Estadísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
        {CARDS.map((c) => (
          <div key={c.key} style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '12px', padding: '14px 10px', textAlign: 'center' }}>
            <div className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 900, lineHeight: 1.1 }}>{s[c.key]}</div>
            <div style={{ color: '#9d8fc2', fontSize: '0.75rem', marginTop: '2px' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Texto */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ color: '#c4b5fd', fontSize: '0.85rem', fontWeight: 600 }}>Tu texto</label>
          {text && (
            <button onClick={() => setText('')} className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.78rem' }}>Limpiar</button>
          )}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder="Escribe o pega tu texto aquí…"
          style={{ width: '100%', boxSizing: 'border-box', background: '#0c0923', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px', padding: '14px', color: 'white', fontSize: '0.95rem', lineHeight: 1.6, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
        />
      </div>
    </div>
  )
}
