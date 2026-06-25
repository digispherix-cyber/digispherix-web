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

// Dificultad definida por oleada — interval(ms entre disparos), shooters(cuántos disparan), bSpeed(vel bala), eSpeed(vel enemigos)
const WAVES = [
  { rows: 3, cols: 7, gap: 58, pts: 10, emoji: '👾', name: 'Oleada 1',       interval: 7000, shooters: 1, bSpeed: 2.0, eSpeed: 0.22, label: '😊 Muy Fácil'  },
  { rows: 3, cols: 8, gap: 52, pts: 12, emoji: '👾', name: 'Oleada 2',       interval: 5800, shooters: 1, bSpeed: 2.6, eSpeed: 0.32, label: '🙂 Fácil'       },
  { rows: 4, cols: 7, gap: 58, pts: 15, emoji: '🛸', name: 'Oleada 3',       interval: 4800, shooters: 2, bSpeed: 3.1, eSpeed: 0.42, label: '😐 Normal'      },
  { rows: 4, cols: 8, gap: 52, pts: 18, emoji: '🛸', name: 'Oleada 4',       interval: 3900, shooters: 2, bSpeed: 3.7, eSpeed: 0.54, label: '😬 Normal+'     },
  { rows: 5, cols: 7, gap: 58, pts: 20, emoji: '👽', name: 'Oleada 5',       interval: 3100, shooters: 3, bSpeed: 4.3, eSpeed: 0.68, label: '😤 Difícil'     },
  { rows: 5, cols: 8, gap: 52, pts: 22, emoji: '👽', name: 'Oleada 6',       interval: 2500, shooters: 3, bSpeed: 5.0, eSpeed: 0.85, label: '😰 Difícil+'    },
  { rows: 4, cols: 9, gap: 46, pts: 28, emoji: '💀', name: 'Oleada 7',       interval: 1900, shooters: 4, bSpeed: 5.8, eSpeed: 1.05, label: '💀 Peligroso'   },
  { rows: 5, cols: 9, gap: 46, pts: 35, emoji: '💀', name: '🔥 Oleada FINAL', interval: 1400, shooters: 5, bSpeed: 7.0, eSpeed: 1.35, label: '🔥 EXPERTO'    },
]

function mkEnemies(waveIdx) {
  const w = WAVES[waveIdx]
  const out = []
  const startX = Math.max(8, (W - w.cols * w.gap) / 2)
  for (let r = 0; r < w.rows; r++)
    for (let c = 0; c < w.cols; c++)
      out.push({ id: `${r}-${c}`, x: startX + c * w.gap, y: 44 + r * 40, alive: true })
  return out
}

export const easterEggTrigger = { open: null }

