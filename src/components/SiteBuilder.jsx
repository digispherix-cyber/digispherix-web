'use client'

import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  Layers, Users, ImageIcon, Star, Tag, Mail, X, ChevronUp, ChevronDown,
  RotateCcw, MessageCircle, Sparkles, Download, TrendingUp, Award, HelpCircle, Share2, Plus,
} from 'lucide-react'

const CANVAS_GAP = 14

const BLOCKS = [
  { id: 'hero', label: 'Portada', icon: Layers, color: '#7c3aed', desc: 'Tu logo y mensaje principal' },
  { id: 'about', label: 'Sobre Nosotros', icon: Users, color: '#d946ef', desc: 'Tu historia y qué te hace diferente' },
  { id: 'gallery', label: 'Galería', icon: ImageIcon, color: '#a855f7', desc: 'Tus productos o trabajos' },
  { id: 'testimonials', label: 'Testimonios', icon: Star, color: '#e879f9', desc: 'Opiniones de tus clientes' },
  { id: 'stats', label: 'Estadísticas', icon: TrendingUp, color: '#16a34a', desc: 'Números que respaldan tu marca' },
  { id: 'team', label: 'Equipo', icon: Award, color: '#0ea5e9', desc: 'Presenta a tu equipo' },
  { id: 'faq', label: 'Preguntas Frecuentes', icon: HelpCircle, color: '#f59e0b', desc: 'Resuelve dudas comunes' },
  { id: 'social', label: 'Redes Sociales', icon: Share2, color: '#ec4899', desc: 'Conecta tus redes' },
  { id: 'pricing', label: 'Precios', icon: Tag, color: '#7c3aed', desc: 'Tus planes o paquetes' },
  { id: 'contact', label: 'Contacto', icon: Mail, color: '#d946ef', desc: 'Para que te encuentren' },
  { id: 'custom', label: 'Módulo personalizado', icon: Plus, color: '#8b5cf6', desc: 'Agrega algo distinto y ponle nombre', customizable: true },
]

const byId = Object.fromEntries(BLOCKS.map((b) => [b.id, b]))

