'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

// ── Conversiones de color ──
function hexToRgb(hex) {
  const m = hex.replace('#', '')
  const n = m.length === 3 ? m.split('').map((c) => c + c).join('') : m
  const int = parseInt(n, 16)
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 }
}
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}
function hslToHex(h, s, l) {
  s /= 100; l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return rgbToHex(255 * f(0), 255 * f(8), 255 * f(4))
}

function Swatch({ hex, label }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(hex); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { /* noop */ }
  }
  return (
    <button onClick={copy} title={`Copiar ${hex}`} style={{ border: 'none', padding: 0, cursor: 'pointer', borderRadius: '10px', overflow: 'hidden', background: 'none' }}>
      <div style={{ height: '56px', background: hex, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {copied && <Check size={18} style={{ color: '#fff', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.6))' }} />}
      </div>
      <div style={{ padding: '6px 4px', background: 'rgba(12,9,35,0.8)', textAlign: 'center' }}>
        <div style={{ color: '#c4b5fd', fontSize: '0.68rem', fontFamily: 'monospace' }}>{hex}</div>
        {label && <div style={{ color: '#6b5fa0', fontSize: '0.6rem' }}>{label}</div>}
      </div>
    </button>
  )
}

function ValueRow({ label, value }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { /* noop */ }
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0c0923', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '10px', padding: '10px 12px' }}>
      <span style={{ color: '#9d8fc2', fontSize: '0.78rem', width: '40px', flexShrink: 0 }}>{label}</span>
      <span style={{ color: 'white', fontFamily: 'monospace', fontSize: '0.9rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
      <button onClick={copy} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  )
}

export default function ColorPalette() {
  const [hex, setHex] = useState('#7c3aed')

  const safeHex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex) ? hex : '#7c3aed'
  const { r, g, b } = hexToRgb(safeHex)
  const { h, s, l } = rgbToHsl(r, g, b)

  const shades = [90, 75, 60, 45, 30].map((L) => ({ hex: hslToHex(h, s, L), label: `${L}%` }))
  const harmonics = [
    { hex: hslToHex((h + 30) % 360, s, l), label: 'Análogo' },
    { hex: hslToHex((h - 30 + 360) % 360, s, l), label: 'Análogo' },
    { hex: hslToHex((h + 180) % 360, s, l), label: 'Complem.' },
    { hex: hslToHex((h + 150) % 360, s, l), label: 'Triádico' },
    { hex: hslToHex((h + 210) % 360, s, l), label: 'Triádico' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Selector */}
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="color"
          value={safeHex}
          onChange={(e) => setHex(e.target.value)}
          style={{ width: '72px', height: '72px', border: 'none', borderRadius: '14px', background: 'none', cursor: 'pointer', flexShrink: 0 }}
          aria-label="Selector de color"
        />
        <div style={{ flex: '1 1 160px' }}>
          <label style={{ display: 'block', color: '#c4b5fd', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Código HEX</label>
          <input
            type="text"
            value={hex}
            onChange={(e) => setHex(e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', background: '#0c0923', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '10px', padding: '12px 14px', color: 'white', fontSize: '1rem', fontFamily: 'monospace', outline: 'none' }}
          />
        </div>
      </div>

      {/* Valores */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <ValueRow label="HEX" value={safeHex.toUpperCase()} />
        <ValueRow label="RGB" value={`rgb(${r}, ${g}, ${b})`} />
        <ValueRow label="HSL" value={`hsl(${h}, ${s}%, ${l}%)`} />
      </div>

      {/* Tonos */}
      <div>
        <p style={{ color: '#c4b5fd', fontSize: '0.85rem', fontWeight: 600, marginBottom: '10px' }}>Tonos</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          {shades.map((sw, i) => <Swatch key={i} hex={sw.hex} label={sw.label} />)}
        </div>
      </div>

      {/* Armónicos */}
      <div>
        <p style={{ color: '#c4b5fd', fontSize: '0.85rem', fontWeight: 600, marginBottom: '10px' }}>Colores armónicos</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          {harmonics.map((sw, i) => <Swatch key={i} hex={sw.hex} label={sw.label} />)}
        </div>
      </div>

      <p style={{ color: '#6b5fa0', fontSize: '0.78rem', textAlign: 'center', margin: 0 }}>Toca cualquier color para copiar su código.</p>
    </div>
  )
}
