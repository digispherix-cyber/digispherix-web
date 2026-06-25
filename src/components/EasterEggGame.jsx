import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap } from 'lucide-react'

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
const W = 460
const H = 460
const PLAYER_W = 44
const MAX_LIVES = 3
const INVINCIBLE_MS = 1800
const IS_TOUCH = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

function getDifficulty(score) {
  if (score < 50)  return { interval: 6000, shooters: 1, bSpeed: 2.2, eSpeed: 0.28, label: 'Fácil' }
  if (score < 130) return { interval: 4800, shooters: 1, bSpeed: 2.8, eSpeed: 0.45, label: 'Normal' }
  if (score < 250) return { interval: 3600, shooters: 2, bSpeed: 3.6, eSpeed: 0.65, label: 'Difícil' }
  if (score < 400) return { interval: 2600, shooters: 3, bSpeed: 4.5, eSpeed: 0.9,  label: '💀 Peligroso' }
  return             { interval: 1600, shooters: 5, bSpeed: 6.0, eSpeed: 1.3,  label: '🔥 Experto' }
}

function mkEnemies() {
  const out = []
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 7; c++)
      out.push({ id: `${r}-${c}`, x: 20 + c * 60, y: 48 + r * 44, alive: true })
  return out
}

export const easterEggTrigger = { open: null }