function PaletteCard({ block, count, onAdd }) {
  const Icon = block.icon
  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/block-id', block.id)}
      onClick={() => onAdd(block.id)}
      aria-label={`Agregar bloque ${block.label}`}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
        padding: '14px 16px', borderRadius: '14px', textAlign: 'left',
        background: 'var(--bg-card)', border: '1px solid var(--border)', cursor: 'grab',
      }}
    >
      <div style={{
        width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${block.color}20`, color: block.color,
      }}>
        <Icon size={18} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-strong)' }}>{block.label}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{block.desc}</div>
      </div>
      {count > 0 && (
        <span style={{
          flexShrink: 0, fontSize: '0.72rem', fontWeight: 700, color: block.color,
          background: `${block.color}18`, borderRadius: '99px', padding: '2px 8px',
        }}>
          ×{count}
        </span>
      )}
    </button>
  )
}

const bar = (color, w, h = '8px') => ({ height: h, width: w, borderRadius: '99px', background: color, flexShrink: 0 })

// Mini-mockup por tipo de bloque: cada sección se ve distinta y con varias
// columnas/tarjetas, no una sola barra genérica repetida.
function BlockPreview({ id, color }) {
  if (id === 'hero') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '18px 12px' }}>
        <div style={bar(`${color}50`, '38%')} />
        <div style={bar(`${color}90`, '68%', '14px')} />
        <div style={bar(`${color}35`, '52%')} />
        <div style={{ ...bar(color, '128px', '26px'), borderRadius: '99px', marginTop: '6px' }} />
      </div>
    )
  }
  if (id === 'about') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          <div style={bar(`${color}55`, '85%')} />
          <div style={bar(`${color}30`, '95%', '6px')} />
          <div style={bar(`${color}30`, '75%', '6px')} />
          <div style={bar(`${color}30`, '85%', '6px')} />
        </div>
        <div style={{ height: '64px', borderRadius: '12px', background: `${color}20`, border: `1px solid ${color}35` }} />
      </div>
    )
  }
  if (id === 'gallery') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ aspectRatio: '1', borderRadius: '10px', background: `${color}${i % 2 ? '22' : '3a'}` }} />
        ))}
      </div>
    )
  }
  if (id === 'testimonials') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{
            borderRadius: '12px', background: `${color}14`, border: `1px solid ${color}30`,
            padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px',
          }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: `${color}70`, flexShrink: 0 }} />
            <div style={bar(`${color}45`, '90%', '5px')} />
            <div style={bar(`${color}30`, '65%', '5px')} />
          </div>
        ))}
      </div>
    )
  }
  if (id === 'stats') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ ...bar(color, '44px', '20px'), borderRadius: '6px' }} />
            <div style={bar(`${color}35`, '75%', '5px')} />
          </div>
        ))}
      </div>
    )
  }
  if (id === 'team') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `${color}55` }} />
            <div style={bar(`${color}45`, '70%', '5px')} />
            <div style={bar(`${color}25`, '50%', '4px')} />
          </div>
        ))}
      </div>
    )
  }
  if (id === 'faq') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '9px 12px', borderRadius: '9px', background: `${color}12`, border: `1px solid ${color}28`,
          }}>
            <div style={bar(`${color}55`, '65%', '6px')} />
            <div style={{ width: '11px', height: '11px', borderRadius: '3px', background: `${color}55`, flexShrink: 0 }} />
          </div>
        ))}
      </div>
    )
  }
  if (id === 'social') {
    return (
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', padding: '8px 0' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ width: '30px', height: '30px', borderRadius: '50%', background: `${color}${['25', '35', '45', '35', '25'][i]}` }} />
        ))}
      </div>
    )
  }
  if (id === 'pricing') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            borderRadius: '12px', padding: '12px 8px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '7px',
            background: i === 1 ? `${color}30` : `${color}12`,
            border: i === 1 ? `1px solid ${color}` : `1px solid ${color}25`,
          }}>
            <div style={bar(`${color}60`, '55%', '6px')} />
            <div style={bar(color, '42%', '13px')} />
            <div style={bar(`${color}35`, '80%', '4px')} />
            <div style={bar(`${color}35`, '80%', '4px')} />
          </div>
        ))}
      </div>
    )
  }
  if (id === 'contact') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ height: '22px', borderRadius: '7px', background: `${color}16`, border: `1px solid ${color}30` }} />
          <div style={{ height: '22px', borderRadius: '7px', background: `${color}16`, border: `1px solid ${color}30` }} />
          <div style={{ height: '38px', borderRadius: '7px', background: `${color}16`, border: `1px solid ${color}30` }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', justifyContent: 'center' }}>
          <div style={bar(`${color}45`, '70%', '6px')} />
          <div style={bar(`${color}45`, '55%', '6px')} />
          <div style={{ ...bar(color, '96px', '26px'), borderRadius: '99px', marginTop: '4px' }} />
        </div>
      </div>
    )
  }
  // custom / genérico
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
      <div style={bar(`${color}45`, '55%', '7px')} />
      <div style={bar(`${color}30`, '75%', '6px')} />
      <div style={bar(`${color}30`, '40%', '6px')} />
    </div>
  )
}

const ctrlBtnStyle = {
  width: '26px', height: '26px', borderRadius: '7px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'var(--bg-card-alt)', border: '1px solid var(--border)',
  color: 'var(--text-muted)', cursor: 'pointer',
}

function ResizeHandle({ span, gridRef, onResize }) {
  const startRef = useRef(null)

  const onPointerDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const gridEl = gridRef.current
    if (!gridEl) return
    const colWidth = (gridEl.getBoundingClientRect().width - CANVAS_GAP * 3) / 4
    startRef.current = { x: e.clientX, span }
    document.body.style.userSelect = 'none'

    const onMove = (ev) => {
      const dx = ev.clientX - startRef.current.x
      const deltaCols = Math.round(dx / (colWidth + CANVAS_GAP))
      onResize(Math.min(4, Math.max(1, startRef.current.span + deltaCols)))
    }
    const onUp = () => {
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const [hover, setHover] = useState(false)
  return (
    <div
      draggable={false}
      onMouseDown={onPointerDown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title="Arrastra para cambiar el ancho"
      style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: '22px',
        cursor: 'ew-resize', display: 'flex', alignItems: 'center', justifyContent: 'center',
        touchAction: 'none', zIndex: 2,
        background: hover ? 'rgba(124,58,237,0.1)' : 'transparent',
        transition: 'background 0.15s',
      }}
    >
      <div style={{ width: '4px', height: '36px', borderRadius: '2px', background: hover ? 'var(--accent-2)' : 'var(--border)', transition: 'background 0.15s' }} />
    </div>
  )
}

function HeightHandle({ elRef, height, onResize }) {
  const startRef = useRef(null)

  const onPointerDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const startHeight = height || (elRef.current ? elRef.current.getBoundingClientRect().height : 160)
    startRef.current = { y: e.clientY, height: startHeight }
    document.body.style.userSelect = 'none'

    const onMove = (ev) => {
      const dy = ev.clientY - startRef.current.y
      onResize(Math.max(100, Math.round(startRef.current.height + dy)))
    }
    const onUp = () => {
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const [hover, setHover] = useState(false)
  return (
    <div
      draggable={false}
      onMouseDown={onPointerDown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title="Arrastra para cambiar el alto"
      style={{
        position: 'absolute', left: 0, right: '22px', bottom: 0, height: '14px',
        cursor: 'ns-resize', display: 'flex', alignItems: 'center', justifyContent: 'center',
        touchAction: 'none', zIndex: 2,
        background: hover ? 'rgba(124,58,237,0.1)' : 'transparent',
        transition: 'background 0.15s',
      }}
    >
      <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: hover ? 'var(--accent-2)' : 'var(--border)', transition: 'background 0.15s' }} />
    </div>
  )
}

function CanvasBlock({ item, index, total, row, colStart, gridRef, dropTarget, onRemove, onMove, onRename, onResize, onResizeHeight, onReorder, onInsertAt, onDragOverIndex, onDragLeaveIndex }) {
  const block = byId[item.typeId]
  const Icon = block.icon
  const cardRef = useRef(null)
  return (
    <motion.div
      ref={cardRef}
      layout
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/reorder-index', String(index))
        e.dataTransfer.effectAllowed = 'move'
      }}
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      onDragOver={(e) => { e.preventDefault(); onDragOverIndex(index) }}
      onDragLeave={() => onDragLeaveIndex(index)}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onDragLeaveIndex(index)
        const rect = e.currentTarget.getBoundingClientRect()
        const insertAfter = e.clientX > rect.left + rect.width / 2
        const fromIndexStr = e.dataTransfer.getData('text/reorder-index')
        if (fromIndexStr !== '') {
          onReorder(Number(fromIndexStr), index, insertAfter, row)
          return
        }
        const blockId = e.dataTransfer.getData('text/block-id')
        if (blockId) onInsertAt(blockId, index, insertAfter, row)
      }}
      style={{
        position: 'relative',
        gridColumn: `${colStart} / span ${item.span || 4}`,
        gridRow: row,
        height: item.height ? `${item.height}px` : undefined,
        display: item.height ? 'flex' : undefined,
        flexDirection: item.height ? 'column' : undefined,
        borderRadius: '14px', overflow: 'hidden', cursor: 'grab',
        background: 'var(--bg-card)',
        border: `1px solid ${dropTarget ? 'var(--accent-2)' : `${block.color}35`}`,
        boxShadow: `0 8px 24px ${block.color}12`,
      }}
    >
      <div style={{ height: '3px', flexShrink: 0, background: `linear-gradient(90deg, ${block.color}, ${block.color}55)` }} />
      <div style={{ padding: '14px 28px 18px 16px', overflowY: item.height ? 'auto' : 'visible', flex: item.height ? 1 : undefined, minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${block.color}20`, color: block.color,
          }}>
            <Icon size={15} />
          </div>
          {block.customizable ? (
            <input
              draggable={false}
              value={item.label}
              onChange={(e) => onRename(item.uid, e.target.value)}
              placeholder="Ponle nombre a este módulo"
              style={{
                flex: 1, minWidth: 0, background: 'none', border: 'none', outline: 'none',
                fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-strong)',
                borderBottom: '1px dashed var(--border)', padding: '2px 0', cursor: 'text',
              }}
            />
          ) : (
            <div style={{ flex: 1, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-strong)' }}>{block.label}</div>
          )}
          <div draggable={false} style={{ display: 'flex', gap: '4px', flexShrink: 0, cursor: 'default' }}>
            <button
              draggable={false}
              onClick={() => onMove(index, -1)}
              disabled={index === 0}
              aria-label="Subir"
              style={{ ...ctrlBtnStyle, opacity: index === 0 ? 0.3 : 1 }}
            >
              <ChevronUp size={14} />
            </button>
            <button
              draggable={false}
              onClick={() => onMove(index, 1)}
              disabled={index === total - 1}
              aria-label="Bajar"
              style={{ ...ctrlBtnStyle, opacity: index === total - 1 ? 0.3 : 1 }}
            >
              <ChevronDown size={14} />
            </button>
            <button draggable={false} onClick={() => onRemove(item.uid)} aria-label="Quitar bloque" style={ctrlBtnStyle}>
              <X size={14} />
            </button>
          </div>
        </div>
        <BlockPreview id={item.typeId} color={block.color} />
      </div>
      <ResizeHandle span={item.span || 4} gridRef={gridRef} onResize={(next) => onResize(item.uid, next)} />
      <HeightHandle elRef={cardRef} height={item.height} onResize={(next) => onResizeHeight(item.uid, next)} />
    </motion.div>
  )
}

