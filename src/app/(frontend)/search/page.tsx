import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import SearchClient from './SearchClient'

export const metadata: Metadata = {
  title: 'Search | Bernard On The Aux',
  description:
    'Search across all album reviews, gig diaries, deep dives, playlists, and listening notes.',
}

function getCoverUrl(cover: any): string | undefined {
  if (!cover) return undefined
  if (typeof cover === 'string') return cover
  return cover.url || undefined
}

interface SearchItem {
  title: string
  href: string
  collection: string
  collectionLabel: string
  excerpt: string
  artist: string
  tags: string[]
  date: string
  coverUrl?: string
}

export default async function SearchPage() {
  const payload = await getPayload({ config: configPromise })

  const [reviews, gigs, deepDives, playlists, notes] = await Promise.all([
    payload.find({ collection: 'reviews', where: { published: { equals: true } }, limit: 500, depth: 1 }),
    payload.find({ collection: 'gigs', where: { published: { equals: true } }, limit: 500, depth: 1 }),
    payload.find({ collection: 'deep-dives', where: { published: { equals: true } }, limit: 500, depth: 1 }),
    payload.find({ collection: 'playlists', where: { published: { equals: true } }, limit: 500, depth: 1 }),
    payload.find({ collection: 'notes', where: { published: { equals: true } }, limit: 500, depth: 1 }),
  ])

  const items: SearchItem[] = [
    ...reviews.docs.map((doc: any) => ({
      title: doc.title,
      href: `/reviews/${doc.slug}`,
      collection: 'reviews',
      collectionLabel: 'Review',
      excerpt: doc.excerpt || '',
      artist: doc.artist || '',
      tags: Array.isArray(doc.tags) ? doc.tags : [],
      date: doc.reviewDate || doc.createdAt,
      coverUrl: getCoverUrl(doc.cover),
    })),
    ...gigs.docs.map((doc: any) => ({
      title: doc.title,
      href: `/gigs/${doc.slug}`,
      collection: 'gigs',
      collectionLabel: 'Gig',
      excerpt: doc.excerpt || '',
      artist: doc.artist || '',
      tags: Array.isArray(doc.tags) ? doc.tags : [],
      date: doc.eventDate || doc.createdAt,
      coverUrl: getCoverUrl(doc.cover),
    })),
    ...deepDives.docs.map((doc: any) => ({
      title: doc.title,
      href: `/deep-dives/${doc.slug}`,
      collection: 'deep-dives',
      collectionLabel: 'Deep Dive',
      excerpt: doc.excerpt || '',
      artist: '',
      tags: Array.isArray(doc.tags) ? doc.tags : [],
      date: doc.publishedOn || doc.createdAt,
      coverUrl: getCoverUrl(doc.cover),
    })),
    ...playlists.docs.map((doc: any) => ({
      title: doc.title,
      href: `/playlists/${doc.slug}`,
      collection: 'playlists',
      collectionLabel: 'Playlist',
      excerpt: doc.excerpt || '',
      artist: '',
      tags: Array.isArray(doc.tags) ? doc.tags : [],
      date: doc.publishedOn || doc.createdAt,
      coverUrl: getCoverUrl(doc.cover),
    })),
    ...notes.docs.map((doc: any) => ({
      title: doc.title,
      href: `/notes/${doc.slug}`,
      collection: 'notes',
      collectionLabel: 'Note',
      excerpt: doc.excerpt || '',
      artist: doc.artist || '',
      tags: Array.isArray(doc.tags) ? doc.tags : [],
      date: doc.listenedOn || doc.createdAt,
      coverUrl: getCoverUrl(doc.cover),
    })),
  ]

  return <SearchClient items={items} />
}
