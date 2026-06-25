import './index.css'
import { lazy, Suspense } from 'react'

// Above-fold — eager (must paint immediately)
import LoadingScreen from './components/LoadingScreen'
import Particles from './components/Particles'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import EasterEggGame from './components/EasterEggGame'

// Below-fold — lazy (split into separate chunks)
const About       = lazy(() => import('./components/About'))
const Services    = lazy(() => import('./components/Services'))
const Process     = lazy(() => import('./components/Process'))
const Portfolio   = lazy(() => import('./components/Portfolio'))
const Pricing     = lazy(() => import('./components/Pricing'))
const Testimonials= lazy(() => import('./components/Testimonials'))
const FAQ         = lazy(() => import('./components/FAQ'))
const Contact     = lazy(() => import('./components/Contact'))
const Footer      = lazy(() => import('./components/Footer'))
const WhatsAppButton = lazy(() => import('./components/WhatsAppButton'))
const CookieBanner   = lazy(() => import('./components/CookieBanner'))

export default function App() {
  return (
    <>
      <LoadingScreen />
      <Particles />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <About />
          <Services />
          <Process />
          <Portfolio />
          <Pricing />
          <Testimonials />
          <FAQ />
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
        <WhatsAppButton />
        <CookieBanner />
      </Suspense>
      <EasterEggGame />
    </>
  )
}