function roundRect(ctx, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2))
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// Dibuja, dentro del canvas de exportación, una versión simplificada de la
// mini-vista de cada tipo de módulo (los mismos patrones que BlockPreview
// pinta en pantalla con HTML/CSS), para que la imagen descargada se vea
// como el lienzo en vez de una lista plana.
function drawPreview(ctx, typeId, color, x, y, w, h) {
  if (w <= 0 || h <= 0) return
  const bar = (bx, by, bw, bh, c) => {
    if (bw <= 0 || bh <= 0) return
    roundRect(ctx, bx, by, bw, bh, bh / 2)
    ctx.fillStyle = c
    ctx.fill()
  }
  const circle = (cx, cy, radius, c) => {
    if (radius <= 0) return
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.fillStyle = c
    ctx.fill()
  }

  if (typeId === 'hero') {
    const cx = x + w / 2
    bar(cx - w * 0.19, y, w * 0.38, Math.min(8, h * 0.14), `${color}50`)
    bar(cx - w * 0.34, y + h * 0.22, w * 0.68, Math.min(14, h * 0.2), `${color}90`)
    bar(cx - w * 0.26, y + h * 0.5, w * 0.52, Math.min(8, h * 0.14), `${color}35`)
    if (h > 60) { roundRect(ctx, cx - 44, y + h * 0.72, 88, Math.min(22, h * 0.22), 10); ctx.fillStyle = color; ctx.fill() }
    return
  }
  if (typeId === 'about') {
    const halfW = w / 2 - 8
    bar(x, y, halfW * 0.85, 7, `${color}55`)
    bar(x, y + h * 0.28, halfW * 0.95, 6, `${color}30`)
    bar(x, y + h * 0.52, halfW * 0.75, 6, `${color}30`)
    bar(x, y + h * 0.76, halfW * 0.85, 6, `${color}30`)
    roundRect(ctx, x + halfW + 16, y, halfW, h, 10)
    ctx.fillStyle = `${color}20`
    ctx.fill()
    return
  }
  if (typeId === 'gallery') {
    const gap = 8
    const cell = (w - gap * 3) / 4
    for (let i = 0; i < 4; i++) {
      roundRect(ctx, x + i * (cell + gap), y, cell, Math.min(cell, h), 8)
      ctx.fillStyle = `${color}${i % 2 ? '22' : '3a'}`
      ctx.fill()
    }
    return
  }
  if (typeId === 'testimonials') {
    const gap = 10
    const cell = (w - gap * 2) / 3
    for (let i = 0; i < 3; i++) {
      const cx0 = x + i * (cell + gap)
      const ch = Math.min(h, 74)
      roundRect(ctx, cx0, y, cell, ch, 10)
      ctx.fillStyle = `${color}14`
      ctx.fill()
      ctx.strokeStyle = `${color}30`
      ctx.lineWidth = 1
      roundRect(ctx, cx0, y, cell, ch, 10)
      ctx.stroke()
      circle(cx0 + 16, y + 16, 8, `${color}70`)
      bar(cx0 + 8, y + 32, cell - 16, 5, `${color}45`)
      bar(cx0 + 8, y + 44, cell * 0.6, 5, `${color}30`)
    }
    return
  }
  if (typeId === 'team') {
    const gap = 12
    const cell = (w - gap * 2) / 3
    for (let i = 0; i < 3; i++) {
      const cx0 = x + i * (cell + gap)
      circle(cx0 + cell / 2, y + 16, 14, `${color}55`)
      bar(cx0 + cell * 0.15, y + 36, cell * 0.7, 5, `${color}45`)
      bar(cx0 + cell * 0.25, y + 46, cell * 0.5, 4, `${color}25`)
    }
    return
  }
  if (typeId === 'stats') {
    const gap = 10
    const cell = (w - gap * 2) / 3
    for (let i = 0; i < 3; i++) {
      const cx0 = x + i * (cell + gap)
      roundRect(ctx, cx0 + cell / 2 - 18, y, 36, Math.min(20, h * 0.5), 5)
      ctx.fillStyle = color
      ctx.fill()
      bar(cx0 + cell * 0.15, y + Math.min(28, h * 0.68), cell * 0.7, 5, `${color}35`)
    }
    return
  }
  if (typeId === 'faq') {
    const rowGap = 6
    const rowH = Math.max(14, Math.min(28, (h - rowGap * 2) / 3))
    for (let i = 0; i < 3; i++) {
      const ry = y + i * (rowH + rowGap)
      roundRect(ctx, x, ry, w, rowH, 8)
      ctx.fillStyle = `${color}12`
      ctx.fill()
      bar(x + 12, ry + rowH / 2 - 3, w * 0.6, 6, `${color}55`)
      roundRect(ctx, x + w - 24, ry + rowH / 2 - 5, 10, 10, 3)
      ctx.fillStyle = `${color}55`
      ctx.fill()
    }
    return
  }
  if (typeId === 'social') {
    const n = 5, gap = 12, d = Math.min(26, h)
    const totalW = n * d + (n - 1) * gap
    let sx = x + Math.max(0, (w - totalW) / 2)
    const alphas = ['25', '35', '45', '35', '25']
    for (let i = 0; i < n; i++) { circle(sx + d / 2, y + d / 2, d / 2, `${color}${alphas[i]}`); sx += d + gap }
    return
  }
  if (typeId === 'pricing') {
    const gap = 10
    const cell = (w - gap * 2) / 3
    for (let i = 0; i < 3; i++) {
      const cx0 = x + i * (cell + gap)
      const hl = i === 1
      const ch = Math.min(h, 84)
      roundRect(ctx, cx0, y, cell, ch, 10)
      ctx.fillStyle = hl ? `${color}30` : `${color}12`
      ctx.fill()
      if (hl) { ctx.strokeStyle = color; ctx.lineWidth = 1.5; roundRect(ctx, cx0, y, cell, ch, 10); ctx.stroke() }
      bar(cx0 + cell * 0.2, y + 10, cell * 0.6, 6, `${color}60`)
      roundRect(ctx, cx0 + cell * 0.25, y + 22, cell * 0.5, 13, 6)
      ctx.fillStyle = color
      ctx.fill()
      bar(cx0 + cell * 0.1, y + 42, cell * 0.8, 4, `${color}35`)
    }
    return
  }
  if (typeId === 'contact') {
    const halfW = w / 2 - 8
    roundRect(ctx, x, y, halfW, 20, 6); ctx.fillStyle = `${color}16`; ctx.fill()
    roundRect(ctx, x, y + 26, halfW, 20, 6); ctx.fillStyle = `${color}16`; ctx.fill()
    roundRect(ctx, x, y + 52, halfW, Math.max(10, h - 52), 6); ctx.fillStyle = `${color}16`; ctx.fill()
    bar(x + halfW + 16, y + 8, halfW * 0.7, 6, `${color}45`)
    bar(x + halfW + 16, y + 20, halfW * 0.55, 6, `${color}45`)
    if (h > 40) { roundRect(ctx, x + halfW + 16, y + 34, 80, 20, 10); ctx.fillStyle = color; ctx.fill() }
    return
  }
  // custom / genérico
  bar(x + w * 0.2, y, w * 0.55, 7, `${color}45`)
  bar(x + w * 0.1, y + h * 0.35, w * 0.75, 6, `${color}30`)
  bar(x + w * 0.15, y + h * 0.65, w * 0.4, 6, `${color}30`)
}

