import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)

  const mx = useMotionValue(-100)
  const my = useMotionValue(-100)

  const sx = useSpring(mx, { stiffness: 150, damping: 18, mass: 0.5 })
  const sy = useSpring(my, { stiffness: 150, damping: 18, mass: 0.5 })

  const trailX = useSpring(mx, { stiffness: 60, damping: 16, mass: 0.8 })
  const trailY = useSpring(my, { stiffness: 60, damping: 16, mass: 0.8 })

  useEffect(() => {
    const move = (e) => {
      mx.set(e.clientX)
      my.set(e.clientY)
      setVisible(true)
    }
    const enter = () => setVisible(true)
    const leave = () => setVisible(false)
    const down  = () => setClicking(true)
    const up    = () => setClicking(false)

    const checkHover = (e) => {
      const el = e.target
      setHovering(
        el.closest('a, button, [role="button"]') !== null
      )
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mousemove', checkHover)
    window.addEventListener('mouseenter', enter)
    window.addEventListener('mouseleave', leave)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousemove', checkHover)
      window.removeEventListener('mouseenter', enter)
      window.removeEventListener('mouseleave', leave)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
    }
  }, [mx, my])

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null

  return (
    <>
      {/* Trail glow */}
      <motion.div
        style={{
          x: trailX, y: trailY,
          position: 'fixed', top: 0, left: 0, zIndex: 9998,
          width: hovering ? '48px' : '32px',
          height: hovering ? '48px' : '32px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217,70,239,0.25), transparent)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          opacity: visible ? 1 : 0,
          transition: 'width 0.2s, height 0.2s, opacity 0.3s',
          filter: 'blur(8px)',
        }}
      />

      {/* Main dot */}
      <motion.div
        style={{
          x: sx, y: sy,
          position: 'fixed', top: 0, left: 0, zIndex: 999999,
          width: clicking ? '6px' : hovering ? '14px' : '10px',
          height: clicking ? '6px' : hovering ? '14px' : '10px',
          borderRadius: '50%',
          background: hovering
            ? 'linear-gradient(135deg, #7c3aed, #d946ef)'
            : 'rgba(217,70,239,0.9)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          opacity: visible ? 1 : 0,
          transition: 'width 0.15s, height 0.15s, opacity 0.3s, background 0.2s',
          boxShadow: '0 0 12px rgba(217,70,239,0.6)',
        }}
      />
    </>
  )
}