export default function EasterEggGame() {
  // UI state
  const [open, setOpen]             = useState(false)
  const [gameState, setGameState]   = useState('idle') // idle | playing | nextwave | win | lose
  const [wave, setWave]             = useState(0)
  const [score, setScore]           = useState(0)
  const [lives, setLives]           = useState(MAX_LIVES)
  const [diffLabel, setDiffLabel]   = useState('Fácil')
  const [explosion, setExplosion]   = useState(null)
  const [respawning, setRespawning] = useState(false)
  const [countdown, setCountdown]   = useState(3)
  const [, forceRender]             = useState(0)
  const [scale, setScale]           = useState(1)

  // Game refs
  const pxRef          = useRef(W / 2 - PLAYER_W / 2)
  const exRef          = useRef(0)
  const edirRef        = useRef(1)
  const bulletsRef     = useRef([])
  const ebRef          = useRef([])
  const enRef          = useRef(mkEnemies(0))
  const scoreRef       = useRef(0)
  const livesRef       = useRef(MAX_LIVES)
  const waveRef        = useRef(0)
  const invRef         = useRef(false)
  const lastShotRef    = useRef(-9999)
  const lastEshotRef   = useRef(-9999)
  const keysRef        = useRef({})
  const frameRef       = useRef(null)
  const gameStateRef   = useRef('idle')

  useEffect(() => { gameStateRef.current = gameState }, [gameState])

  // Scale canvas to fit mobile screens
  useEffect(() => {
    const update = () => setScale(Math.min(1, (window.innerWidth - 24) / W))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Easter egg trigger
  useEffect(() => {
    easterEggTrigger.open = () => setOpen(true)
    return () => { easterEggTrigger.open = null }
  }, [])

  // Konami code
  useEffect(() => {
    let combo = []
    const onKey = (e) => {
      combo = [...combo, e.key].slice(-KONAMI.length)
      if (combo.join(',') === KONAMI.join(',')) { setOpen(true); combo = [] }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Block scroll keys while open
  useEffect(() => {
    if (!open) return
    const block = (e) => {
      if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key))
        e.preventDefault()
    }
    window.addEventListener('keydown', block, { passive: false })
    return () => window.removeEventListener('keydown', block)
  }, [open])

  // Keyboard
  useEffect(() => {
    if (!open) return
    const down = (e) => { keysRef.current[e.key] = true }
    const up   = (e) => { keysRef.current[e.key] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [open])

  // Start game
  const startGame = useCallback(() => {
    pxRef.current      = W / 2 - PLAYER_W / 2
    exRef.current      = 0
    edirRef.current    = 1
    bulletsRef.current = []
    ebRef.current      = []
    enRef.current      = mkEnemies(0)
    scoreRef.current   = 0
    livesRef.current   = MAX_LIVES
    waveRef.current    = 0
    invRef.current     = false
    lastShotRef.current  = -9999
    lastEshotRef.current = -9999
    setScore(0); setLives(MAX_LIVES); setWave(0)
    setDiffLabel('Fácil'); setExplosion(null); setRespawning(false)
    setGameState('playing')
  }, [])

  // Spawn next wave with countdown
  const spawnNextWave = useCallback((nextWave) => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    setGameState('nextwave')
    setWave(nextWave)
    waveRef.current = nextWave
    let cd = 3
    setCountdown(cd)
    const tick = setInterval(() => {
      cd -= 1
      setCountdown(cd)
      if (cd <= 0) {
        clearInterval(tick)
        exRef.current      = 0
        edirRef.current    = 1
        bulletsRef.current = []
        ebRef.current      = []
        enRef.current      = mkEnemies(nextWave)
        invRef.current     = false
        lastEshotRef.current = performance.now() + 1500  // grace period
        setGameState('playing')
      }
    }, 1000)
  }, [])

  const close = useCallback(() => {
    setOpen(false); setGameState('idle')
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
  }, [])

  // Hit handler
  const handleHit = useCallback((px) => {
    if (invRef.current) return
    invRef.current = true
    ebRef.current = []
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
        lastEshotRef.current = performance.now() + 2000
      }, INVINCIBLE_MS)
    }
  }, [])

  // Game loop — stable
  useEffect(() => {
    if (!open || gameState !== 'playing') return

    const loop = (ts) => {
      if (gameStateRef.current !== 'playing') return

      const diff = WAVES[waveRef.current] ?? WAVES[WAVES.length - 1]
      setDiffLabel(diff.label)

      // Move player
      if (keysRef.current['ArrowLeft']  || keysRef.current['a']) pxRef.current = Math.max(0, pxRef.current - 4)
      if (keysRef.current['ArrowRight'] || keysRef.current['d']) pxRef.current = Math.min(W - PLAYER_W, pxRef.current + 4)

      // Player shoot
      if (!invRef.current && (keysRef.current[' '] || keysRef.current['ArrowUp']) && ts - lastShotRef.current > 300) {
        lastShotRef.current = ts
        bulletsRef.current = [...bulletsRef.current, { id: ts + Math.random(), x: pxRef.current + PLAYER_W / 2 - 2, y: H - 62 }]
      }
      bulletsRef.current = bulletsRef.current.map(b => ({ ...b, y: b.y - 7 })).filter(b => b.y > 0)

      // Move enemies
      exRef.current += edirRef.current * diff.eSpeed
      if (exRef.current > 28 || exRef.current < -28) edirRef.current *= -1

      // Enemy shoot — N random shooters per wave
      if (!invRef.current && ts - lastEshotRef.current > diff.interval) {
        lastEshotRef.current = ts
        const alive = enRef.current.filter(e => e.alive)
        const firing = [...alive].sort(() => Math.random() - 0.5).slice(0, Math.min(diff.shooters, alive.length))
        ebRef.current = [
          ...ebRef.current,
          ...firing.map(s => ({ id: ts + Math.random(), x: s.x + exRef.current + 12, y: s.y + 28, spd: diff.bSpeed }))
        ]
      }
      ebRef.current = ebRef.current.map(b => ({ ...b, y: b.y + b.spd })).filter(b => b.y < H)

      // Bullet vs enemy
      const hitIds = new Set()
      const waveData = WAVES[waveRef.current]
      enRef.current = enRef.current.map(e => {
        if (!e.alive) return e
        const hit = bulletsRef.current.find(b =>
          b.x > e.x + exRef.current - 6 && b.x < e.x + exRef.current + 28 &&
          b.y > e.y && b.y < e.y + 28
        )
        if (hit) { hitIds.add(hit.id); scoreRef.current += waveData.pts; setScore(scoreRef.current); return { ...e, alive: false } }
        return e
      })
      if (hitIds.size) bulletsRef.current = bulletsRef.current.filter(b => !hitIds.has(b.id))

      // Check wave/game clear
      if (enRef.current.every(e => !e.alive)) {
        const next = waveRef.current + 1
        if (next >= WAVES.length) {
          setGameState('win')
        } else {
          spawnNextWave(next)
        }
        return
      }

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
  }, [open, gameState, handleHit, spawnNextWave])

  if (!open) return null

  const hearts = Array.from({ length: MAX_LIVES }, (_, i) => i < lives ? '♥' : '♡')
  const currentWaveData = WAVES[wave] ?? WAVES[WAVES.length - 1]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99998,
      background: 'rgba(5,3,20,0.97)', backdropFilter: 'blur(10px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', overflow: 'hidden', padding: '16px',
    }}>
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
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '0.8rem', fontWeight: 700, flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ color: '#c4b5fd' }}>SCORE: <span style={{ color: '#d946ef' }}>{score}</span></span>
          <span style={{ fontSize: '1.15rem', letterSpacing: '5px' }}>
            {hearts.map((h, i) => <span key={i} style={{ color: h === '♥' ? '#f472b6' : '#2d1f4e' }}>{h}</span>)}
          </span>
          <span style={{ color: '#7c3aed', fontWeight: 700, fontSize: '0.75rem' }}>{currentWaveData.name}</span>
          <span style={{ color: '#9d8fc2', fontSize: '0.7rem' }}>{diffLabel}</span>
        </div>

        {/* Canvas — wrapper shrinks height to match scaled content */}
        <div style={{ width: W * scale, height: H * scale, flexShrink: 0 }}>
        <div style={{
          width: W, height: H,
          background: 'rgba(12,9,35,0.95)',
          border: `1px solid ${respawning ? 'rgba(239,68,68,0.4)' : 'rgba(124,58,237,0.4)'}`,
          borderRadius: '16px', position: 'relative', overflow: 'hidden',
          transition: 'border-color 0.3s',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
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
                  {IS_TOUCH ? 'Usa los botones ◀ 🔥 ▶' : '← → mover · Espacio disparar'}<br />
                  <span style={{ color: '#5b4a8a' }}>8 oleadas · 👾→🛸→👽→💀</span>
                </span>
              </p>
              <button onClick={startGame} className="btn-primary">Iniciar Juego</button>
            </div>
          )}

          {/* Next wave transition */}
          {gameState === 'nextwave' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
            >
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{ fontSize: '2.2rem' }}
              >⭐</motion.div>
              <p style={{ color: '#d946ef', fontWeight: 900, fontSize: '1.15rem', margin: 0 }}>¡Oleada completada!</p>
              <p style={{ color: '#c4b5fd', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{WAVES[wave]?.name ?? ''}</p>
              <motion.p
                key={countdown}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ color: '#7c3aed', fontSize: '2rem', fontWeight: 900, margin: 0 }}
              >{countdown}</motion.p>
            </motion.div>
          )}

          {/* Win */}
          {gameState === 'win' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{ fontSize: '2.5rem' }}>🏆</div>
              <p style={{ color: '#d946ef', fontWeight: 900, fontSize: '1.2rem', margin: 0 }}>¡Leyenda del Espacio!</p>
              <p style={{ color: '#9d8fc2', fontSize: '0.82rem', margin: 0 }}>Score final: <strong style={{ color: 'white' }}>{score}</strong></p>
              <p style={{ color: '#7c3aed', fontSize: '0.75rem', margin: 0 }}>Completaste las 8 oleadas 🔥</p>
              <button onClick={startGame} className="btn-primary">Jugar de nuevo</button>
            </div>
          )}

          {/* Lose */}
          {gameState === 'lose' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{ fontSize: '2.5rem' }}>💀</div>
              <p style={{ color: '#ef4444', fontWeight: 900, fontSize: '1.2rem', margin: 0 }}>Game Over</p>
              <p style={{ color: '#9d8fc2', fontSize: '0.82rem', margin: 0 }}>Score: <strong style={{ color: 'white' }}>{score}</strong> · {WAVES[wave]?.name}</p>
              <button onClick={startGame} className="btn-primary">Intentar de nuevo</button>
            </div>
          )}

          {/* Enemies */}
          {(gameState === 'playing' || gameState === 'nextwave') && enRef.current.filter(e => e.alive).map(e => (
            <div key={e.id} style={{
              position: 'absolute', left: e.x + exRef.current, top: e.y,
              fontSize: '19px', lineHeight: 1, pointerEvents: 'none',
            }}>{currentWaveData.emoji}</div>
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
              <motion.div key="exp"
                initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 2.8, opacity: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
                style={{ position: 'absolute', left: explosion.x - 20, top: explosion.y - 20, fontSize: '36px', pointerEvents: 'none' }}
              >💥</motion.div>
            )}
          </AnimatePresence>

          {/* Player */}
          {gameState === 'playing' && !respawning && (
            <div style={{
              position: 'absolute', left: pxRef.current, top: H - 66,
              width: PLAYER_W, fontSize: '30px', textAlign: 'center',
              filter: 'drop-shadow(0 0 8px #7c3aed)', pointerEvents: 'none',
            }}>🚀</div>
          )}

          <div style={{ position: 'absolute', bottom: '28px', left: 0, right: 0, height: '1px', background: 'rgba(124,58,237,0.18)' }} />
        </div>
        </div>{/* end scale wrapper */}

        {/* Touch controls */}
        <div style={{ display: 'flex', gap: '14px' }}>
          {[{ label: '◀', key: 'ArrowLeft' }, { label: '🔥', key: ' ' }, { label: '▶', key: 'ArrowRight' }].map(btn => (
            <button key={btn.key}
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