function drawCard(ctx, { x, y, w, h, block, typeId, label }) {
  roundRect(ctx, x, y, w, h, 10)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  ctx.strokeStyle = `${block.color}45`
  ctx.lineWidth = 1
  roundRect(ctx, x, y, w, h, 10)
  ctx.stroke()

  // franja de color arriba
  roundRect(ctx, x, y, w, 4, 2)
  ctx.fillStyle = block.color
  ctx.fill()

  const iconR = Math.min(11, h * 0.16, w * 0.16)
  const iconCx = x + 14 + iconR
  const iconCy = y + 14 + iconR
  ctx.beginPath()
  ctx.arc(iconCx, iconCy, iconR, 0, Math.PI * 2)
  ctx.fillStyle = `${block.color}25`
  ctx.fill()

  ctx.fillStyle = '#1e1533'
  ctx.font = `700 ${Math.max(10, Math.min(14, w * 0.055))}px Inter, sans-serif`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, iconCx + iconR + 8, iconCy + 1, Math.max(10, w - (iconCx + iconR + 8 - x) - 10))
  ctx.textBaseline = 'alphabetic'

  const contentY = iconCy + iconR + 12
  const contentH = y + h - contentY - 10
  const contentX = x + 12
  const contentW = w - 24
  if (contentH > 14 && contentW > 14) {
    drawPreview(ctx, typeId, block.color, contentX, contentY, contentW, contentH)
  }
}

