'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="rounded-2xl shadow-2xl"
            style={{
              background: 'rgba(17,13,48,0.97)',
              border: '1px solid rgba(37,211,102,0.3)',
              backdropFilter: 'blur(20px)',
              width: '288px',
              padding: '24px 28px',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(37,211,102,0.2)' }}
              >
                <MessageCircle size={20} style={{ color: '#25D366' }} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">DigiSpherix</div>
                <div className="text-xs" style={{ color: '#25D366' }}>● En línea</div>
              </div>
            </div>
            <p className="text-sm text-purple-300 mb-4 leading-relaxed">
              ¡Hola! 👋 ¿Tienes un proyecto en mente? Escríbenos y te respondemos al instante.
            </p>
            <a
              href="https://wa.me/523320318435?text=Hola%20DigiSpherix!%20Me%20interesa%20conocer%20sus%20servicios."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
              style={{ background: '#25D366' }}
            >
              <MessageCircle size={16} />
              Chatear ahora
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Cerrar chat de WhatsApp' : 'Abrir chat de WhatsApp'}
        aria-expanded={open}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: '#25D366' }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
              <X size={24} color="white" />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
              <MessageCircle size={24} color="white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

