'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import {
  Smartphone, LogIn, Home, Search, LayoutGrid, Package, ShoppingCart, CreditCard,
  User, Bell, MessageCircle, MapPin, Settings, Plus, X, ChevronUp, ChevronDown,
  RotateCcw, MessageCircle as WhatsIcon, Download, Sparkles,
} from 'lucide-react'

// Constructor de app Android: mismo concepto que el de sitio web pero cada
// bloque es una PANTALLA de la app, apiladas dentro de un marco de celular.
// Al ser una pantalla de teléfono, todo es de una sola columna (ancho
// completo); se puede reordenar arrastrando, ajustar alto, subir/bajar y
// quitar. Descarga una imagen con la vista previa dentro de un mockup.

const SCREENS = [
  { id: 'onboarding', label: 'Bienvenida', icon: Smartphone, color: '#7c3aed', desc: 'Presentación e inicio de la app' },
  { id: 'login', label: 'Login / Registro', icon: LogIn, color: '#d946ef', desc: 'Acceso y creación de cuenta' },
  { id: 'home', label: 'Inicio', icon: Home, color: '#a855f7', desc: 'Pantalla principal / feed' },
  { id: 'search', label: 'Búsqueda', icon: Search, color: '#0ea5e9', desc: 'Buscar y filtrar' },
  { id: 'catalog', label: 'Catálogo', icon: LayoutGrid, color: '#16a34a', desc: 'Lista de productos o servicios' },
  { id: 'detail', label: 'Detalle', icon: Package, color: '#e879f9', desc: 'Ficha de un producto' },
  { id: 'cart', label: 'Carrito', icon: ShoppingCart, color: '#f59e0b', desc: 'Productos por comprar' },
  { id: 'payment', label: 'Pagos', icon: CreditCard, color: '#22c55e', desc: 'Checkout y métodos de pago' },
  { id: 'profile', label: 'Perfil', icon: User, color: '#ec4899', desc: 'Datos del usuario' },
  { id: 'notifications', label: 'Notificaciones', icon: Bell, color: '#f97316', desc: 'Avisos y alertas push' },
  { id: 'chat', label: 'Chat / Soporte', icon: MessageCircle, color: '#06b6d4', desc: 'Mensajería con el usuario' },
  { id: 'map', label: 'Mapa', icon: MapPin, color: '#ef4444', desc: 'Ubicación y direcciones' },
  { id: 'settings', label: 'Ajustes', icon: Settings, color: '#8b5cf6', desc: 'Preferencias de la app' },
  { id: 'custom', label: 'Pantalla personalizada', icon: Plus, color: '#a78bfa', desc: 'Algo distinto, ponle nombre', customizable: true },
]

