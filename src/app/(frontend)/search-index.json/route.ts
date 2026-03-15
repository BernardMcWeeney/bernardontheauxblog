import { getPayload } from 'payload'
import configPromise from '@payload-config'

interface SearchIndexEntry {
  title: string
  href: string
  collection: string
  date: string
  excerpt: string
  artist: string
  tags: string[]
}

export async function GET() {
  const payload = await getPayload({ config: configPromise })

  const [reviews, gigs, deepDives, playlists, notes] = await Promise.all([
    payload.find({
      collection: 'reviews',
      where: { published: { equals: true } },
      limit: 500,
      depth: 0,
    }),
    payload.find({
      collection: 'gigs',
      where: { published: { equals: true } },
      limit: 500,
      depth: 0,
    }),
    payload.find({
      collection: 'deep-dives',
      where: { published: { equals: true } },
      limit: 500,
      depth: 0,
    }),
    payload.find({
      collection: 'playlists',
      where: { published: { equals: true } },
      limit: 500,
      depth: 0,
    }),
    payload.find({
      collection: 'notes',
      where: { published: { equals: true } },
      limit: 500,
      depth: 0,
    }),
  ])

  const entries: SearchIndexEntry[] = []

  for (const doc of reviews.docs as any[]) {
    entries.push({
      title: doc.title,
      href: `/reviews/${doc.slug}`,
      collection: 'reviews',
      date: doc.reviewDate || doc.createdAt,
      excerpt: doc.excerpt || '',
      artist: doc.artist || '',
      tags: Array.isArray(doc.tags) ? doc.tags : [],
    })
  }

  for (const doc of gigs.docs as any[]) {
    entries.push({
      title: doc.title,
      href: `/gigs/${doc.slug}`,
      collection: 'gigs',
      date: doc.eventDate || doc.createdAt,
      excerpt: doc.excerpt || '',
      artist: doc.artist || '',
      tags: Array.isArray(doc.tags) ? doc.tags : [],
    })
  }

  for (const doc of deepDives.docs as any[]) {
    entries.push({
      title: doc.title,
      href: `/deep-dives/${doc.slug}`,
      collection: 'deep-dives',
      date: doc.publishedOn || doc.createdAt,
      excerpt: doc.excerpt || '',
      artist: '',
      tags: Array.isArray(doc.tags) ? doc.tags : [],
    })
  }

  for (const doc of playlists.docs as any[]) {
    entries.push({
      title: doc.title,
      href: `/playlists/${doc.slug}`,
      collection: 'playlists',
      date: doc.publishedOn || doc.createdAt,
      excerpt: doc.excerpt || '',
      artist: '',
      tags: Array.isArray(doc.tags) ? doc.tags : [],
    })
  }

  for (const doc of notes.docs as any[]) {
    entries.push({
      title: doc.title,
      href: `/notes/${doc.slug}`,
      collection: 'notes',
      date: doc.listenedOn || doc.createdAt,
      excerpt: doc.excerpt || '',
      artist: doc.artist || '',
      tags: Array.isArray(doc.tags) ? doc.tags : [],
    })
  }

  // Sort by date descending
  entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return new Response(JSON.stringify(entries), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
