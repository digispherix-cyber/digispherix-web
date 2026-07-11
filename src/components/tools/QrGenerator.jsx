'use client'

import { useState, useEffect, useCallback } from 'react'
import { Download, Link2, MessageCircle, AtSign } from 'lucide-react'
import QRCode from 'qrcode'

const SIZES = [
  { label: 'Pequeño', px: 512 },
  { label: 'Mediano', px: 1024 },
  { label: 'Grande', px: 2048 },
]

const EXAMPLES = [
  { icon: Link2, label: 'Sitio web', value: 'https://digispherix.com.mx' },
  { icon: MessageCircle, label: 'WhatsApp', value: 'https://wa.me/523320318435' },
  { icon: AtSign, label: 'Instagram', value: 'https://instagram.com/digispherix' },
]

export default function QrGenerator() {
  const [text, setText] = useState('https://digispherix.com.mx')
  const [size, setSize] = useState(1024)
  const [dark, setDark] = useState('#0c0923')
  const [light, setLight] = useState('#ffffff')
  const [dataUrl, setDataUrl] = useState('')
  const [error, setError] = useState('')

  const generate = useCallback(async () => {
    if (!text.trim()) {
      setDataUrl('')
      setError('')
      return
    }
    try {
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: { dark, light },
      })
      setDataUrl(url)
      setError('')
    } catch {
      setError('No se pudo generar el código QR. Revisa el texto.')
      setDataUrl('')
    }
  }, [text, size, dark, light])

  useEffect(() => {
    generate()
  }, [generate])

  const download = () => {
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'codigo-qr-digispherix.png'
    a.click()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Vista previa */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: '220px', height: '220px', borderRadius: '16px', background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
            border: '1px solid rgba(124,58,237,0.2)',
          }}
        >
          {dataUrl ? (
            <img src={dataUrl} alt="Código QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <span style={{ color: '#9d8fc2', fontSize: '0.85rem', padding: '16px', textAlign: 'center' }}>
              {error || 'Escribe algo para generar tu QR'}
            </span>
          )}
        </div>
      </div>

      {/* Texto / enlace */}
      <div>
        <label style={{ display: 'block', color: '#c4b5fd', fontSize: '0.88rem', fontWeight: 600, marginBottom: '8px' }}>
          Texto o enlace
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          placeholder="https://tu-sitio.com o cualquier texto"
          style={{
            width: '100%', boxSizing: 'border-box', background: '#0c0923', border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '10px', padding: '12px 14px', color: 'white', fontSize: '0.95rem', outline: 'none', resize: 'vertical',
          }}
        />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => setText(ex.value)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '99px', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.3)', color: '#93c5fd', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <ex.icon size={13} /> {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tamaño */}
      <div>
        <label style={{ display: 'block', color: '#c4b5fd', fontSize: '0.88rem', fontWeight: 600, marginBottom: '10px' }}>Tamaño de descarga</label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {SIZES.map((s) => (
            <button
              key={s.px}
              onClick={() => setSize(s.px)}
              style={{
                flex: '1 1 90px', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem',
                background: size === s.px ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : 'rgba(12,9,35,0.6)',
                color: size === s.px ? 'white' : '#9d8fc2',
                border: `1px solid ${size === s.px ? 'transparent' : 'rgba(124,58,237,0.25)'}`,
              }}
            >
              {s.label}
              <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 500, opacity: 0.8 }}>{s.px}px</span>
            </button>
          ))}
        </div>
      </div>

      {/* Colores */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c4b5fd', fontSize: '0.85rem' }}>
          Color del código
          <input type="color" value={dark} onChange={(e) => setDark(e.target.value)} style={{ width: '38px', height: '32px', border: 'none', borderRadius: '8px', background: 'none', cursor: 'pointer' }} />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c4b5fd', fontSize: '0.85rem' }}>
          Fondo
          <input type="color" value={light} onChange={(e) => setLight(e.target.value)} style={{ width: '38px', height: '32px', border: 'none', borderRadius: '8px', background: 'none', cursor: 'pointer' }} />
        </label>
      </div>

      <button onClick={download} disabled={!dataUrl} className="btn-primary justify-center" style={{ width: '100%', opacity: dataUrl ? 1 : 0.5 }}>
        <Download size={18} /> Descargar QR (PNG)
      </button>
    </div>
  )
}
