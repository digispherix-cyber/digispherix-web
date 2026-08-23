import Hero from '../components/Hero'
import TechMarquee from '../components/TechMarquee'
import About from '../components/About'
import Services from '../components/Services'
import ToolsHighlight from '../components/ToolsHighlight'
import Process from '../components/Process'
import Portfolio from '../components/Portfolio'
import SiteBuilder from '../components/SiteBuilder'
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
        <TechMarquee />
        <About />
<Services />
        <Process />
        <Portfolio />
        <SiteBuilder />
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
