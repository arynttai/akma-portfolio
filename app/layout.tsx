import type {Metadata, Viewport} from 'next'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/dm-sans/latin-400.css'
import '@fontsource/dm-sans/latin-600.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/instrument-serif/latin-400-italic.css'
import './globals.css'
import './v3.css'

const origin = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : undefined)
const title = 'Akmaral Aryntay — Software Engineer, Astana'
const description = 'Akma’s digital universe: IoT products at Freedom Cloud Holding, an AI assistant, a livestock tracker, a 3D room from one photo, and a clay-style mini me who shows you around.'

export const metadata: Metadata = {
  metadataBase: new URL(origin || 'http://localhost:4173'),
  title: {default: title, template: '%s — Akmaral Aryntay'},
  description,
  ...(origin ? {alternates: {canonical: '/'}} : {}),
  icons: {icon: '/icon.svg'},
  openGraph: {type: 'website', title, description, images: [{url: '/social.jpg', width: 1200, height: 630, alt: 'Akmaral Aryntay portfolio with a clay-style 3D mini character at a desk'}]},
  twitter: {card: 'summary_large_image', title, description, images: ['/social.jpg']}
}
export const viewport: Viewport = {themeColor: '#f4eee3', width: 'device-width', initialScale: 1}

const jsonLd = {
  '@context': 'https://schema.org', '@type': 'Person', name: 'Akmaral Aryntay', jobTitle: 'Software Engineer',
  address: {'@type': 'PostalAddress', addressLocality: 'Astana', addressCountry: 'KZ'},
  alumniOf: 'Astana IT University', sameAs: ['https://github.com/arynttai', 'https://www.linkedin.com/in/aryntay/']
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return <html lang="en" suppressHydrationWarning>
    <head>
      <script dangerouslySetInnerHTML={{__html: "document.documentElement.classList.add('js');try{var t=localStorage.getItem('theme');if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t}catch(e){}"}}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
    </head>
    <body><a className="skip" href="#main">Skip to content</a>{children}</body>
  </html>
}
