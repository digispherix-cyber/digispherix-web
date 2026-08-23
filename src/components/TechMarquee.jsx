'use client'

import {
  siReact, siNextdotjs, siKotlin, siAndroid, siWordpress, siPrestashop, siFirebase, siTailwindcss,
  siJavascript, siPython, siPhp, siNodedotjs, siLinux, siGoogleads, siFigma, siVercel,
  siGoogleanalytics, siGooglesearchconsole, siGooglecloud, siShopify,
} from 'simple-icons'
import { Cloud } from 'lucide-react'

// Franja tipo "marquee" con el stack tecnológico deslizándose en loop
// infinito. Cada tecnología usa su logo oficial (paquete simple-icons,
// empaquetado local) coloreado con un tono seguro para ambos temas. La
// animación se hace en CSS (globals.css: .tech-marquee-track), se pausa al
// pasar el cursor y se detiene con prefers-reduced-motion.

const TECH = [
  { name: 'React', icon: siReact, color: '#61DAFB' },
  { name: 'Next.js', icon: siNextdotjs, color: '#a855f7' },
  { name: 'Kotlin', icon: siKotlin, color: '#a97bff' },
  { name: 'Android', icon: siAndroid, color: '#3DDC84' },
  { name: 'WordPress', icon: siWordpress, color: '#3aa0d1' },
  { name: 'PrestaShop', icon: siPrestashop, color: '#ec4d94' },
  { name: 'Firebase', icon: siFirebase, color: '#FFCA28' },
  { name: 'Tailwind CSS', icon: siTailwindcss, color: '#38BDF8' },
  { name: 'JavaScript', icon: siJavascript, color: '#EAB308' },
  { name: 'Python', icon: siPython, color: '#5b9bd5' },
  { name: 'PHP', icon: siPhp, color: '#9199d6' },
  { name: 'Node.js', icon: siNodedotjs, color: '#6bbf4e' },
  { name: 'Azure', Lucide: Cloud, color: '#3b9eff' },
  { name: 'Linux', icon: siLinux, color: '#FCC624' },
  { name: 'Google Ads', icon: siGoogleads, color: '#4285F4' },
  { name: 'Google Analytics', icon: siGoogleanalytics, color: '#F0850B' },
  { name: 'Search Console', icon: siGooglesearchconsole, color: '#458CF5' },
  { name: 'Google Cloud', icon: siGooglecloud, color: '#4285F4' },
  { name: 'Shopify', icon: siShopify, color: '#8bc34a' },
  { name: 'Figma', icon: siFigma, color: '#F24E1E' },
  { name: 'Vercel', icon: siVercel, color: '#c026d3' },
]

function Chip({ name, icon, Lucide, color }) {
  return (
    <span
      className="tech-chip"
      title={name}
      aria-label={name}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '64px', height: '64px', borderRadius: '50%', flexShrink: 0,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
      }}
    >
      {icon ? (
        // Logo oficial de marca (simple-icons): SVG de una sola ruta, relleno.
        <svg
          role="img"
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="26"
          height="26"
          fill={color}
          style={{ flexShrink: 0, filter: `drop-shadow(0 0 6px ${color}55)` }}
        >
          <path d={icon.path} />
        </svg>
      ) : (
        // Ícono genérico (lucide) para conceptos sin logo de marca.
        <Lucide size={26} color={color} style={{ flexShrink: 0, filter: `drop-shadow(0 0 6px ${color}55)` }} />
      )}
    </span>
  )
}

export default function TechMarquee() {
  // Se duplica la lista para que el desplazamiento de -50% sea un loop sin costura.
  const items = [...TECH, ...TECH]

  return (
    <section aria-label="Tecnologías que usamos" style={{ padding: '48px 0', position: 'relative', color: 'var(--text)' }}>
      <p
        className="text-center font-semibold tracking-widest uppercase"
        style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '28px' }}
      >
        Tecnologías que dominamos
      </p>

      <div className="tech-marquee">
        <div className="tech-marquee-track">
          {items.map((t, i) => (
            <Chip key={`${t.name}-${i}`} name={t.name} icon={t.icon} Lucide={t.Lucide} color={t.color} />
          ))}
        </div>
      </div>
    </section>
  )
}
