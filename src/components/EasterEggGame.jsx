import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap } from 'lucide-react'

// Konami code sequence
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

const W = 480
const H = 500
const PLAYER_W = 48
const PLAYER_H = 20
const BULLET_SPEED = 7
const ENEMY_ROWS = 3
const ENEMY_COLS = 8

function createEnemies() {
  const enemies = []
  for (let r = 0; r < ENEMY_ROWS; r++) {
    for (let c = 0; c < ENEMY_COLS; c++) {
      enemies.push({
        id: `${r}-${c}`,
        x: 40 + c * 52,
        y: 50 + r * 44,
        alive: true,
      })
    }
  }
  return enemies
}

export default function EasterEggGame() {
  const [open, setOpen] = useState(false)
  const [combo, setCombo] = useState([])
  const [gameState, setGameState] = useState('idle') // idle | playing | win | lose
  const [playerX, setPlayerX] = useState(W / 2 - PLAYER_W / 2)
  const [bullets, setBullets] = useState([])
  const [enemyBullets, setEnemyBullets] = useState([])
  const [enemies, setEnemies] = useState(createEnemies())
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [enemyDir, setEnemyDir] = useState(1)
  const [enemyX, setEnemyX] = useState(0)

  const keysRef = useRef({})
  const gameRef = useRef(null)
  const frameRef = useRef(null)
  const tickRef = useRef(0)

  // Konami code detector
  useEffect(() => {
    const onKey = (e) => {
      setCombo(prev => {
        const next = [...prev, e.key].slice(-KONAMI.length)
        if (next.join(',') === KONAMI.join(',')) {
          setOpen(true)
          return []
        }
        return next
      })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const startGame = useCallback(() => {
    setGameState('playing')
    setPlayerX(W / 2 - PLAYER_W / 2)
    setBullets([])
    setEnemyBullets([])
    setEnemies(createEnemies())
    setScore(0)
    setLives(3)
    setEnemyDir(1)
    setEnemyX(0)
    tickRef.current = 0
  }, [])

  const close = () => {
    setOpen(false)
    setGameState('idle')
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
  }

  // Keyboard input
  useEffect(() => {
    if (!open || gameState !== 'playing') return
    const down = (e) => { keysRef.current[e.key] = true }
    const up = (e) => { keysRef.current[e.key] = false }
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
      tickRef.current++
      const tick = tickRef.current

      setPlayerX(prev => {
        let x = prev
        if (keysRef.current['ArrowLeft'] || keysRef.current['a']) x = Math.max(0, x - 4)
        if (keysRef.current['ArrowRight'] || keysRef.current['d']) x = Math.min(W - PLAYER_W, x + 4)
        return x
      })

      // Player shoot
      if ((keysRef.current[' '] || keysRef.current['ArrowUp']) && ts - lastShot > 350) {
        lastShot = ts
        setBullets(prev => [...prev, { id: ts, x: playerX + PLAYER_W / 2 - 2, y: H - 60 }])
      }

      // Move bullets
      setBullets(prev => prev
        .map(b => ({ ...b, y: b.y - BULLET_SPEED }))
        .filter(b => b.y > 0)
      )

      // Move enemies
      setEnemyX(prev => {
        const next = prev + enemyDir * 0.6
        if (next > 30 || next < -30) setEnemyDir(d => -d)
        return next
      })

      // Enemy shoot every ~2s
      if (ts - lastEnemyShot > 2000) {
        lastEnemyShot = ts
        setEnemies(currentEnemies => {
          const alive = currentEnemies.filter(e => e.alive)
          if (alive.length > 0) {
            const shooter = alive[Math.floor(Math.random() * alive.length)]
            setEnemyBullets(prev => [...prev, {
              id: ts, x: shooter.x + enemyX + 14, y: shooter.y + 30
            }])
          }
          return currentEnemies
        })
      }

      // Move enemy bullets
      setEnemyBullets(prev => prev
        .map(b => ({ ...b, y: b.y + 3.5 }))
        .filter(b => b.y < H)
      )

      // Check collisions: bullets vs enemies
      setBullets(currentBullets => {
        setEnemies(currentEnemies => {
          let newScore = 0
          const updatedEnemies = currentEnemies.map(e => {
            if (!e.alive) return e
            const hit = currentBullets.some(b =>
              b.x > e.x + enemyX - 8 && b.x < e.x + enemyX + 28 &&
              b.y > e.y && b.y < e.y + 28
            )
            if (hit) { newScore += 10; return { ...e, alive: false } }
            return e
          })
          if (newScore > 0) setScore(s => s + newScore)
          // Check win
          if (updatedEnemies.every(e => !e.alive)) setGameState('win')
          return updatedEnemies
        })
        return currentBullets
      })

      // Check enemy bullets vs player
      setEnemyBullets(currentEBullets => {
        const playerHit = currentEBullets.some(b =>
          b.x > playerX && b.x < playerX + PLAYER_W &&
          b.y > H - 72 && b.y < H - 40
        )
        if (playerHit) {
          setLives(l => {
            if (l - 1 <= 0) { setGameState('lose'); return 0 }
            return l - 1
          })
          return currentEBullets.filter(b => !(
            b.x > playerX && b.x < playerX + PLAYER_W &&
            b.y > H - 72 && b.y < H - 40
          ))
        }
        return currentEBullets
      })

      frameRef.current = requestAnimationFrame(loop)
    }

    frameRef.current = requestAnimationFrame(loop)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [open, gameState, playerX, enemyDir, enemyX])

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div
        key="egg-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 99998,
          background: 'rgba(5,3,20,0.97)', backdropFilter: 'blur(10px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <Zap size={20} color="#d946ef" fill="#d946ef" />
            <h2 style={{ color: 'white', fontWeight: 900, fontSize: '1.3rem', margin: 0 }}>DigiSpherix Invaders</h2>
            <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b5b95', marginLeft: '8px' }}>
              <X size={20} />
            </button>
          </div>

          {/* Score & lives */}
          <div style={{ display: 'flex', gap: '32px', fontSize: '0.82rem', color: '#c4b5fd', fontWeight: 600 }}>
            <span>SCORE: <span style={{ color: '#d946ef' }}>{score}</span></span>
            <span>VIDAS: <span style={{ color: '#7c3aed' }}>{'♥ '.repeat(lives)}</span></span>
          </div>

          {/* Canvas */}
          <div style={{
            width: W, height: H,
            background: 'rgba(12,9,35,0.9)',
            border: '1px solid rgba(124,58,237,0.4)',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Stars */}
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${(i * 37) % 100}%`,
                top: `${(i * 53) % 100}%`,
                width: i % 3 === 0 ? '2px' : '1px',
                height: i % 3 === 0 ? '2px' : '1px',
                borderRadius: '50%',
                background: 'white',
                opacity: 0.3 + (i % 5) * 0.1,
              }} />
            ))}

            {gameState === 'idle' && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <p style={{ color: '#c4b5fd', fontSize: '0.9rem', textAlign: 'center', lineHeight: 1.7 }}>
                  ¡Encontraste el Easter Egg! 🎮<br />
                  <span style={{ color: '#9d8fc2', fontSize: '0.8rem' }}>← → para mover · Espacio para disparar</span>
                </p>
                <button onClick={startGame} className="btn-primary">Iniciar Juego</button>
              </div>
            )}

            {gameState === 'win' && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <div style={{ fontSize: '2rem' }}>🏆</div>
                <p style={{ color: '#d946ef', fontWeight: 900, fontSize: '1.2rem' }}>¡Ganaste!</p>
                <p style={{ color: '#9d8fc2', fontSize: '0.85rem' }}>Score: {score}</p>
                <button onClick={startGame} className="btn-primary">Jugar de nuevo</button>
              </div>
            )}

            {gameState === 'lose' && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <div style={{ fontSize: '2rem' }}>💀</div>
                <p style={{ color: '#ef4444', fontWeight: 900, fontSize: '1.2rem' }}>Game Over</p>
                <p style={{ color: '#9d8fc2', fontSize: '0.85rem' }}>Score: {score}</p>
                <button onClick={startGame} className="btn-primary">Intentar de nuevo</button>
              </div>
            )}

            {/* Enemies */}
            {enemies.filter(e => e.alive).map(e => (
              <div key={e.id} style={{
                position: 'absolute',
                left: e.x + enemyX,
                top: e.y,
                width: '28px', height: '24px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px',
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
                background: '#ef4444',
                boxShadow: '0 0 6px #ef4444',
              }} />
            ))}

            {/* Player ship */}
            {gameState === 'playing' && (
              <div style={{
                position: 'absolute',
                left: playerX,
                top: H - 68,
                width: PLAYER_W,
                height: PLAYER_H,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '32px',
                filter: 'drop-shadow(0 0 8px #7c3aed)',
              }}>🚀</div>
            )}

            {/* Ground line */}
            <div style={{
              position: 'absolute', bottom: '32px', left: 0, right: 0,
              height: '1px', background: 'rgba(124,58,237,0.3)',
            }} />
          </div>

          {/* Mobile controls */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            {[
              { label: '◀', action: 'left' },
              { label: '🔥', action: 'shoot' },
              { label: '▶', action: 'right' },
            ].map(btn => (
              <button
                key={btn.action}
                onPointerDown={() => {
                  if (btn.action === 'left') keysRef.current['ArrowLeft'] = true
                  if (btn.action === 'right') keysRef.current['ArrowRight'] = true
                  if (btn.action === 'shoot') keysRef.current[' '] = true
                }}
                onPointerUp={() => {
                  keysRef.current['ArrowLeft'] = false
                  keysRef.current['ArrowRight'] = false
                  keysRef.current[' '] = false
                }}
                style={{
                  width: '56px', height: '56px', borderRadius: '14px',
                  background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)',
                  color: 'white', fontSize: '1.2rem', cursor: 'pointer',
                  userSelect: 'none', touchAction: 'none',
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
          <p style={{ color: '#4b3d6e', fontSize: '0.72rem', marginTop: '0' }}>
            Teclado: ← → para mover · Espacio para disparar
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