const makeUid = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`)

// Cada módulo guarda su propia fila (item.row), asignada solo al agregarlo
// o al arrastrarlo — nunca se recalcula por su cuenta. Aquí solo se decide
// en qué COLUMNA queda dentro de su fila, acomodando en orden a los que
// comparten esa misma fila. Así, cambiar el ancho de un módulo nunca mueve
// a los demás ni lo pega junto a otro sin que tú lo arrastres.
function computeLayout(items) {
  const layout = {}
  const cursorByRow = {}
  for (const item of items) {
    const row = item.row || 1
    const span = Math.min(4, item.span || 4)
    const used = cursorByRow[row] || 0
    const colStart = Math.max(1, Math.min(used + 1, 5 - span))
    layout[item.uid] = { row, colStart }
    cursorByRow[row] = used + span
  }
  return layout
}

const nextRow = (items) => items.reduce((m, it) => Math.max(m, it.row || 1), 0) + 1
const usedInRow = (items, row) => items.filter((it) => (it.row || 1) === row).reduce((s, it) => s + Math.min(4, it.span || 4), 0)

export default function SiteBuilder() {
  const ref = useRef(null)
  const gridRef = useRef(null)
  const inView = useInView(ref, { once: true })
  const [canvas, setCanvas] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [dropIndex, setDropIndex] = useState(null)

  const addBlock = (typeId) => {
    setCanvas((c) => [...c, { uid: makeUid(), typeId, label: '', span: 4, row: nextRow(c) }])
  }
  // insertAfter/targetRow vienen de soltar una tarjeta de la paleta sobre un
  // módulo ya puesto: se une a la fila de ese módulo, en vez de crear una
  // fila nueva como hace el botón normal de la paleta.
  const insertBlockAt = (typeId, atIndex, insertAfter, targetRow) => {
    setCanvas((c) => {
      const next = [...c]
      let target = atIndex + (insertAfter ? 1 : 0)
      target = Math.max(0, Math.min(next.length, target))
      const row = targetRow ?? nextRow(c)
      const span = targetRow != null ? Math.max(1, 4 - usedInRow(c, targetRow)) : 4
      next.splice(target, 0, { uid: makeUid(), typeId, label: '', span, row })
      return next
    })
  }
  const removeBlock = (uid) => {
    setCanvas((c) => c.filter((item) => item.uid !== uid))
  }
  const renameBlock = (uid, label) => {
    setCanvas((c) => c.map((item) => (item.uid === uid ? { ...item, label } : item)))
  }
  // Solo cambia el ancho — la fila del módulo nunca se toca aquí, para que
  // achicar/agrandar uno no reacomode ni pegue a los demás.
  const resizeBlock = (uid, span) => {
    setCanvas((c) => c.map((item) => (item.uid === uid ? { ...item, span } : item)))
  }
  const resizeBlockHeight = (uid, height) => {
    setCanvas((c) => c.map((item) => (item.uid === uid ? { ...item, height } : item)))
  }
  // Al soltarlo sobre otro módulo, adopta la fila de ese módulo y se coloca
  // justo antes o después de él (según en qué mitad se soltó). Es la ÚNICA
  // forma de que un módulo cambie de fila.
  const reorderBlock = (fromIndex, toIndex, insertAfter, targetRow) => {
    if (fromIndex === toIndex) return
    setCanvas((c) => {
      const next = [...c]
      const [moved] = next.splice(fromIndex, 1)
      let target = toIndex > fromIndex ? toIndex - 1 : toIndex
      if (insertAfter) target += 1
      target = Math.max(0, Math.min(next.length, target))
      // si no cabe completo en la fila destino, se achica a lo que quede
      // libre en vez de encimarse con lo que ya está ahí
      const span = moved.row === targetRow ? (moved.span || 4) : Math.min(moved.span || 4, Math.max(1, 4 - usedInRow(next, targetRow)))
      next.splice(target, 0, { ...moved, row: targetRow, span })
      return next
    })
  }
  const moveBlock = (index, dir) => {
    setCanvas((c) => {
      const next = [...c]
      const j = index + dir
      if (j < 0 || j >= next.length) return c
      ;[next[index], next[j]] = [next[j], next[index]]
      return next
    })
  }
  const reset = () => setCanvas([])

  // Soltar en el espacio vacío del lienzo (no sobre un módulo específico):
  // si es una tarjeta de la paleta, se agrega al final en su propia fila;
  // si es un módulo que se estaba arrastrando, se manda al final en una
  // fila nueva para él solo.
  // Si el punto donde soltaste cae dentro del alto de una fila que ya
  // existe (aunque no sea justo encima de una tarjeta — por ejemplo el
  // espacio vacío a la derecha de un módulo angosto), se une a esa fila.
  // Solo si soltaste debajo de todo lo demás se crea una fila nueva.
  const rowAtPoint = (clientY) => {
    const gridEl = gridRef.current
    if (!gridEl) return null
    for (const el of gridEl.children) {
      const r = el.getBoundingClientRect()
      if (clientY >= r.top && clientY <= r.bottom) {
        const row = Number(el.style.gridRow)
        if (row) return row
      }
    }
    return null
  }
  const lastIndexOfRow = (items, row) => {
    let idx = -1
    items.forEach((it, i) => { if ((it.row || 1) === row) idx = i })
    return idx
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const targetRow = rowAtPoint(e.clientY)
    const fromIndexStr = e.dataTransfer.getData('text/reorder-index')
    if (fromIndexStr !== '') {
      const fromIndex = Number(fromIndexStr)
      setCanvas((c) => {
        const next = [...c]
        const [moved] = next.splice(fromIndex, 1)
        if (targetRow != null) {
          const span = moved.row === targetRow ? (moved.span || 4) : Math.min(moved.span || 4, Math.max(1, 4 - usedInRow(next, targetRow)))
          const at = lastIndexOfRow(next, targetRow) + 1
          next.splice(at, 0, { ...moved, row: targetRow, span })
        } else {
          next.push({ ...moved, row: nextRow(next) })
        }
        return next
      })
      return
    }
    const id = e.dataTransfer.getData('text/block-id')
    if (!id) return
    if (targetRow != null) {
      setCanvas((c) => {
        const span = Math.max(1, 4 - usedInRow(c, targetRow))
        const next = [...c]
        next.splice(lastIndexOfRow(next, targetRow) + 1, 0, { uid: makeUid(), typeId: id, label: '', span, row: targetRow })
        return next
      })
    } else {
      addBlock(id)
    }
  }

  const labelOf = (item) => (item.typeId === 'custom' ? (item.label.trim() || 'Módulo personalizado') : byId[item.typeId].label)
  const layout = computeLayout(canvas)

  const waMsg = encodeURIComponent(
    canvas.length
      ? `Hola DigiSpherix! Arme un diseño con estas secciones, en este orden: ${canvas.map(labelOf).join(', ')}. Adjunto una imagen con la vista previa. ¿Podrían darme una cotización?`
      : `Hola DigiSpherix! Me gustaría que me ayuden a armar el diseño de mi sitio web.`
  )

  // Mide las tarjetas TAL COMO se ven ahora mismo en el lienzo (filas,
  // columnas y alturas reales) y dibuja la imagen a esa misma proporción,
  // en vez de una lista simple — así la descarga se ve como el lienzo.
  const downloadImage = () => {
    const gridEl = gridRef.current
    if (!canvas.length || !gridEl) return
    const gridRect = gridEl.getBoundingClientRect()
    const cardEls = Array.from(gridEl.children)

    const width = 720
    const padX = 24
    const headerH = 90
    const footerH = 64
    const contentGap = 24
    const contentWidth = width - padX * 2
    const scale = contentWidth / gridRect.width
    const contentHeight = gridRect.height * scale
    const height = headerH + contentGap + contentHeight + contentGap + footerH

    const cv = document.createElement('canvas')
    const dpr = 2
    cv.width = width * dpr
    cv.height = height * dpr
    const ctx = cv.getContext('2d')
    ctx.scale(dpr, dpr)

    ctx.fillStyle = '#f5f2fb'
    ctx.fillRect(0, 0, width, height)

    const grad = ctx.createLinearGradient(0, 0, width, 0)
    grad.addColorStop(0, '#7c3aed')
    grad.addColorStop(1, '#d946ef')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, headerH)
    ctx.fillStyle = '#ffffff'
    ctx.font = '700 22px Inter, sans-serif'
    ctx.fillText('Mi sitio con DigiSpherix', 24, 42)
    ctx.font = '400 13px Inter, sans-serif'
    ctx.fillText('Vista previa armada en digispherix.com.mx', 24, 66)

    canvas.forEach((item, i) => {
      const el = cardEls[i]
      if (!el) return
      const r = el.getBoundingClientRect()
      const x = padX + (r.left - gridRect.left) * scale
      const y = headerH + contentGap + (r.top - gridRect.top) * scale
      const w = r.width * scale
      const h = r.height * scale
      drawCard(ctx, { x, y, w, h, block: byId[item.typeId], typeId: item.typeId, label: labelOf(item) })
    })

    ctx.fillStyle = '#ece6f8'
    ctx.fillRect(0, height - footerH, width, footerH)
    ctx.fillStyle = '#1e1533'
    ctx.font = '700 14px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('¿Te gusta este diseño? Cotízalo gratis', width / 2, height - footerH / 2 - 6)
    ctx.fillStyle = '#6d5f96'
    ctx.font = '400 12px Inter, sans-serif'
    ctx.fillText('WhatsApp 33 2031 8435 · digispherix.com.mx', width / 2, height - footerH / 2 + 14)
    ctx.textAlign = 'left'

    cv.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'mi-sitio-digispherix.png'
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  return (
    <section id="constructor" ref={ref} className="ds-section relative" style={{ color: 'var(--text)' }}>
      <div className="ds-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-center text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: 'var(--accent-2)' }}>
            Pruébalo tú mismo
          </p>
          <h2 className="section-title gradient-text">Arma tu sitio</h2>
          <p className="section-subtitle">
            Arrastra o toca los bloques para armar una vista previa de tu sitio ideal, puedes repetirlos
            las veces que quieras. Cuando quede como te gusta, descarga la imagen y te cotizamos gratis.
          </p>
        </motion.div>

        <div className="builder-grid">
          {/* Paleta */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {BLOCKS.map((b) => (
              <PaletteCard
                key={b.id}
                block={b}
                count={canvas.filter((c) => c.typeId === b.id).length}
                onAdd={addBlock}
              />
            ))}
          </div>

          {/* Lienzo */}
          <div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                borderRadius: '20px', overflow: 'hidden',
                background: 'var(--bg-card)', border: `1px solid ${dragOver ? 'var(--accent-2)' : 'var(--border)'}`,
                transition: 'border-color 0.2s',
              }}
            >
              {/* Barra tipo navegador */}
              <div style={{
                background: 'var(--bg-card-alt)', padding: '10px 14px',
                display: 'flex', alignItems: 'center', gap: '6px',
                borderBottom: '1px solid var(--border)',
              }}>
                <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#28c840' }} />
                <div style={{
                  flex: 1, background: 'rgba(124,58,237,0.1)', borderRadius: '5px',
                  padding: '4px 10px', fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px',
                }}>
                  tunegocio.com
                </div>
              </div>

              {/* Contenido */}
              <div style={{ padding: '20px', minHeight: '280px' }}>
                {canvas.length === 0 ? (
                  <div style={{
                    height: '240px', borderRadius: '14px', border: '2px dashed var(--border)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    color: 'var(--text-dim)', textAlign: 'center', padding: '20px',
                  }}>
                    <Sparkles size={26} />
                    <p style={{ fontSize: '0.9rem', maxWidth: '280px' }}>
                      Arrastra bloques aquí, o tócalos para agregarlos
                    </p>
                  </div>
                ) : (
                  <div className="builder-canvas-grid" ref={gridRef}>
                    <AnimatePresence initial={false}>
                      {canvas.map((item, i) => (
                        <CanvasBlock
                          key={item.uid}
                          item={item}
                          index={i}
                          total={canvas.length}
                          row={layout[item.uid].row}
                          colStart={layout[item.uid].colStart}
                          gridRef={gridRef}
                          dropTarget={dropIndex === i}
                          onRemove={removeBlock}
                          onMove={moveBlock}
                          onRename={renameBlock}
                          onResize={resizeBlock}
                          onResizeHeight={resizeBlockHeight}
                          onReorder={reorderBlock}
                          onInsertAt={insertBlockAt}
                          onDragOverIndex={setDropIndex}
                          onDragLeaveIndex={() => setDropIndex(null)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
              {canvas.length > 0 && (
                <button
                  onClick={reset}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', fontSize: '0.85rem', padding: '6px 0',
                  }}
                >
                  <RotateCcw size={14} /> Empezar de nuevo
                </button>
              )}
              <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto', flexWrap: 'wrap' }}>
                {canvas.length > 0 && (
                  <button onClick={downloadImage} className="btn-secondary">
                    <Download size={16} /> Descargar imagen
                  </button>
                )}
                <a
                  href={`https://wa.me/523320318435?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  <MessageCircle size={16} />
                  {canvas.length > 0 ? 'Cotizar este diseño' : 'Cotizar mi proyecto'}
                </a>
              </div>
            </div>
            {canvas.length > 0 && (
              <p style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                WhatsApp no permite adjuntar archivos automáticamente: descarga la imagen y adjúntala tú en el chat.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
