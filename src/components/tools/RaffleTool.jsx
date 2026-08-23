'use client'

import { useState, useRef } from 'react'
import { Trophy, Shuffle, Copy, Check, Eraser } from 'lucide-react'

// Entero aleatorio seguro en [0, max) usando crypto (sin sesgo, con rechazo).
function secureInt(max) {
  const arr = new Uint32Array(1)
  const limit = Math.floor(0xffffffff / max) * max
  let x
  do { crypto.getRandomValues(arr); x = arr[0] } while (x >= limit)
  return x % max
}

function pickWinners(list, count) {
  const pool = [...list]
  const winners = []
  const n = Math.min(count, pool.length)
  for (let i = 0; i < n; i++) {
    const idx = secureInt(pool.length)
    winners.push(pool[idx])
    pool.splice(idx, 1)
  }
  return winners
}

export default function RaffleTool() {
  const [input, setInput] = useState('')
  const [count, setCount] = useState(1)
  const [dedupe, setDedupe] = useState(true)
  const [drawing, setDrawing] = useState(false)
  const [flash, setFlash] = useState('')
  const [winners, setWinners] = useState([])
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)

  let participants = input.split('\n').map((s) => s.trim()).filter(Boolean)
  if (dedupe) participants = [...new Set(participants)]
  const total = participants.length
  const maxWinners = Math.max(1, total)

  const draw = () => {
    if (total === 0 || drawing) return
    setWinners([])
    setDrawing(true)
    const start = Date.now()
    const dur = 1800
    timer.current = setInterval(() => {
      setFlash(participants[secureInt(participants.length)])
      if (Date.now() - start >= dur) {
        clearInterval(timer.current)
        setDrawing(false)
        setFlash('')
        setWinners(pickWinners(participants, Math.min(count, total)))
      }
    }, 80)
  }

  const copy = async () => {
    if (!winners.length) return
    const text = winners.length === 1
      ? `🏆 Ganador: ${winners[0]}`
      : '🏆 Ganadores:\n' + winners.map((w, i) => `${i + 1}. ${w}`).join('\n')
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* noop */ }
  }

  const reset = () => { setInput(''); setWinners([]); setFlash('') }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Participantes */}
      <div>
        <label style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
          <span>Participantes (uno por línea)</span>
          <span style={{ color: 'var(--text-dim)', fontWeight: 500 }}>{total} en total</span>
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={7}
          placeholder={'@usuario1\n@usuario2\nMaría López\nJuan Pérez\n…'}
          style={{ width: '100%', boxSizing: 'border-box', background: 'var(--bg-card-alt)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', color: 'var(--text-strong)', fontSize: '0.95rem', lineHeight: 1.6, outline: 'none', resize: 'vertical' }}
        />
      </div>

      {/* Opciones */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)', fontSize: '0.88rem' }}>
          Ganadores
          <input
            type="number" min={1} max={maxWinners} value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(maxWinners, Number(e.target.value) || 1)))}
            style={{ width: '70px', background: 'var(--bg-card-alt)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 10px', color: 'var(--text-strong)', fontSize: '0.95rem', outline: 'none' }}
          />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text)', fontSize: '0.88rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={dedupe} onChange={(e) => setDedupe(e.target.checked)} style={{ accentColor: 'var(--accent-2)', width: '17px', height: '17px' }} />
          Quitar duplicados
        </label>
      </div>

      {/* Botón sortear */}
      <button onClick={draw} disabled={total === 0 || drawing} className="btn-primary justify-center" style={{ width: '100%', opacity: total === 0 ? 0.5 : 1 }}>
        <Shuffle size={18} /> {drawing ? 'Sorteando…' : 'Sortear'}
      </button>

      {/* Resultado */}
      {(drawing || winners.length > 0) && (
        <div style={{ background: 'var(--bg-card-alt)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px', textAlign: 'center', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {drawing ? (
            <div style={{ color: 'var(--text-strong)', fontSize: '1.4rem', fontWeight: 800, opacity: 0.85 }}>{flash || '…'}</div>
          ) : (
            <>
              <Trophy size={30} style={{ color: 'var(--accent-4)', marginBottom: '10px' }} />
              <div style={{ color: 'var(--text)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>
                {winners.length === 1 ? 'Ganador' : `${winners.length} Ganadores`}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                {winners.map((w, i) => (
                  <div key={i} style={{ color: 'var(--text-strong)', fontSize: '1.25rem', fontWeight: 800, background: 'var(--bg-card-alt)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 14px' }}>
                    {w}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '18px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button onClick={copy} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                  {copied ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar resultado</>}
                </button>
                <button onClick={draw} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                  <Shuffle size={14} /> Sortear de nuevo
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {input && (
        <button onClick={reset} className="btn-secondary" style={{ alignSelf: 'flex-start', padding: '8px 16px', fontSize: '0.82rem' }}>
          <Eraser size={14} /> Limpiar todo
        </button>
      )}
    </div>
  )
}
