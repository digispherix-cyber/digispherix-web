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

  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamsRef = useRef([])
  const timerRef = useRef(null)

  useEffect(() => () => stopEverything(), []) // limpiar al desmontar

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
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        setVideoUrl(URL.createObjectURL(blob))
        stopEverything()
        setRecording(false)
      }
      recorderRef.current = rec
      rec.start()

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

  const download = () => {
    if (!videoUrl) return
    const a = document.createElement('a')
    a.href = videoUrl
    a.download = `grabacion-digispherix-${Date.now()}.webm`
    a.click()
  }

  const toggle = (setter) => (e) => setter(e.target.checked)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Opciones de audio */}
      {!recording && !videoUrl && (
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(12,9,35,0.6)', border: '1px solid rgba(124,58,237,0.25)', color: '#c4b5fd', fontSize: '0.88rem', cursor: 'pointer', flex: '1 1 200px' }}>
            <input type="checkbox" checked={micOn} onChange={toggle(setMicOn)} style={{ accentColor: '#0891b2', width: '17px', height: '17px' }} />
            <Mic size={16} style={{ color: '#22d3ee' }} /> Incluir micrófono (tu voz)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(12,9,35,0.6)', border: '1px solid rgba(124,58,237,0.25)', color: '#c4b5fd', fontSize: '0.88rem', cursor: 'pointer', flex: '1 1 200px' }}>
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
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'white', fontVariantNumeric: 'tabular-nums', marginBottom: '20px' }}>{fmtTime(seconds)}</div>
          <button onClick={stop} className="btn-primary justify-center" style={{ minWidth: '200px' }}>
            <Square size={16} /> Detener grabación
          </button>
        </div>
      ) : videoUrl ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <video src={videoUrl} controls style={{ width: '100%', borderRadius: '14px', border: '1px solid rgba(124,58,237,0.3)', background: '#000' }} />
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
        <p style={{ color: '#6b5fa0', fontSize: '0.8rem', lineHeight: 1.6, textAlign: 'center', margin: 0 }}>
          Funciona en Chrome, Edge o Firefox de escritorio. Al pulsar Grabar, tu navegador te pedirá elegir qué compartir (toda la pantalla, una ventana o una pestaña).
        </p>
      )}
    </div>
  )
}
