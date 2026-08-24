import Hero from '../components/Hero'
import TechMarquee from '../components/TechMarquee'
import About from '../components/About'
import Services from '../components/Services'
import ToolsHighlight from '../components/ToolsHighlight'
import Process from '../components/Process'
import Portfolio from '../components/Portfolio'
import BuilderStudio from '../components/BuilderStudio'
import Pricing from '../components/Pricing'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'
import Particles from '../components/Particles'
import LoadingScreen from '../components/LoadingScreen'
import ExitIntentPopup from '../components/ExitIntentPopup'

// Canonical del home (evita contenido duplicado con www / parámetros).
export const metadata = {
  alternates: { canonical: 'https://digispherix.com.mx' },
}

// Datos estructurados de Servicios (JSON-LD) para que Google entienda qué
// ofrece la agencia. Complementa el LocalBusiness del layout.
const servicesSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    'Diseño y Desarrollo Web',
    'Desarrollo de Apps Android',
    'Marketing Digital',
    'SEO y Publicidad Digital',
    'Soluciones TI y Software a Medida',
    'Soporte y Mantenimiento Web',
  ].map((name, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Service',
      name,
      provider: { '@type': 'Organization', name: 'DigiSpherix', url: 'https://digispherix.com.mx' },
      areaServed: { '@type': 'Country', name: 'México' },
    },
  })),
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      <LoadingScreen />
      <Particles />
      <main>
        <Hero />
        <TechMarquee />
        <About />
<Services />
        <Process />
        <Portfolio />
        <BuilderStudio />
        <Pricing />
        <Testimonials />
        <ToolsHighlight />
        <FAQ />
        <Contact />
      </main>
      <ExitIntentPopup />
    </>
  )
}
