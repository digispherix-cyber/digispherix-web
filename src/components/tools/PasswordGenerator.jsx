'use client'

import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Copy, Check } from 'lucide-react'

const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?',
}

function secureRandom(max) {
  // Evita sesgo del módulo usando rechazo.
  const arr = new Uint32Array(1)
  const limit = Math.floor(0xffffffff / max) * max
  let x
  do {
    crypto.getRandomValues(arr)
    x = arr[0]
  } while (x >= limit)
  return x % max
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [opts, setOpts] = useState({ lower: true, upper: true, numbers: true, symbols: true })
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = useCallback(() => {
    const pool = Object.entries(opts)
      .filter(([, on]) => on)
      .map(([k]) => SETS[k])
    if (pool.length === 0) {
      setPassword('')
      return
    }
    const all = pool.join('')
    const chars = []
    // Garantiza al menos un carácter de cada set activo.
    pool.forEach((set) => chars.push(set[secureRandom(set.length)]))
    for (let i = chars.length; i < length; i++) chars.push(all[secureRandom(all.length)])
    // Mezcla (Fisher-Yates).
    for (let i = chars.length - 1; i > 0; i--) {
      const j = secureRandom(i + 1)
      ;[chars[i], chars[j]] = [chars[j], chars[i]]
    }
    setPassword(chars.slice(0, length).join(''))
    setCopied(false)
  }, [length, opts])

  useEffect(() => {
    generate()
  }, [generate])

  const activeCount = Object.values(opts).filter(Boolean).length

  const toggle = (key) => {
    // No permitir desactivar el último set activo.
    if (opts[key] && activeCount === 1) return
    setOpts((o) => ({ ...o, [key]: !o[key] }))
  }

  const copy = async () => {
    if (!password) return
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard no disponible */
    }
  }

  // Fuerza aproximada.
  const poolSize = Object.entries(opts).filter(([, on]) => on).reduce((n, [k]) => n + SETS[k].length, 0)
  const entropy = password ? Math.round(length * Math.log2(poolSize || 1)) : 0
  const strength = entropy >= 90 ? { label: 'Muy fuerte', color: '#34d399', pct: 100 }
    : entropy >= 60 ? { label: 'Fuerte', color: '#22c55e', pct: 75 }
    : entropy >= 40 ? { label: 'Media', color: '#eab308', pct: 50 }
    : { label: 'Débil', color: '#ef4444', pct: 25 }

  const labels = { lower: 'Minúsculas (a-z)', upper: 'Mayúsculas (A-Z)', numbers: 'Números (0-9)', symbols: 'Símbolos (!@#$)' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Resultado */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <div
          style={{
            flex: '1 1 240px', minWidth: 0, background: 'var(--bg-card-alt)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '16px 18px', fontFamily: 'monospace', fontSize: '1.1rem',
            color: 'var(--text-strong)', wordBreak: 'break-all', minHeight: '56px', display: 'flex', alignItems: 'center',
          }}
        >
          {password || '—'}
        </div>
        <div className="pw-actions">
          <button onClick={generate} className="btn-secondary pw-action-btn justify-center" style={{ padding: '0 20px' }} aria-label="Generar otra contraseña">
            <RefreshCw size={20} />
          </button>
          <button onClick={copy} className="btn-primary pw-action-btn justify-center" style={{ padding: '0 22px' }} aria-label="Copiar contraseña">
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
      </div>

      {/* Fuerza */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Seguridad</span>
          <span style={{ color: strength.color, fontSize: '0.8rem', fontWeight: 700 }}>{strength.label}</span>
        </div>
        <div style={{ height: '6px', borderRadius: '99px', background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${strength.pct}%`, background: strength.color, transition: 'width 0.3s, background 0.3s' }} />
        </div>
      </div>

      {/* Longitud */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <label htmlFor="len" style={{ color: 'var(--text)', fontSize: '0.9rem', fontWeight: 600 }}>Longitud</label>
          <span style={{ color: 'var(--text-strong)', fontWeight: 700 }}>{length}</span>
        </div>
        <input
          id="len" type="range" min="6" max="40" value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--accent-2)', cursor: 'pointer' }}
        />
      </div>

      {/* Opciones */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
        {Object.keys(labels).map((key) => (
          <label
            key={key}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none',
              padding: '12px 14px', borderRadius: '10px',
              background: opts[key] ? 'var(--bg-card-alt)' : 'transparent',
              border: `1px solid ${opts[key] ? 'var(--accent-2)' : 'var(--border)'}`,
              transition: 'all 0.2s',
            }}
          >
            <input type="checkbox" checked={opts[key]} onChange={() => toggle(key)} style={{ accentColor: 'var(--accent-2)', width: '17px', height: '17px' }} />
            <span style={{ color: opts[key] ? 'var(--text-strong)' : 'var(--text-muted)', fontSize: '0.85rem' }}>{labels[key]}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
