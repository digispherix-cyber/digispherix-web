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
  },
  icons: {
    icon: '/logo-icon.png',
  },
  other: {
    'theme-color': '#0c0923',
  },
}

const schemaData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'DigiSpherix',
  description: 'Diseño de sitios web modernos, desarrollo de Apps Android, marketing digital y soluciones Odoo ERP para empresas en México.',
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
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Odoo ERP' } },
    ],
  },
  sameAs: [],
}

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CustomCursor from '../components/CustomCursor'
import WhatsAppButton from '../components/WhatsAppButton'
import CookieBanner from '../components/CookieBanner'
import EasterEggGame from '../components/EasterEggGame'

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className={inter.className}>
        <CustomCursor />
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
        <CookieBanner />
        <EasterEggGame />
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
        {/* reCAPTCHA Enterprise */}
        <Script
          src="https://www.google.com/recaptcha/enterprise.js?render=6LcO0-IqAAAAALEEILNOliF4SK9iY4mQXQ13cmcf"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
