import { getPayload } from 'payload'
import configPromise from '@payload-config'

const SITE_TITLE = 'Bernard On The Aux'
const SITE_URL = 'https://bernardontheaux.com'
const SITE_DESCRIPTION =
  'A personal, passion-driven music review and listening log. Album reviews, gig diaries, deep dives, playlists, and listening notes.'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toRFC822(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.valueOf())) return ''
  return d.toUTCString()
}

interface FeedItem {
  title: string
  link: string
  description: string
  pubDate: string
  guid: string
}

export async function GET() {
  const payload = await getPayload({ config: configPromise })

  const [reviews, gigs, deepDives, playlists, notes] = await Promise.all([
    payload.find({
      collection: 'reviews',
      where: { published: { equals: true } },
      limit: 500,
      depth: 0,
      sort: '-reviewDate',
    }),
    payload.find({
      collection: 'gigs',
      where: { published: { equals: true } },
      limit: 500,
      depth: 0,
      sort: '-eventDate',
    }),
    payload.find({
      collection: 'deep-dives',
      where: { published: { equals: true } },
      limit: 500,
      depth: 0,
      sort: '-publishedOn',
    }),
    payload.find({
      collection: 'playlists',
      where: { published: { equals: true } },
      limit: 500,
      depth: 0,
      sort: '-publishedOn',
    }),
    payload.find({
      collection: 'notes',
      where: { published: { equals: true } },
      limit: 500,
      depth: 0,
      sort: '-listenedOn',
    }),
  ])

  const items: FeedItem[] = []

  for (const doc of reviews.docs as any[]) {
    const displayTitle = doc.artist ? `${doc.artist} \u2014 ${doc.title}` : doc.title
    items.push({
      title: displayTitle,
      link: `${SITE_URL}/reviews/${doc.slug}`,
      description: doc.excerpt || '',
      pubDate: doc.reviewDate || doc.createdAt,
      guid: `${SITE_URL}/reviews/${doc.slug}`,
    })
  }

  for (const doc of gigs.docs as any[]) {
    items.push({
      title: doc.title,
      link: `${SITE_URL}/gigs/${doc.slug}`,
      description: doc.excerpt || '',
      pubDate: doc.eventDate || doc.createdAt,
      guid: `${SITE_URL}/gigs/${doc.slug}`,
    })
  }

  for (const doc of deepDives.docs as any[]) {
    items.push({
      title: doc.title,
      link: `${SITE_URL}/deep-dives/${doc.slug}`,
      description: doc.excerpt || '',
      pubDate: doc.publishedOn || doc.createdAt,
      guid: `${SITE_URL}/deep-dives/${doc.slug}`,
    })
  }

  for (const doc of playlists.docs as any[]) {
    items.push({
      title: doc.title,
      link: `${SITE_URL}/playlists/${doc.slug}`,
      description: doc.excerpt || '',
      pubDate: doc.publishedOn || doc.createdAt,
      guid: `${SITE_URL}/playlists/${doc.slug}`,
    })
  }

  for (const doc of notes.docs as any[]) {
    items.push({
      title: doc.title,
      link: `${SITE_URL}/notes/${doc.slug}`,
      description: doc.excerpt || '',
      pubDate: doc.listenedOn || doc.createdAt,
      guid: `${SITE_URL}/notes/${doc.slug}`,
    })
  }

  // Sort all items by date descending
  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  const rssItems = items
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${toRFC822(item.pubDate)}</pubDate>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
    </item>`,
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