export default function EasterEggGame() {
  // ── UI state (triggers re-render) ──────────────────────────
  const [open, setOpen]           = useState(false)
  const [gameState, setGameState] = useState('idle')
  const [score, setScore]         = useState(0)
  const [lives, setLives]         = useState(MAX_LIVES)
  const [diffLabel, setDiffLabel] = useState('Fácil')
  const [explosion, setExplosion] = useState(null)
  const [respawning, setRespawning] = useState(false)
  const [, forceRender]           = useState(0)  // incremented every frame

  // ── Game refs (mutable, never cause re-render) ─────────────
  const pxRef      = useRef(W / 2 - PLAYER_W / 2)  // player X
  const exRef      = useRef(0)                       // enemy group X offset
  const edirRef    = useRef(1)                       // enemy direction
  const bulletsRef = useRef([])                      // player bullets
  const ebRef      = useRef([])                      // enemy bullets
  const enRef      = useRef(mkEnemies())             // enemies
  const scoreRef   = useRef(0)
  const livesRef   = useRef(MAX_LIVES)
  const invRef     = useRef(false)                   // invincible after hit
  const lastShotRef   = useRef(-9999)
  const lastEshotRef  = useRef(-9999)                // enemy last shot ts
  const keysRef    = useRef({})
  const frameRef   = useRef(null)
  const gameStateRef = useRef('idle')

  // keep ref in sync with state
  useEffect(() => { gameStateRef.current = gameState }, [gameState])

  // ── Easter egg trigger ─────────────────────────────────────
  useEffect(() => {
    easterEggTrigger.open = () => setOpen(true)
    return () => { easterEggTrigger.open = null }
  }, [])

  // ── Konami code ────────────────────────────────────────────
  useEffect(() => {
    let combo = []
    const onKey = (e) => {
      combo = [...combo, e.key].slice(-KONAMI.length)
      if (combo.join(',') === KONAMI.join(',')) { setOpen(true); combo = [] }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Block Space/Arrow scroll while game is open ────────────
  useEffect(() => {
    if (!open) return
    const block = (e) => {
      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key))
        e.preventDefault()
    }
    window.addEventListener('keydown', block, { passive: false })
    return () => window.removeEventListener('keydown', block)
  }, [open])

  // ── Keyboard for movement / shooting ──────────────────────
  useEffect(() => {
    if (!open) return
    const down = (e) => { keysRef.current[e.key] = true }
    const up   = (e) => { keysRef.current[e.key] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [open])

  // ── Start / reset ──────────────────────────────────────────
  const startGame = useCallback(() => {
    pxRef.current    = W / 2 - PLAYER_W / 2
    exRef.current    = 0
    edirRef.current  = 1
    bulletsRef.current = []
    ebRef.current    = []
    enRef.current    = mkEnemies()
    scoreRef.current = 0
    livesRef.current = MAX_LIVES
    invRef.current   = false
    lastShotRef.current  = -9999
    lastEshotRef.current = -9999
    setScore(0); setLives(MAX_LIVES); setDiffLabel('Fácil')
    setExplosion(null); setRespawning(false)
    setGameState('playing')
  }, [])

  const close = useCallback(() => {
    setOpen(false); setGameState('idle')
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
  }, [])

  // ── Hit handler ────────────────────────────────────────────
  const handleHit = useCallback((px) => {
    if (invRef.current) return
    invRef.current = true
    ebRef.current = []                        // clear enemy bullets immediately
    const remaining = livesRef.current - 1
    livesRef.current = remaining
    setLives(remaining)
    setRespawning(true)
    setExplosion({ x: px + PLAYER_W / 2, y: H - 58 })

    if (remaining <= 0) {
      setTimeout(() => { setExplosion(null); setGameState('lose') }, 900)
    } else {
      setTimeout(() => {
        setExplosion(null); setRespawning(false); invRef.current = false
        lastEshotRef.current = performance.now() + 2000  // grace period after respawn
      }, INVINCIBLE_MS)
    }
  }, [])

  // ── Game loop — STABLE: only depends on [open, gameState] ──
  useEffect(() => {
    if (!open || gameState !== 'playing') return

    const loop = (ts) => {
      if (gameStateRef.current !== 'playing') return

      const diff = getDifficulty(scoreRef.current)
      setDiffLabel(diff.label)

      // Move player
      if (keysRef.current['ArrowLeft']  || keysRef.current['a']) pxRef.current = Math.max(0, pxRef.current - 4)
      if (keysRef.current['ArrowRight'] || keysRef.current['d']) pxRef.current = Math.min(W - PLAYER_W, pxRef.current + 4)

      // Player shoot
      if ((keysRef.current[' '] || keysRef.current['ArrowUp']) && ts - lastShotRef.current > 320) {
        lastShotRef.current = ts
        bulletsRef.current = [...bulletsRef.current, { id: ts + Math.random(), x: pxRef.current + PLAYER_W / 2 - 2, y: H - 60 }]
      }

      // Move player bullets up
      bulletsRef.current = bulletsRef.current
        .map(b => ({ ...b, y: b.y - 7 }))
        .filter(b => b.y > 0)

      // Move enemies
      exRef.current += edirRef.current * diff.eSpeed
      if (exRef.current > 28 || exRef.current < -28) edirRef.current *= -1

      // Enemy shoot — only N random alive enemies fire
      if (!invRef.current && ts - lastEshotRef.current > diff.interval) {
        lastEshotRef.current = ts
        const alive = enRef.current.filter(e => e.alive)
        const shuffled = [...alive].sort(() => Math.random() - 0.5)
        const firing = shuffled.slice(0, Math.min(diff.shooters, alive.length))
        const newEB = firing.map(s => ({
          id: ts + Math.random(),
          x: s.x + exRef.current + 12,
          y: s.y + 28,
          spd: diff.bSpeed,
        }))
        ebRef.current = [...ebRef.current, ...newEB]
      }

      // Move enemy bullets down
      ebRef.current = ebRef.current
        .map(b => ({ ...b, y: b.y + b.spd }))
        .filter(b => b.y < H)

      // Bullet vs enemy
      const hitBulletIds = new Set()
      enRef.current = enRef.current.map(e => {
        if (!e.alive) return e
        const hit = bulletsRef.current.find(b =>
          b.x > e.x + exRef.current - 6 && b.x < e.x + exRef.current + 28 &&
          b.y > e.y && b.y < e.y + 28
        )
        if (hit) {
          hitBulletIds.add(hit.id)
          scoreRef.current += 10
          setScore(scoreRef.current)
          return { ...e, alive: false }
        }
        return e
      })
      if (hitBulletIds.size > 0)
        bulletsRef.current = bulletsRef.current.filter(b => !hitBulletIds.has(b.id))

      // Check win
      if (enRef.current.every(e => !e.alive)) { setGameState('win'); return }

      // Enemy bullet vs player
      if (!invRef.current) {
        const hitEB = ebRef.current.find(b =>
          b.x > pxRef.current - 4 && b.x < pxRef.current + PLAYER_W + 4 &&
          b.y > H - 76 && b.y < H - 38
        )
        if (hitEB) {
          ebRef.current = ebRef.current.filter(b => b.id !== hitEB.id)
          handleHit(pxRef.current)
        }
      }

      forceRender(n => n + 1)
      frameRef.current = requestAnimationFrame(loop)
    }

    frameRef.current = requestAnimationFrame(loop)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [open, gameState, handleHit])  // stable — playerX etc. are refs now

  if (!open) return null

  const hearts = Array.from({ length: MAX_LIVES }, (_, i) => i < lives ? '♥' : '♡')

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 99998,
        background: 'rgba(5,3,20,0.97)', backdropFilter: 'blur(10px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', overflow: 'hidden', padding: '16px',
      }}
    >
      {/* Close */}
      <button onClick={close} style={{
        position: 'fixed', top: '16px', right: '16px', zIndex: 99999,
        width: '44px', height: '44px', borderRadius: '12px',
        background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.5)',
        color: 'white', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <X size={22} />
      </button>

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%', maxWidth: '500px' }}
      >
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={18} color="#d946ef" fill="#d946ef" />
          <h2 style={{ color: 'white', fontWeight: 900, fontSize: '1.2rem', margin: 0 }}>DigiSpherix Invaders</h2>
        </div>

        {/* HUD */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', fontSize: '0.82rem', fontWeight: 700 }}>
          <span style={{ color: '#c4b5fd' }}>SCORE: <span style={{ color: '#d946ef' }}>{score}</span></span>
          <span style={{ fontSize: '1.2rem', letterSpacing: '5px' }}>
            {hearts.map((h, i) => (
              <span key={i} style={{ color: h === '♥' ? '#f472b6' : '#2d1f4e' }}>{h}</span>
            ))}
          </span>
          <span style={{ color: '#9d8fc2', fontSize: '0.72rem' }}>{diffLabel}</span>
        </div>

        {/* Canvas */}
        <div style={{
          width: '100%', maxWidth: W, height: H,
          background: 'rgba(12,9,35,0.95)',
          border: `1px solid ${respawning ? 'rgba(239,68,68,0.4)' : 'rgba(124,58,237,0.4)'}`,
          borderRadius: '16px', position: 'relative', overflow: 'hidden',
          transition: 'border-color 0.3s',
        }}>
          {/* Stars */}
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${(i * 41) % 100}%`, top: `${(i * 57) % 100}%`,
              width: i % 4 === 0 ? '2px' : '1px', height: i % 4 === 0 ? '2px' : '1px',
              borderRadius: '50%', background: 'white', opacity: 0.12 + (i % 5) * 0.06,
            }} />
          ))}

          {/* Idle */}
          {gameState === 'idle' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '24px' }}>
              <div style={{ fontSize: '2.5rem' }}>🎮</div>
              <p style={{ color: '#c4b5fd', fontSize: '0.88rem', textAlign: 'center', lineHeight: 1.8, margin: 0 }}>
                ¡Encontraste el Easter Egg!<br />
                <span style={{ color: '#9d8fc2', fontSize: '0.76rem' }}>
                  {IS_TOUCH ? 'Usa los botones ◀ 🔥 ▶ para jugar' : '← → mover · Espacio disparar'}
                </span>
              </p>
              <button onClick={startGame} className="btn-primary">Iniciar Juego</button>
            </div>
          )}

          {/* Win */}
          {gameState === 'win' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{ fontSize: '2.5rem' }}>🏆</div>
              <p style={{ color: '#d946ef', fontWeight: 900, fontSize: '1.2rem', margin: 0 }}>¡Ganaste!</p>
              <p style={{ color: '#9d8fc2', fontSize: '0.82rem', margin: 0 }}>Score: <strong style={{ color: 'white' }}>{score}</strong></p>
              <button onClick={startGame} className="btn-primary">Jugar de nuevo</button>
            </div>
          )}

          {/* Lose */}
          {gameState === 'lose' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{ fontSize: '2.5rem' }}>💀</div>
              <p style={{ color: '#ef4444', fontWeight: 900, fontSize: '1.2rem', margin: 0 }}>Game Over</p>
              <p style={{ color: '#9d8fc2', fontSize: '0.82rem', margin: 0 }}>Score: <strong style={{ color: 'white' }}>{score}</strong></p>
              <button onClick={startGame} className="btn-primary">Intentar de nuevo</button>
            </div>
          )}

          {/* Enemies */}
          {enRef.current.filter(e => e.alive).map(e => (
            <div key={e.id} style={{
              position: 'absolute', left: e.x + exRef.current, top: e.y,
              fontSize: '20px', lineHeight: 1, pointerEvents: 'none',
            }}>👾</div>
          ))}

          {/* Player bullets */}
          {bulletsRef.current.map(b => (
            <div key={b.id} style={{
              position: 'absolute', left: b.x, top: b.y,
              width: '4px', height: '14px', borderRadius: '2px',
              background: 'linear-gradient(180deg, #d946ef, #7c3aed)',
              boxShadow: '0 0 6px #d946ef', pointerEvents: 'none',
            }} />
          ))}

          {/* Enemy bullets */}
          {ebRef.current.map(b => (
            <div key={b.id} style={{
              position: 'absolute', left: b.x, top: b.y,
              width: '4px', height: '10px', borderRadius: '2px',
              background: '#ef4444', boxShadow: '0 0 5px #ef4444', pointerEvents: 'none',
            }} />
          ))}

          {/* Explosion */}
          <AnimatePresence>
            {explosion && (
              <motion.div
                key="exp"
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2.8, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
                style={{
                  position: 'absolute', left: explosion.x - 20, top: explosion.y - 20,
                  fontSize: '36px', pointerEvents: 'none',
                }}
              >💥</motion.div>
            )}
          </AnimatePresence>

          {/* Player ship */}
          {gameState === 'playing' && !respawning && (
            <div style={{
              position: 'absolute', left: pxRef.current, top: H - 66,
              width: PLAYER_W, fontSize: '30px', textAlign: 'center',
              filter: 'drop-shadow(0 0 8px #7c3aed)', pointerEvents: 'none',
            }}>🚀</div>
          )}

          {/* Ground */}
          <div style={{ position: 'absolute', bottom: '28px', left: 0, right: 0, height: '1px', background: 'rgba(124,58,237,0.18)' }} />
        </div>

        {/* Touch controls */}
        <div style={{ display: 'flex', gap: '14px' }}>
          {[{ label: '◀', key: 'ArrowLeft' }, { label: '🔥', key: ' ' }, { label: '▶', key: 'ArrowRight' }].map(btn => (
            <button
              key={btn.key}
              onPointerDown={() => { keysRef.current[btn.key] = true }}
              onPointerUp={() => { keysRef.current[btn.key] = false }}
              onPointerLeave={() => { keysRef.current[btn.key] = false }}
              style={{
                width: '64px', height: '64px', borderRadius: '14px',
                background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.5)',
                color: 'white', fontSize: '1.4rem', cursor: 'pointer',
                userSelect: 'none', touchAction: 'none',
              }}
            >{btn.label}</button>
          ))}
        </div>

        <p style={{ color: '#3d2f6e', fontSize: '0.68rem', margin: 0 }}>
          {IS_TOUCH ? 'Toca ◀ ▶ para mover · 🔥 para disparar' : 'Teclado: ← → mover · Espacio disparar'}
        </p>
      </motion.div>
    </div>
  )
}
