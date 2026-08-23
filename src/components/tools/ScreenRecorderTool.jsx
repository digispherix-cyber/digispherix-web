'use client'

import { useState, useRef, useEffect } from 'react'
import { MonitorPlay, Square, Download, Mic, Volume2, RotateCcw } from 'lucide-react'

function fmtTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const sec = (s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

export default function ScreenRecorderTool() {
  const [micOn, setMicOn] = useState(true)
  const [sysAudio, setSysAudio] = useState(true)
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [videoUrl, setVideoUrl] = useState('')
  const [error, setError] = useState('')
  const [supported, setSupported] = useState(true)

  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamsRef = useRef([])
  const timerRef = useRef(null)
  const startTsRef = useRef(0)

  useEffect(() => () => stopEverything(), []) // limpiar al desmontar

  // Detectar si el navegador soporta grabar pantalla (no disponible en móvil)
  useEffect(() => {
    setSupported(!!(navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia === 'function'))
  }, [])

  const stopEverything = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    streamsRef.current.forEach((s) => s.getTracks().forEach((t) => t.stop()))
    streamsRef.current = []
  }

  const start = async () => {
    setError('')
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      setError('Tu navegador no soporta la grabación de pantalla. Usa Chrome, Edge o Firefox de escritorio.')
      return
    }
    try {
      if (videoUrl) { URL.revokeObjectURL(videoUrl); setVideoUrl('') }

      const display = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: sysAudio,
      })
      streamsRef.current.push(display)

      const tracks = [...display.getVideoTracks(), ...display.getAudioTracks()]

      if (micOn) {
        try {
          const mic = await navigator.mediaDevices.getUserMedia({ audio: true })
          streamsRef.current.push(mic)
          tracks.push(...mic.getAudioTracks())
        } catch {
          setError('No se pudo acceder al micrófono; se grabará sin él.')
        }
      }

      const mixed = new MediaStream(tracks)
      const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm'
      const rec = new MediaRecorder(mixed, { mimeType: mime })
      chunksRef.current = []
      rec.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data) }
      rec.onstop = async () => {
        let blob = new Blob(chunksRef.current, { type: 'video/webm' })
        // Escribir la duración en la cabecera del WebM para que la vista previa
        // se muestre y el archivo sea seekable (aquí y en el editor de video).
        const durMs = startTsRef.current ? Date.now() - startTsRef.current : 0
        if (durMs > 0) {
          try {
            const mod = await import('fix-webm-duration')
            const fixWebmDuration = mod.default || mod
            blob = await fixWebmDuration(blob, durMs, { logger: false })
          } catch { /* si falla, se usa el blob original */ }
        }
        setVideoUrl(URL.createObjectURL(blob))
        stopEverything()
        setRecording(false)
      }
      recorderRef.current = rec
      rec.start()
      startTsRef.current = Date.now()

      // si el usuario detiene el compartir desde el navegador, paramos
      display.getVideoTracks()[0].addEventListener('ended', () => {
        if (rec.state !== 'inactive') rec.stop()
      })

      setRecording(true)
      setSeconds(0)
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } catch (e) {
      if (e && e.name === 'NotAllowedError') setError('Cancelaste el permiso para compartir pantalla.')
      else setError('No se pudo iniciar la grabación. Intenta de nuevo.')
      stopEverything()
      setRecording(false)
    }
  }

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop()
  }

  // Las grabaciones WebM de MediaRecorder salen sin duración en la cabecera,
  // así que el <video> no muestra vista previa ni barra de tiempo. Este truco
  // fuerza al navegador a calcular la duración y a renderizar el primer cuadro.
  const fixWebmDuration = (e) => {
    const v = e.currentTarget
    if (v.duration === Infinity || isNaN(v.duration)) {
      const onUpdate = () => {
        v.removeEventListener('timeupdate', onUpdate)
        v.currentTime = 0
      }
      v.addEventListener('timeupdate', onUpdate)
      v.currentTime = 1e101
    }
  }

  const download = () => {
    if (!videoUrl) return
    const a = document.createElement('a')
    a.href = videoUrl
    a.download = `grabacion-digispherix-${Date.now()}.webm`
    a.click()
  }

  const toggle = (setter) => (e) => setter(e.target.checked)

  if (!supported) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 24px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--bg-card-alt)' }}>
        <div style={{ fontSize: '2.2rem', marginBottom: '12px' }}>📱💻</div>
        <h3 style={{ color: 'var(--text-strong)', fontWeight: 800, fontSize: '1.15rem', marginBottom: '12px' }}>Esta herramienta funciona en computadora</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto' }}>
          Grabar la pantalla desde el navegador no está disponible en celulares. Es una limitación del sistema (iPhone y Android), no de la herramienta.
        </p>
        <p style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '440px', margin: '16px auto 0' }}>
          En tu teléfono usa el grabador de pantalla que ya trae integrado:<br />
          <strong>iPhone:</strong> Centro de Control · <strong>Android:</strong> ajustes rápidos.
        </p>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem', marginTop: '18px' }}>
          Abre esta página en tu computadora para grabar aquí.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Opciones de audio */}
      {!recording && !videoUrl && (
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-card-alt)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.88rem', cursor: 'pointer', flex: '1 1 200px' }}>
            <input type="checkbox" checked={micOn} onChange={toggle(setMicOn)} style={{ accentColor: '#0891b2', width: '17px', height: '17px' }} />
            <Mic size={16} style={{ color: '#22d3ee' }} /> Incluir micrófono (tu voz)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-card-alt)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.88rem', cursor: 'pointer', flex: '1 1 200px' }}>
            <input type="checkbox" checked={sysAudio} onChange={toggle(setSysAudio)} style={{ accentColor: '#0891b2', width: '17px', height: '17px' }} />
            <Volume2 size={16} style={{ color: '#22d3ee' }} /> Incluir audio del sistema
          </label>
        </div>
      )}

      {/* Estado / grabación */}
      {recording ? (
        <div style={{ textAlign: 'center', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.35)', borderRadius: '16px', padding: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: '#f87171', fontWeight: 700, marginBottom: '10px' }}>
            <span className="rec-dot" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            GRABANDO
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums', marginBottom: '20px' }}>{fmtTime(seconds)}</div>
          <button onClick={stop} className="btn-primary justify-center" style={{ minWidth: '200px' }}>
            <Square size={16} /> Detener grabación
          </button>
        </div>
      ) : videoUrl ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <video src={videoUrl} controls preload="metadata" onLoadedMetadata={fixWebmDuration} style={{ width: '100%', borderRadius: '14px', border: '1px solid var(--border)', background: '#000' }} />
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={download} className="btn-primary justify-center" style={{ flex: '1 1 180px' }}>
              <Download size={16} /> Descargar video
            </button>
            <button onClick={start} className="btn-secondary" style={{ padding: '11px 18px' }}>
              <RotateCcw size={15} /> Grabar de nuevo
            </button>
          </div>
        </div>
      ) : (
        <button onClick={start} className="btn-primary justify-center" style={{ width: '100%', padding: '16px' }}>
          <MonitorPlay size={20} /> Grabar pantalla
        </button>
      )}

      {error && (
        <p style={{ color: '#f87171', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>{error}</p>
      )}

      {!recording && !videoUrl && (
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', lineHeight: 1.6, textAlign: 'center', margin: 0 }}>
          Funciona en Chrome, Edge o Firefox de escritorio. Al pulsar Grabar, tu navegador te pedirá elegir qué compartir (toda la pantalla, una ventana o una pestaña).
        </p>
      )}
    </div>
  )
}