const byId = Object.fromEntries(SCREENS.map((s) => [s.id, s]))
const makeUid = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`)

const bar = (color, w, h = '8px') => ({ height: h, width: w, borderRadius: '99px', background: color, flexShrink: 0 })

// Mini-mockup por pantalla, pensado para el ancho angosto de un teléfono.
function ScreenPreview({ id, color }) {
  if (id === 'onboarding') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '9px', padding: '10px 0' }}>
        <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: `${color}30`, border: `1px solid ${color}45` }} />
        <div style={bar(`${color}70`, '70%', '10px')} />
        <div style={bar(`${color}30`, '85%', '6px')} />
        <div style={{ ...bar(color, '80%', '22px'), borderRadius: '99px', marginTop: '4px' }} />
      </div>
    )
  }
  if (id === 'login') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
        <div style={{ height: '20px', borderRadius: '7px', background: `${color}16`, border: `1px solid ${color}30` }} />
        <div style={{ height: '20px', borderRadius: '7px', background: `${color}16`, border: `1px solid ${color}30` }} />
        <div style={{ ...bar(color, '100%', '22px'), borderRadius: '8px', marginTop: '2px' }} />
        <div style={{ ...bar(`${color}40`, '55%', '5px'), margin: '2px auto 0' }} />
      </div>
    )
  }
  if (id === 'home') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ height: '40px', borderRadius: '10px', background: `${color}25` }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ height: '34px', borderRadius: '9px', background: `${color}18` }} />
          <div style={{ height: '34px', borderRadius: '9px', background: `${color}18` }} />
        </div>
      </div>
    )
  }
  if (id === 'search') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ height: '24px', borderRadius: '99px', background: `${color}16`, border: `1px solid ${color}30` }} />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: `${color}25`, flexShrink: 0 }} />
            <div style={bar(`${color}35`, `${80 - i * 12}%`, '6px')} />
          </div>
        ))}
      </div>
    )
  }
  if (id === 'catalog') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ aspectRatio: '1.3', borderRadius: '8px', background: `${color}${i % 2 ? '22' : '33'}` }} />
            <div style={bar(`${color}40`, '80%', '4px')} />
          </div>
        ))}
      </div>
    )
  }
  if (id === 'detail') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ height: '54px', borderRadius: '10px', background: `${color}2e` }} />
        <div style={bar(`${color}70`, '65%', '9px')} />
        <div style={bar(`${color}30`, '90%', '5px')} />
        <div style={bar(`${color}30`, '80%', '5px')} />
        <div style={{ ...bar(color, '100%', '20px'), borderRadius: '8px', marginTop: '2px' }} />
      </div>
    )
  }
  if (id === 'cart') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: `${color}25`, flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={bar(`${color}45`, '70%', '5px')} />
              <div style={bar(`${color}30`, '40%', '4px')} />
            </div>
          </div>
        ))}
        <div style={{ ...bar(color, '100%', '20px'), borderRadius: '8px', marginTop: '2px' }} />
      </div>
    )
  }
  if (id === 'payment') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ height: '40px', borderRadius: '10px', background: `linear-gradient(135deg, ${color}40, ${color}15)`, border: `1px solid ${color}35` }} />
        <div style={{ height: '18px', borderRadius: '6px', background: `${color}16`, border: `1px solid ${color}30` }} />
        <div style={{ ...bar(color, '100%', '20px'), borderRadius: '8px', marginTop: '2px' }} />
      </div>
    )
  }
  if (id === 'profile') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `${color}45` }} />
        <div style={bar(`${color}55`, '50%', '7px')} />
        <div style={bar(`${color}30`, '35%', '5px')} />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '2px' }}>
          <div style={{ height: '14px', borderRadius: '5px', background: `${color}14` }} />
          <div style={{ height: '14px', borderRadius: '5px', background: `${color}14` }} />
        </div>
      </div>
    )
  }
  if (id === 'notifications') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '8px', background: `${color}12` }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: `${color}45`, flexShrink: 0 }} />
            <div style={bar(`${color}35`, `${75 - i * 10}%`, '5px')} />
          </div>
        ))}
      </div>
    )
  }
  if (id === 'chat') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ ...bar(`${color}20`, '70%', '18px'), borderRadius: '12px 12px 12px 3px' }} />
        <div style={{ ...bar(color, '60%', '18px'), borderRadius: '12px 12px 3px 12px', alignSelf: 'flex-end' }} />
        <div style={{ ...bar(`${color}20`, '55%', '18px'), borderRadius: '12px 12px 12px 3px' }} />
      </div>
    )
  }
  if (id === 'map') {
    return (
      <div style={{ position: 'relative', height: '80px', borderRadius: '10px', background: `${color}16`, border: `1px solid ${color}30`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '30%', left: '20%', width: '60%', height: '2px', background: `${color}40` }} />
        <div style={{ position: 'absolute', top: '10%', left: '55%', width: '2px', height: '70%', background: `${color}40` }} />
        <div style={{ position: 'absolute', top: '38%', left: '48%', width: '14px', height: '14px', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', background: color }} />
      </div>
    )
  }
  if (id === 'settings') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '8px', background: `${color}10` }}>
            <div style={bar(`${color}40`, '50%', '6px')} />
            <div style={{ width: '26px', height: '14px', borderRadius: '99px', background: `${color}45` }} />
          </div>
        ))}
      </div>
    )
  }
  // custom / genérico
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '9px', padding: '8px 0' }}>
      <div style={bar(`${color}45`, '55%', '7px')} />
      <div style={bar(`${color}30`, '80%', '6px')} />
      <div style={bar(`${color}30`, '45%', '6px')} />
    </div>
  )
}

const ctrlBtnStyle = {
  width: '26px', height: '26px', borderRadius: '7px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'var(--bg-card-alt)', border: '1px solid var(--border)',
  color: 'var(--text-muted)', cursor: 'pointer',
}

function PaletteCard({ block, count, onAdd }) {
  const Icon = block.icon
  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/screen-id', block.id)}
      onClick={() => onAdd(block.id)}
      aria-label={`Agregar pantalla ${block.label}`}
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
        <span style={{ flexShrink: 0, fontSize: '0.72rem', fontWeight: 700, color: block.color, background: `${block.color}18`, borderRadius: '99px', padding: '2px 8px' }}>
          ×{count}
        </span>
      )}
    </button>
  )
}

function HeightHandle({ elRef, height, onResize }) {
  const startRef = useRef(null)
  const [hover, setHover] = useState(false)

  const onPointerDown = (e) => {
    e.preventDefault(); e.stopPropagation()
    const startHeight = height || (elRef.current ? elRef.current.getBoundingClientRect().height : 140)
    startRef.current = { y: e.clientY, height: startHeight }
    document.body.style.userSelect = 'none'
    const onMove = (ev) => onResize(Math.max(90, Math.round(startRef.current.height + (ev.clientY - startRef.current.y))))
    const onUp = () => { document.body.style.userSelect = ''; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp)
  }

  return (
    <div
      draggable={false}
      onMouseDown={onPointerDown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title="Arrastra para cambiar el alto"
      style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '13px',
        cursor: 'ns-resize', display: 'flex', alignItems: 'center', justifyContent: 'center',
        touchAction: 'none', zIndex: 2, background: hover ? 'rgba(124,58,237,0.1)' : 'transparent', transition: 'background 0.15s',
      }}
    >
      <div style={{ width: '32px', height: '4px', borderRadius: '2px', background: hover ? 'var(--accent-2)' : 'var(--border)', transition: 'background 0.15s' }} />
    </div>
  )
}

function ScreenCard({ item, index, total, dropTarget, onRemove, onMove, onRename, onResizeHeight, onReorder, onInsertAt, onDragOverIndex, onDragLeaveIndex }) {
  const block = byId[item.typeId]
  const Icon = block.icon
  const cardRef = useRef(null)
  return (
    <motion.div
      ref={cardRef}
      layout
      draggable
      onDragStart={(e) => { e.dataTransfer.setData('text/reorder-index', String(index)); e.dataTransfer.effectAllowed = 'move' }}
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.22 }}
      onDragOver={(e) => { e.preventDefault(); onDragOverIndex(index) }}
      onDragLeave={() => onDragLeaveIndex(index)}
      onDrop={(e) => {
        e.preventDefault(); e.stopPropagation()
        onDragLeaveIndex(index)
        const rect = e.currentTarget.getBoundingClientRect()
        const after = e.clientY > rect.top + rect.height / 2
        const fromIndexStr = e.dataTransfer.getData('text/reorder-index')
        if (fromIndexStr !== '') { onReorder(Number(fromIndexStr), index, after); return }
        const screenId = e.dataTransfer.getData('text/screen-id')
        if (screenId) onInsertAt(screenId, index, after)
      }}
      style={{
        position: 'relative',
        height: item.height ? `${item.height}px` : undefined,
        display: 'flex', flexDirection: 'column',
        borderRadius: '12px', overflow: 'hidden', cursor: 'grab',
        background: 'var(--bg-card)',
        border: `1px solid ${dropTarget ? 'var(--accent-2)' : `${block.color}40`}`,
      }}
    >
      <div style={{ height: '3px', flexShrink: 0, background: `linear-gradient(90deg, ${block.color}, ${block.color}55)` }} />
      <div style={{ padding: '10px 12px 16px', overflowY: item.height ? 'auto' : 'visible', flex: item.height ? 1 : undefined, minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '7px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${block.color}20`, color: block.color }}>
            <Icon size={13} />
          </div>
          {block.customizable ? (
            <input
              draggable={false}
              value={item.label}
              onChange={(e) => onRename(item.uid, e.target.value)}
              placeholder="Nombre de la pantalla"
              style={{ flex: 1, minWidth: 0, background: 'none', border: 'none', outline: 'none', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-strong)', borderBottom: '1px dashed var(--border)', padding: '2px 0', cursor: 'text' }}
            />
          ) : (
            <div style={{ flex: 1, fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{block.label}</div>
          )}
          <div draggable={false} style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
            <button draggable={false} onClick={() => onMove(index, -1)} disabled={index === 0} aria-label="Subir" style={{ ...ctrlBtnStyle, width: '22px', height: '22px', opacity: index === 0 ? 0.3 : 1 }}><ChevronUp size={12} /></button>
            <button draggable={false} onClick={() => onMove(index, 1)} disabled={index === total - 1} aria-label="Bajar" style={{ ...ctrlBtnStyle, width: '22px', height: '22px', opacity: index === total - 1 ? 0.3 : 1 }}><ChevronDown size={12} /></button>
            <button draggable={false} onClick={() => onRemove(item.uid)} aria-label="Quitar pantalla" style={{ ...ctrlBtnStyle, width: '22px', height: '22px' }}><X size={12} /></button>
          </div>
        </div>
        <ScreenPreview id={item.typeId} color={block.color} />
      </div>
      <HeightHandle elRef={cardRef} height={item.height} onResize={(next) => onResizeHeight(item.uid, next)} />
    </motion.div>
  )
}

export default function AppBuilder() {
  const [screens, setScreens] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [dropIndex, setDropIndex] = useState(null)

  const addScreen = (typeId) => setScreens((c) => [...c, { uid: makeUid(), typeId, label: '' }])
  const insertAt = (typeId, atIndex, after) => setScreens((c) => {
    const next = [...c]; let t = atIndex + (after ? 1 : 0); t = Math.max(0, Math.min(next.length, t))
    next.splice(t, 0, { uid: makeUid(), typeId, label: '' }); return next
  })
  const removeScreen = (uid) => setScreens((c) => c.filter((s) => s.uid !== uid))
  const renameScreen = (uid, label) => setScreens((c) => c.map((s) => (s.uid === uid ? { ...s, label } : s)))
  const resizeHeight = (uid, height) => setScreens((c) => c.map((s) => (s.uid === uid ? { ...s, height } : s)))
  const reorder = (from, to, after) => setScreens((c) => {
    const next = [...c]; const [m] = next.splice(from, 1)
    let t = to > from ? to - 1 : to; if (after) t += 1; t = Math.max(0, Math.min(next.length, t))
    next.splice(t, 0, m); return next
  })
  const moveScreen = (index, dir) => setScreens((c) => {
    const next = [...c]; const j = index + dir; if (j < 0 || j >= next.length) return c
    ;[next[index], next[j]] = [next[j], next[index]]; return next
  })
  const reset = () => setScreens([])

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    const fromIndexStr = e.dataTransfer.getData('text/reorder-index')
    if (fromIndexStr !== '') { setScreens((c) => { const next = [...c]; const [m] = next.splice(Number(fromIndexStr), 1); next.push(m); return next }); return }
    const id = e.dataTransfer.getData('text/screen-id')
    if (id) addScreen(id)
  }

  const labelOf = (item) => (item.typeId === 'custom' ? (item.label.trim() || 'Pantalla personalizada') : byId[item.typeId].label)

  const waMsg = encodeURIComponent(
    screens.length
      ? `Hola DigiSpherix! Diseñé una app Android con estas pantallas, en este orden: ${screens.map(labelOf).join(', ')}. Adjunto una imagen con la vista previa. ¿Podrían darme una cotización?`
      : `Hola DigiSpherix! Me gustaría que me ayuden a crear una app Android.`
  )

  const phoneRef = useRef(null)
  const downloadImage = () => {
    const el = phoneRef.current
    if (!screens.length || !el) return
    const cardEls = Array.from(el.children)
    const elRect = el.getBoundingClientRect()

    const width = 460
    const padX = 40
    const headerH = 84
    const footerH = 60
    const gapY = 20
    const contentW = width - padX * 2
    const scale = contentW / elRect.width
    const contentH = elRect.height * scale
    const height = headerH + gapY + contentH + gapY + footerH

    const cv = document.createElement('canvas')
    const dpr = 2
    cv.width = width * dpr; cv.height = height * dpr
    const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr)

    ctx.fillStyle = '#f5f2fb'; ctx.fillRect(0, 0, width, height)
    const grad = ctx.createLinearGradient(0, 0, width, 0)
    grad.addColorStop(0, '#7c3aed'); grad.addColorStop(1, '#d946ef')
    ctx.fillStyle = grad; ctx.fillRect(0, 0, width, headerH)
    ctx.fillStyle = '#ffffff'; ctx.font = '700 20px Inter, sans-serif'
    ctx.fillText('Mi app con DigiSpherix', 24, 40)
    ctx.font = '400 12px Inter, sans-serif'
    ctx.fillText('Vista previa armada en digispherix.com.mx', 24, 62)

    const roundRect = (x, y, w, h, r) => {
      r = Math.max(0, Math.min(r, w / 2, h / 2))
      ctx.beginPath(); ctx.moveTo(x + r, y)
      ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r)
      ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath()
    }

    screens.forEach((item, i) => {
      const c = cardEls[i]; if (!c) return
      const r = c.getBoundingClientRect()
      const x = padX + (r.left - elRect.left) * scale
      const y = headerH + gapY + (r.top - elRect.top) * scale
      const w = r.width * scale, h = r.height * scale
      const block = byId[item.typeId]
      ctx.fillStyle = '#ffffff'; roundRect(x, y, w, h, 10); ctx.fill()
      ctx.strokeStyle = `${block.color}50`; ctx.lineWidth = 1; roundRect(x, y, w, h, 10); ctx.stroke()
      ctx.fillStyle = block.color; roundRect(x, y, w, 4, 2); ctx.fill()
      ctx.fillStyle = `${block.color}25`; ctx.beginPath(); ctx.arc(x + 20, y + 22, 10, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#1e1533'; ctx.font = '700 13px Inter, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'
      ctx.fillText(labelOf(item), x + 38, y + 23, w - 48)
      ctx.textBaseline = 'alphabetic'
    })

    ctx.fillStyle = '#ece6f8'; ctx.fillRect(0, height - footerH, width, footerH)
    ctx.fillStyle = '#1e1533'; ctx.font = '700 13px Inter, sans-serif'; ctx.textAlign = 'center'
    ctx.fillText('¿Te gusta esta app? Cotízala gratis', width / 2, height - footerH / 2 - 5)
    ctx.fillStyle = '#6d5f96'; ctx.font = '400 11px Inter, sans-serif'
    ctx.fillText('WhatsApp 33 2031 8435 · digispherix.com.mx', width / 2, height - footerH / 2 + 13)
    ctx.textAlign = 'left'

    cv.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = 'mi-app-digispherix.png'; a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  return (
    <div className="builder-grid">
      {/* Paleta de pantallas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {SCREENS.map((b) => (
          <PaletteCard key={b.id} block={b} count={screens.filter((s) => s.typeId === b.id).length} onAdd={addScreen} />
        ))}
      </div>

      {/* Marco de celular */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '340px' }}>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              borderRadius: '38px', padding: '12px', background: 'var(--bg-card-alt)',
              border: `2px solid ${dragOver ? 'var(--accent-2)' : 'var(--border)'}`,
              boxShadow: '0 20px 50px rgba(124,58,237,0.18)', transition: 'border-color 0.2s',
            }}
          >
            <div style={{ borderRadius: '28px', overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              {/* Barra de estado con notch */}
              <div style={{ position: 'relative', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: 'var(--bg-card-alt)' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)' }}>9:41</span>
                <div style={{ position: 'absolute', top: '7px', left: '50%', transform: 'translateX(-50%)', width: '70px', height: '16px', borderRadius: '99px', background: 'var(--bg)' }} />
                <div style={{ display: 'flex', gap: '3px' }}>
                  <div style={{ width: '14px', height: '8px', borderRadius: '2px', border: '1px solid var(--text-muted)' }} />
                </div>
              </div>

              {/* Pantallas */}
              <div style={{ padding: '12px', minHeight: '360px' }}>
                {screens.length === 0 ? (
                  <div style={{ height: '340px', borderRadius: '16px', border: '2px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--text-dim)', textAlign: 'center', padding: '16px' }}>
                    <Sparkles size={24} />
                    <p style={{ fontSize: '0.85rem' }}>Arrastra pantallas aquí, o tócalas para agregarlas</p>
                  </div>
                ) : (
                  <div ref={phoneRef} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <AnimatePresence initial={false}>
                      {screens.map((item, i) => (
                        <ScreenCard
                          key={item.uid}
                          item={item}
                          index={i}
                          total={screens.length}
                          dropTarget={dropIndex === i}
                          onRemove={removeScreen}
                          onMove={moveScreen}
                          onRename={renameScreen}
                          onResizeHeight={resizeHeight}
                          onReorder={reorder}
                          onInsertAt={insertAt}
                          onDragOverIndex={setDropIndex}
                          onDragLeaveIndex={() => setDropIndex(null)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
            {screens.length > 0 && (
              <button onClick={reset} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '6px 0' }}>
                <RotateCcw size={14} /> Empezar de nuevo
              </button>
            )}
            <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto', flexWrap: 'wrap' }}>
              {screens.length > 0 && (
                <button onClick={downloadImage} className="btn-secondary">
                  <Download size={16} /> Descargar imagen
                </button>
              )}
              <a href={`https://wa.me/523320318435?text=${waMsg}`} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <WhatsIcon size={16} />
                {screens.length > 0 ? 'Cotizar esta app' : 'Cotizar mi app'}
              </a>
            </div>
          </div>
          {screens.length > 0 && (
            <p style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '8px' }}>
              WhatsApp no permite adjuntar archivos automáticamente: descarga la imagen y adjúntala tú en el chat.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
