import React from 'react'
import './styles.css'

export const dynamic = 'force-dynamic'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600&family=Space+Grotesk:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
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
