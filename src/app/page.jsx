import Hero from '../components/Hero'
import About from '../components/About'
import Logo3DSection from '../components/Logo3DSection'
import Services from '../components/Services'
import Process from '../components/Process'
import Portfolio from '../components/Portfolio'
import Pricing from '../components/Pricing'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'
import Particles from '../components/Particles'
import LoadingScreen from '../components/LoadingScreen'
import ExitIntentPopup from '../components/ExitIntentPopup'

export default function HomePage() {
  return (
    <>
      <LoadingScreen />
      <Particles />
      <main>
        <Hero />
        <About />
        <Logo3DSection />
        <Services />
        <Process />
        <Portfolio />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <ExitIntentPopup />
    </>
  )
}
