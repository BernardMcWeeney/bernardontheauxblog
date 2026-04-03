import React from 'react'
import './styles.css'
import { Cormorant_Garamond, Manrope, Space_Grotesk } from 'next/font/google'

export const dynamic = 'force-dynamic'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-heading',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-body',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-label',
})

export const metadata = {
  metadataBase: new URL('https://bernardontheaux.com'),
  title: {
    default: 'Bernard On The Aux',
    template: '%s',
  },
  description:
    'A personal, passion-driven music review and listening log. Album reviews, gig diaries, deep dives, playlists, and notes.',
  openGraph: {
    type: 'website',
    siteName: 'Bernard On The Aux',
    locale: 'en_IE',
  },
  twitter: {
    card: 'summary',
  },
  alternates: {
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Bernard On The Aux RSS Feed"
          href="/rss.xml"
        />
      </head>
      <body>
        <div className="site">
          <SiteHeader />
          <main className="page">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
