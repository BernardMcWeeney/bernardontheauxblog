import React from 'react'
import './styles.css'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

export const metadata = {
  title: 'Bernard On The Aux',
  description:
    'A personal, passion-driven music review and listening log. Album reviews, gig diaries, deep dives, playlists, and notes.',
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
