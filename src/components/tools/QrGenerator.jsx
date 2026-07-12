'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Download, Link2, MessageCircle, AtSign, ImagePlus, X } from 'lucide-react'

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

// Estilos -> opciones de qr-code-styling
const STYLES = {
  cuadrado: { label: 'Cuadrado', dots: 'square', corner: 'square' },
  redondeado: { label: 'Redondeado', dots: 'rounded', corner: 'extra-rounded' },
  puntos: { label: 'Puntos', dots: 'dots', corner: 'dot' },
  elegante: { label: 'Elegante', dots: 'classy-rounded', corner: 'extra-rounded' },
}

function roundRect(ctx, x, y, w, h, r) {
  if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); return }
  ctx.beginPath()
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath()
}

function loadImage(src) {
  return new Promise((res, rej) => {
    const img = new Image()
    img.onload = () => res(img)
    img.onerror = rej
    img.src = src
  })
}

const LIGHT = '#ffffff' // fondo siempre blanco para garantizar la lectura

export default function QrGenerator() {
  const [text, setText] = useState('https://digispherix.com.mx')
  const [size, setSize] = useState(1024)
  const [dark, setDark] = useState('#0c0923')
  const [style, setStyle] = useState('cuadrado')
  const [caption, setCaption] = useState('')
  const [frame, setFrame] = useState(false)
  const [logoUrl, setLogoUrl] = useState(null)
  const [dataUrl, setDataUrl] = useState('')
  const [error, setError] = useState('')
  const logoInputRef = useRef(null)

  const generate = useCallback(async () => {
    if (!text.trim()) { setDataUrl(''); setError(''); return }
    try {
      const QRCodeStyling = (await import('qr-code-styling')).default
      const st = STYLES[style]
      const base = 1000
      // El QR se genera sin logo; el logo lo dibujamos nosotros sobre el
      // canvas para evitar el cuelgue de la carga de imagen de la librería.
      const qr = new QRCodeStyling({
        width: base,
        height: base,
        type: 'canvas',
        data: text,
        margin: 8,
        qrOptions: { errorCorrectionLevel: 'H' },
        dotsOptions: { type: st.dots, color: dark },
        cornersSquareOptions: { type: st.corner, color: dark },
        cornersDotOptions: { color: dark },
        backgroundOptions: { color: LIGHT },
      })
      const blob = await qr.getRawData('png')
      const qrImg = await loadImage(URL.createObjectURL(blob))

      const pad = frame ? 70 : 24
      const capH = caption.trim() ? 130 : 0
      const canvas = document.createElement('canvas')
      canvas.width = base + pad * 2
      canvas.height = base + pad * 2 + capH
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = LIGHT
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      if (frame) {
        ctx.strokeStyle = dark; ctx.lineWidth = 14
        roundRect(ctx, 10, 10, canvas.width - 20, canvas.height - 20, 28); ctx.stroke()
      }
      ctx.drawImage(qrImg, pad, pad, base, base)
      URL.revokeObjectURL(qrImg.src)

      // Logo al centro (dibujado por nosotros, con recuadro blanco de respaldo)
      if (logoUrl) {
        try {
          const logoImg = await loadImage(logoUrl)
          const ls = Math.round(base * 0.22)
          const cx = pad + base / 2
          const cy = pad + base / 2
          const boxPad = Math.round(ls * 0.14)
          ctx.fillStyle = LIGHT
          roundRect(ctx, cx - ls / 2 - boxPad, cy - ls / 2 - boxPad, ls + boxPad * 2, ls + boxPad * 2, Math.round(ls * 0.2))
          ctx.fill()
          // dibujar el logo manteniendo su proporción (contain)
          const ratio = Math.min(ls / logoImg.width, ls / logoImg.height)
          const lw = logoImg.width * ratio
          const lh = logoImg.height * ratio
          ctx.drawImage(logoImg, cx - lw / 2, cy - lh / 2, lw, lh)
        } catch { /* si el logo falla, se ignora y el QR queda sin logo */ }
      }

      if (caption.trim()) {
        ctx.fillStyle = dark
        ctx.font = `bold ${Math.round(base * 0.075)}px system-ui, sans-serif`
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        ctx.fillText(caption.trim(), canvas.width / 2, pad + base + capH * 0.55, base)
      }
      setDataUrl(canvas.toDataURL('image/png'))
      setError('')
    } catch {
      setError('No se pudo generar el código QR. Revisa el texto.')
      setDataUrl('')
    }
  }, [text, dark, style, caption, frame, logoUrl])

  useEffect(() => { generate() }, [generate])

  const onLogo = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => setLogoUrl(e.target.result)
    reader.readAsDataURL(file)
  }
  const removeLogo = () => { setLogoUrl(null); if (logoInputRef.current) logoInputRef.current.value = '' }

  const download = () => {
    if (!dataUrl) return
    const img = new Image()
    img.onload = () => {
      const scale = size / img.width
      const out = document.createElement('canvas')
      out.width = size
      out.height = Math.round(img.height * scale)
      const ctx = out.getContext('2d')
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, out.width, out.height)
      const a = document.createElement('a')
      a.href = out.toDataURL('image/png')
      a.download = 'codigo-qr-digispherix.png'
      a.click()
    }
    img.src = dataUrl
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Vista previa */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '240px', minHeight: '240px', borderRadius: '16px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(124,58,237,0.2)', padding: '8px' }}>
          {dataUrl ? (
            <img src={dataUrl} alt="Código QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <span style={{ color: '#9d8fc2', fontSize: '0.85rem', padding: '16px', textAlign: 'center' }}>{error || 'Escribe algo para generar tu QR'}</span>
          )}
        </div>
      </div>

      {/* Texto */}
      <div>
        <label style={{ display: 'block', color: '#c4b5fd', fontSize: '0.88rem', fontWeight: 600, marginBottom: '8px' }}>Texto o enlace</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} placeholder="https://tu-sitio.com o cualquier texto"
          style={{ width: '100%', boxSizing: 'border-box', background: '#0c0923', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px', padding: '12px 14px', color: 'white', fontSize: '0.95rem', outline: 'none', resize: 'vertical' }} />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
          {EXAMPLES.map((ex) => (
            <button key={ex.label} onClick={() => setText(ex.value)} style={chip}><ex.icon size={13} /> {ex.label}</button>
          ))}
        </div>
      </div>

      {/* Estilo */}
      <div>
        <label style={{ display: 'block', color: '#c4b5fd', fontSize: '0.88rem', fontWeight: 600, marginBottom: '10px' }}>Estilo</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
          {Object.entries(STYLES).map(([key, s]) => (
            <button key={key} onClick={() => setStyle(key)} style={{
              padding: '11px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem',
              background: style === key ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : 'rgba(12,9,35,0.6)',
              color: style === key ? 'white' : '#9d8fc2',
              border: `1px solid ${style === key ? 'transparent' : 'rgba(124,58,237,0.25)'}`,
            }}>{s.label}</button>
          ))}
        </div>
      </div>

      {/* Leyenda */}
      <div>
        <label style={{ display: 'block', color: '#c4b5fd', fontSize: '0.88rem', fontWeight: 600, marginBottom: '8px' }}>Leyenda (opcional)</label>
        <input type="text" value={caption} maxLength={30} onChange={(e) => setCaption(e.target.value)} placeholder="Ej. Escanéame"
          style={{ width: '100%', boxSizing: 'border-box', background: '#0c0923', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px', padding: '12px 14px', color: 'white', fontSize: '0.95rem', outline: 'none' }} />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
          {['Escanéame', 'Síguenos', 'Menú'].map((c) => (<button key={c} onClick={() => setCaption(c)} style={chip}>{c}</button>))}
        </div>
      </div>

      {/* Logo + borde */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        {logoUrl ? (
          <button onClick={removeLogo} style={{ ...chip, color: '#f87171', borderColor: 'rgba(248,113,113,0.4)', background: 'rgba(248,113,113,0.1)' }}><X size={14} /> Quitar logo</button>
        ) : (
          <label style={{ ...chip, cursor: 'pointer' }}>
            <ImagePlus size={14} /> Agregar logo al centro
            <input ref={logoInputRef} type="file" accept="image/*" onChange={(e) => onLogo(e.target.files[0])} style={{ display: 'none' }} />
          </label>
        )}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', fontSize: '0.85rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={frame} onChange={(e) => setFrame(e.target.checked)} style={{ accentColor: '#d946ef', width: '17px', height: '17px' }} /> Borde
        </label>
      </div>

      {/* Color */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c4b5fd', fontSize: '0.85rem' }}>
          Color del código
          <input type="color" value={dark} onChange={(e) => setDark(e.target.value)} style={colorInput} />
        </label>
        <span style={{ color: '#6b5fa0', fontSize: '0.78rem' }}>El fondo es blanco para asegurar que el código se escanee siempre.</span>
      </div>

      {/* Tamaño */}
      <div>
        <label style={{ display: 'block', color: '#c4b5fd', fontSize: '0.88rem', fontWeight: 600, marginBottom: '10px' }}>Tamaño de descarga</label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {SIZES.map((s) => (
            <button key={s.px} onClick={() => setSize(s.px)} style={{
              flex: '1 1 90px', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem',
              background: size === s.px ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : 'rgba(12,9,35,0.6)',
              color: size === s.px ? 'white' : '#9d8fc2',
              border: `1px solid ${size === s.px ? 'transparent' : 'rgba(124,58,237,0.25)'}`,
            }}>
              {s.label}<span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 500, opacity: 0.8 }}>{s.px}px</span>
            </button>
          ))}
        </div>
      </div>

      <button onClick={download} disabled={!dataUrl} className="btn-primary justify-center" style={{ width: '100%', opacity: dataUrl ? 1 : 0.5 }}>
        <Download size={18} /> Descargar QR (PNG)
      </button>
    </div>
  )
}

const chip = { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '99px', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.3)', color: '#93c5fd', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }
const colorInput = { width: '38px', height: '32px', border: 'none', borderRadius: '8px', background: 'none', cursor: 'pointer' }
