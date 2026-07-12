import Hero from '../components/Hero'
import About from '../components/About'
import Services from '../components/Services'
import ToolsHighlight from '../components/ToolsHighlight'
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
<Services />
        <Process />
        <Portfolio />
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
