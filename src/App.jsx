import './index.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Process from './components/Process'
import Portfolio from './components/Portfolio'
import Pricing from './components/Pricing'
import Clients from './components/Clients'
import Stats from './components/Stats'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import CustomCursor from './components/CustomCursor'
import Particles from './components/Particles'
import CookieBanner from './components/CookieBanner'
import LoadingScreen from './components/LoadingScreen'
import EasterEggGame from './components/EasterEggGame'

export default function App() {
  return (
    <>
      <LoadingScreen />
      <Particles />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Clients />
        <Stats />
        <About />
        <Services />
        <Process />
        <Portfolio />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <CookieBanner />
      <EasterEggGame />
    </>
  )
}
