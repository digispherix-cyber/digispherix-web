'use client'

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
const COUNT = isMobile ? 0 : 60

const DOTS = Array.from({ length: COUNT }, (_, i) => ({
  id: i,
  x: (i * 31 + 7) % 100,
  size: ((i * 5) % 4) + 1,
  delay: (i * 0.29) % 8,
  duration: ((i * 9) % 16) + 10,
  opacity: ((i * 3) % 6) * 0.08 + 0.18,
  color: i % 4 === 0 ? '#d946ef' : i % 4 === 1 ? '#a855f7' : i % 4 === 2 ? '#7c3aed' : '#e879f9',
}))

export default function Particles() {
  if (COUNT === 0) return null
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}
      aria-hidden="true"
    >
      {DOTS.map((d) => (
        <div
          key={d.id}
          style={{
            position: 'absolute',
            left: `${d.x}%`,
            bottom: '-8px',
            width: `${d.size}px`,
            height: `${d.size}px`,
            borderRadius: '50%',
            backgroundColor: d.color,
            opacity: d.opacity,
            animation: `float-up ${d.duration}s ${d.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  )
}

