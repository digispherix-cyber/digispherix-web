'use client'

import { useState, useRef } from 'react'
import { Copy, Check, ImagePlus, X } from 'lucide-react'

const field = { width: '100%', boxSizing: 'border-box', background: '#0c0923', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px', padding: '11px 13px', color: 'white', fontSize: '0.92rem', outline: 'none' }
const lbl = { display: 'block', color: '#c4b5fd', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }

export default function EmailSignatureTool() {
  const [d, setD] = useState({
    nombre: 'María López', puesto: 'Directora de Ventas', empresa: 'Mi Empresa',
    telefono: '33 1234 5678', correo: 'maria@miempresa.com', sitio: 'www.miempresa.com',
  })
  const [accent, setAccent] = useState('#7c3aed')
  const [logo, setLogo] = useState(null)
  const [copied, setCopied] = useState(false)
  const previewRef = useRef(null)
  const logoInputRef = useRef(null)

  const set = (k) => (e) => setD((p) => ({ ...p, [k]: e.target.value }))

  const onLogo = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => setLogo(e.target.result)
    reader.readAsDataURL(file)
  }
  const removeLogo = () => { setLogo(null); if (logoInputRef.current) logoInputRef.current.value = '' }

  const copy = () => {
    const node = previewRef.current
    if (!node) return
    try {
      const range = document.createRange()
      range.selectNodeContents(node)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(range)
      document.execCommand('copy')
      sel.removeAllRanges()
      setCopied(true); setTimeout(() => setCopied(false), 2500)
    } catch { /* noop */ }
  }

  const line = (label, k) => (
    <div>
      <label style={lbl}>{label}</label>
      <input type="text" value={d[k]} onChange={set(k)} style={field} />
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Formulario */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {line('Nombre completo', 'nombre')}
        {line('Puesto', 'puesto')}
        {line('Empresa', 'empresa')}
        {line('Teléfono', 'telefono')}
        {line('Correo', 'correo')}
        {line('Sitio web', 'sitio')}
      </div>

      <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c4b5fd', fontSize: '0.85rem' }}>
          Color
          <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} style={{ width: '38px', height: '32px', border: 'none', borderRadius: '8px', background: 'none', cursor: 'pointer' }} />
        </label>
        {logo ? (
          <button onClick={removeLogo} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '99px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.4)', color: '#f87171', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
            <X size={14} /> Quitar logo
          </button>
        ) : (
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '99px', background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.3)', color: '#93c5fd', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
            <ImagePlus size={14} /> Agregar logo
            <input ref={logoInputRef} type="file" accept="image/*" onChange={(e) => onLogo(e.target.files[0])} style={{ display: 'none' }} />
          </label>
        )}
      </div>

      {/* Vista previa (fondo blanco, como en el correo) */}
      <div>
        <label style={lbl}>Vista previa</label>
        <div style={{ background: 'white', borderRadius: '12px', padding: '26px', overflowX: 'auto' }}>
          <div ref={previewRef}>
            <table cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse', fontFamily: 'Arial, Helvetica, sans-serif' }}>
              <tbody>
                <tr>
                  {logo && (
                    <td style={{ verticalAlign: 'middle', paddingRight: '18px' }}>
                      <img src={logo} alt={d.empresa} style={{ width: '72px', height: '72px', objectFit: 'contain', display: 'block' }} />
                    </td>
                  )}
                  <td style={{ verticalAlign: 'middle', borderLeft: `3px solid ${accent}`, paddingLeft: '18px' }}>
                    <div style={{ fontSize: '17px', fontWeight: 'bold', color: '#1a1a1a' }}>{d.nombre}</div>
                    <div style={{ fontSize: '13px', color: accent, fontWeight: 'bold', margin: '2px 0 8px' }}>
                      {d.puesto}{d.puesto && d.empresa ? ' · ' : ''}{d.empresa}
                    </div>
                    {d.telefono && <div style={{ fontSize: '12px', color: '#444', lineHeight: 1.8 }}>Tel: {d.telefono}</div>}
                    {d.correo && <div style={{ fontSize: '12px', lineHeight: 1.8 }}><a href={`mailto:${d.correo}`} style={{ color: '#444', textDecoration: 'none' }}>{d.correo}</a></div>}
                    {d.sitio && <div style={{ fontSize: '12px', lineHeight: 1.8 }}><a href={`https://${d.sitio.replace(/^https?:\/\//, '')}`} style={{ color: accent, textDecoration: 'none', fontWeight: 'bold' }}>{d.sitio}</a></div>}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <button onClick={copy} className="btn-primary justify-center" style={{ width: '100%' }}>
        {copied ? <><Check size={16} /> Firma copiada</> : <><Copy size={16} /> Copiar firma</>}
      </button>

      <p style={{ color: '#6b5fa0', fontSize: '0.8rem', lineHeight: 1.6, textAlign: 'center', margin: 0 }}>
        Copia la firma y pégala en la sección de firma de tu correo (en Gmail: Configuración → General → Firma).
        Si usas logo y no aparece en Gmail, súbelo como imagen desde el editor de firma de Gmail.
      </p>
    </div>
  )
}
