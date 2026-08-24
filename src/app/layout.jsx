import './globals.css'
import Script from 'next/script'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'DigiSpherix – Diseño Web & Apps Android en México',
  description: 'DigiSpherix: Diseño de sitios web modernos, desarrollo de Apps Android, marketing digital y soluciones empresariales en México. Contáctanos hoy.',
  metadataBase: new URL('https://digispherix.com.mx'),
  openGraph: {
    title: 'DigiSpherix – Diseño Web & Apps Android',
    description: 'Transformamos ideas en experiencias digitales. Sitios web, apps Android y marketing digital.',
    url: 'https://digispherix.com.mx',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'YnU51Av7jMSPfsvuTQXGZknhH0gxQFuTR8wY0wieDVM',
    other: {
      'facebook-domain-verification': 'j9smv6rv81q5j514r2u499dk2hs0if',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },
  other: {
    'theme-color': '#0c0923',
    'google-adsense-account': 'ca-pub-7425317474892420',
  },
}

// Schema WebSite: refuerza la identidad del sitio para Google (marca, idioma).
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'DigiSpherix',
  url: 'https://digispherix.com.mx',
  inLanguage: 'es-MX',
  publisher: {
    '@type': 'Organization',
    name: 'DigiSpherix',
    url: 'https://digispherix.com.mx',
    logo: 'https://digispherix.com.mx/logo-square.png',
  },
}

const schemaData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'DigiSpherix',
  description: 'Diseño de sitios web modernos, desarrollo de Apps Android, marketing digital y soluciones TI para empresas en México.',
  url: 'https://digispherix.com.mx',
  logo: 'https://digispherix.com.mx/logo-square.png',
  image: 'https://digispherix.com.mx/og-image.jpg',
  telephone: '+523320318435',
  email: 'info@digispherix.com.mx',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'MX',
    addressRegion: 'Jalisco',
    addressLocality: 'México',
  },
  priceRange: '$$',
  currenciesAccepted: 'MXN',
  paymentAccepted: 'Transferencia, Efectivo',
  serviceArea: { '@type': 'Country', name: 'México' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios DigiSpherix',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Diseño Web' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Apps Android' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Marketing Digital' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Soluciones TI' } },
    ],
  },
  sameAs: [],
}

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CustomCursor from '../components/CustomCursor'
import MagneticButtons from '../components/MagneticButtons'
import WhatsAppButton from '../components/WhatsAppButton'
import CookieBanner from '../components/CookieBanner'
import EasterEggGame from '../components/EasterEggGame'

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Aplica el tema guardado ANTES de pintar, para que no haya parpadeo
            entre oscuro (default) y el tema que el usuario eligió antes.
            suppressHydrationWarning en <html> es necesario porque este script
            cambia un atributo del servidor (que no sabe del localStorage) antes
            de que React hidrate; es el patrón oficial para esto, no un parche. */}
        <script
          dangerouslySetInnerHTML={{ __html: `
            try {
              var t = localStorage.getItem('theme');
              if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
            } catch (e) {}
          ` }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          dangerouslySetInnerHTML={{ __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '3970786243063388');
            fbq('track', 'PageView');
          `}}
        />
        <noscript dangerouslySetInnerHTML={{ __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=3970786243063388&ev=PageView&noscript=1"/>` }} />
      </head>
      <body className={inter.className}>
        <CustomCursor />
        <MagneticButtons />
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
        <CookieBanner />
        <EasterEggGame />
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7425317474892420"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PHN5G7P9L7"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PHN5G7P9L7');
          `}
        </Script>
      </body>
    </html>
  )
}
