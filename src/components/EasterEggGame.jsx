import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap } from 'lucide-react'

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

const W = 460
const H = 460
const PLAYER_W = 44
const BULLET_SPEED = 7
const ENEMY_ROWS = 3
const ENEMY_COLS = 7
const MAX_LIVES = 3

// Difficulty tiers based on score
function getDifficulty(score) {
  if (score < 60)  return { shootInterval: 4500, enemySpeed: 0.4, label: 'Fácil' }
  if (score < 150) return { shootInterval: 3200, enemySpeed: 0.65, label: 'Normal' }
  if (score < 280) return { shootInterval: 2200, enemySpeed: 0.9, label: 'Difícil' }
  return             { shootInterval: 1400, enemySpeed: 1.3, label: '🔥 Experto' }
}

function createEnemies() {
  const enemies = []
  for (let r = 0; r < ENEMY_ROWS; r++) {
    for (let c = 0; c < ENEMY_COLS; c++) {
      enemies.push({ id: `${r}-${c}`, x: 20 + c * 60, y: 48 + r * 44, alive: true })
    }
  }
  return enemies
}

export const easterEggTrigger = { open: null }

export default function EasterEggGame() {
  const [open, setOpen]           = useState(false)
  const [combo, setCombo]         = useState([])
  const [gameState, setGameState] = useState('idle')
  const [playerX, setPlayerX]     = useState(W / 2 - PLAYER_W / 2)
  const [bullets, setBullets]     = useState([])
  const [enemyBullets, setEnemyBullets] = useState([])
  const [enemies, setEnemies]     = useState(createEnemies())
  const [score, setScore]         = useState(0)
  const [lives, setLives]         = useState(MAX_LIVES)
  const [enemyDir, setEnemyDir]   = useState(1)
  const [enemyX, setEnemyX]       = useState(0)
  const [diffLabel, setDiffLabel] = useState('Fácil')

  const keysRef    = useRef({})
  const frameRef   = useRef(null)
  const scoreRef   = useRef(0)   // always in sync for game loop

  useEffect(() => { easterEggTrigger.open = () => setOpen(true); return () => { easterEggTrigger.open = null } }, [])

  // Konami (desktop)
  useEffect(() => {
    const onKey = (e) => {
      setCombo(prev => {
        const next = [...prev, e.key].slice(-KONAMI.length)
        if (next.join(',') === KONAMI.join(',')) { setOpen(true); return [] }
        return next
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const startGame = useCallback(() => {
    scoreRef.current = 0
    setGameState('playing')
    setPlayerX(W / 2 - PLAYER_W / 2)
    setBullets([])
    setEnemyBullets([])
    setEnemies(createEnemies())
    setScore(0)
    setLives(MAX_LIVES)
    setEnemyDir(1)
    setEnemyX(0)
    setDiffLabel('Fácil')
  }, [])

  const close = () => {
    setOpen(false)
    setGameState('idle')
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
  }

  // Keyboard while playing
  useEffect(() => {
    if (!open || gameState !== 'playing') return
    const down = (e) => { keysRef.current[e.key] = true; if (e.key === ' ') e.preventDefault() }
    const up   = (e) => { keysRef.current[e.key] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [open, gameState])

  // Game loop
  useEffect(() => {
    if (!open || gameState !== 'playing') return

    let lastShot = 0
    let lastEnemyShot = 0

    const loop = (ts) => {
      const diff = getDifficulty(scoreRef.current)
      setDiffLabel(diff.label)

      setPlayerX(prev => {
        let x = prev
        if (keysRef.current['ArrowLeft']  || keysRef.current['a']) x = Math.max(0, x - 4)
        if (keysRef.current['ArrowRight'] || keysRef.current['d']) x = Math.min(W - PLAYER_W, x + 4)
        return x
      })

      // Player shoot
      if ((keysRef.current[' '] || keysRef.current['ArrowUp']) && ts - lastShot > 320) {
        lastShot = ts
        setBullets(prev => [...prev, { id: ts + Math.random(), x: playerX + PLAYER_W / 2 - 2, y: H - 60 }])
      }

      setBullets(prev => prev.map(b => ({ ...b, y: b.y - BULLET_SPEED })).filter(b => b.y > 0))

      // Move enemies
      setEnemyX(prev => {
        const next = prev + enemyDir * diff.enemySpeed
        if (next > 28 || next < -28) setEnemyDir(d => -d)
        return next
      })

      // Enemy shoots
      if (ts - lastEnemyShot > diff.shootInterval) {
        lastEnemyShot = ts
        setEnemies(cur => {
          const alive = cur.filter(e => e.alive)
          if (alive.length > 0) {
            const s = alive[Math.floor(Math.random() * alive.length)]
            setEnemyBullets(prev => [...prev, { id: ts + Math.random(), x: s.x + enemyX + 12, y: s.y + 28 }])
          }
          return cur
        })
      }

      setEnemyBullets(prev => prev.map(b => ({ ...b, y: b.y + 3.2 })).filter(b => b.y < H))

      // Bullet vs enemy collision
      setBullets(curBullets => {
        setEnemies(curEnemies => {
          let gained = 0
          const updated = curEnemies.map(e => {
            if (!e.alive) return e
            const hit = curBullets.some(b =>
              b.x > e.x + enemyX - 6 && b.x < e.x + enemyX + 28 &&
              b.y > e.y && b.y < e.y + 28
            )
            if (hit) { gained += 10; return { ...e, alive: false } }
            return e
          })
          if (gained > 0) {
            scoreRef.current += gained
            setScore(s => s + gained)
          }
          if (updated.every(e => !e.alive)) setGameState('win')
          return updated
        })
        return curBullets
      })

      // Enemy bullet vs player — lose life but keep score & difficulty
      setEnemyBullets(curEB => {
        const hitIdx = curEB.findIndex(b =>
          b.x > playerX && b.x < playerX + PLAYER_W &&
          b.y > H - 72 && b.y < H - 40
        )
        if (hitIdx !== -1) {
          setLives(l => {
            if (l - 1 <= 0) { setGameState('lose'); return 0 }
            return l - 1
          })
          return curEB.filter((_, i) => i !== hitIdx)
        }
        return curEB
      })

      frameRef.current = requestAnimationFrame(loop)
    }

    frameRef.current = requestAnimationFrame(loop)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [open, gameState, playerX, enemyDir, enemyX])

  if (!open) return null

  const hearts = Array.from({ length: MAX_LIVES }, (_, i) => i < lives ? '♥' : '♡')

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99998,
      background: 'rgba(5,3,20,0.97)', backdropFilter: 'blur(10px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflowY: 'auto', padding: '16px',
    }}>
      {/* Close button */}
      <button
        onClick={close}
        style={{
          position: 'fixed', top: '16px', right: '16px',
          width: '44px', height: '44px', borderRadius: '12px',
          background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.5)',
          color: 'white', cursor: 'pointer', zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
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
          <span style={{ color: '#c4b5fd' }}>
            SCORE: <span style={{ color: '#d946ef' }}>{score}</span>
          </span>
          <span style={{ fontSize: '1.1rem', letterSpacing: '4px' }}>
            {hearts.map((h, i) => (
              <span key={i} style={{ color: h === '♥' ? '#f472b6' : '#3d2f6e' }}>{h}</span>
            ))}
          </span>
          <span style={{ color: '#9d8fc2', fontSize: '0.72rem' }}>{diffLabel}</span>
        </div>

        {/* Game canvas */}
        <div style={{
          width: '100%', maxWidth: W, height: H,
          background: 'rgba(12,9,35,0.95)',
          border: '1px solid rgba(124,58,237,0.4)',
          borderRadius: '16px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Stars */}
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${(i * 41) % 100}%`, top: `${(i * 57) % 100}%`,
              width: i % 4 === 0 ? '2px' : '1px', height: i % 4 === 0 ? '2px' : '1px',
              borderRadius: '50%', background: 'white', opacity: 0.15 + (i % 5) * 0.07,
            }} />
          ))}

          {/* Idle screen */}
          {gameState === 'idle' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '24px' }}>
              <div style={{ fontSize: '2.5rem' }}>🎮</div>
              <p style={{ color: '#c4b5fd', fontSize: '0.88rem', textAlign: 'center', lineHeight: 1.8, margin: 0 }}>
                ¡Encontraste el Easter Egg!<br />
                <span style={{ color: '#9d8fc2', fontSize: '0.76rem' }}>← → mover · Espacio disparar · La dificultad sube con el score</span>
              </p>
              <button onClick={startGame} className="btn-primary">Iniciar Juego</button>
            </div>
          )}

          {/* Win */}
          {gameState === 'win' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{ fontSize: '2.5rem' }}>🏆</div>
              <p style={{ color: '#d946ef', fontWeight: 900, fontSize: '1.2rem', margin: 0 }}>¡Ganaste!</p>
              <p style={{ color: '#9d8fc2', fontSize: '0.82rem', margin: 0 }}>Score final: <strong style={{ color: 'white' }}>{score}</strong></p>
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
          {enemies.filter(e => e.alive).map(e => (
            <div key={e.id} style={{
              position: 'absolute', left: e.x + enemyX, top: e.y,
              fontSize: '20px', lineHeight: 1,
            }}>👾</div>
          ))}

          {/* Player bullets */}
          {bullets.map(b => (
            <div key={b.id} style={{
              position: 'absolute', left: b.x, top: b.y,
              width: '4px', height: '14px', borderRadius: '2px',
              background: 'linear-gradient(180deg, #d946ef, #7c3aed)',
              boxShadow: '0 0 6px #d946ef',
            }} />
          ))}

          {/* Enemy bullets */}
          {enemyBullets.map(b => (
            <div key={b.id} style={{
              position: 'absolute', left: b.x, top: b.y,
              width: '4px', height: '10px', borderRadius: '2px',
              background: '#ef4444', boxShadow: '0 0 5px #ef4444',
            }} />
          ))}

          {/* Player */}
          {gameState === 'playing' && (
            <div style={{
              position: 'absolute', left: playerX, top: H - 66,
              width: PLAYER_W, fontSize: '30px', textAlign: 'center',
              filter: 'drop-shadow(0 0 8px #7c3aed)',
            }}>🚀</div>
          )}

          {/* Ground */}
          <div style={{ position: 'absolute', bottom: '28px', left: 0, right: 0, height: '1px', background: 'rgba(124,58,237,0.2)' }} />
        </div>

        {/* Mobile controls */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {[
            { label: '◀', key: 'ArrowLeft' },
            { label: '🔥', key: ' ' },
            { label: '▶', key: 'ArrowRight' },
          ].map(btn => (
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
            >
              {btn.label}
            </button>
          ))}
        </div>
        <p style={{ color: '#3d2f6e', fontSize: '0.68rem', margin: 0 }}>Teclado: ← → mover · Espacio disparar</p>
      </motion.div>
    </div>
  )
}
