import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Icon from '@/components/Icon'
import { formatDate } from '@/utils/format'

export const metadata: Metadata = {
  title: 'Archive | Bernard On The Aux',
  description: 'Browse the full archive of reviews, gigs, deep dives, playlists, and notes.',
}

function getCoverUrl(cover: any): string | undefined {
  if (!cover) return undefined
  if (typeof cover === 'string') return cover
  return cover.url || undefined
}

const PILL_CLASS: Record<string, string> = {
  reviews: 'pill-review',
  gigs: 'pill-gig',
  'deep-dives': 'pill-dive',
  playlists: 'pill-playlist',
  notes: 'pill-note',
}

const COLLECTION_LABEL: Record<string, string> = {
  reviews: 'Review',
  gigs: 'Gig',
  'deep-dives': 'Deep Dive',
  playlists: 'Playlist',
  notes: 'Note',
}

interface ArchiveItem {
  title: string
  href: string
  collection: string
  date: string
}

export default async function ArchivePage() {
  const payload = await getPayload({ config: configPromise })

  const [reviews, gigs, deepDives, playlists, notes] = await Promise.all([
    payload.find({ collection: 'reviews', where: { published: { equals: true } }, limit: 500, depth: 0 }),
    payload.find({ collection: 'gigs', where: { published: { equals: true } }, limit: 500, depth: 0 }),
    payload.find({ collection: 'deep-dives', where: { published: { equals: true } }, limit: 500, depth: 0 }),
    payload.find({ collection: 'playlists', where: { published: { equals: true } }, limit: 500, depth: 0 }),
    payload.find({ collection: 'notes', where: { published: { equals: true } }, limit: 500, depth: 0 }),
  ])

  const items: ArchiveItem[] = [
    ...reviews.docs.map((doc: any) => ({
      title: doc.title,
      href: `/reviews/${doc.slug}`,
      collection: 'reviews',
      date: doc.reviewDate || doc.createdAt,
    })),
    ...gigs.docs.map((doc: any) => ({
      title: doc.title,
      href: `/gigs/${doc.slug}`,
      collection: 'gigs',
      date: doc.eventDate || doc.createdAt,
    })),
    ...deepDives.docs.map((doc: any) => ({
      title: doc.title,
      href: `/deep-dives/${doc.slug}`,
      collection: 'deep-dives',
      date: doc.publishedOn || doc.createdAt,
    })),
    ...playlists.docs.map((doc: any) => ({
      title: doc.title,
      href: `/playlists/${doc.slug}`,
      collection: 'playlists',
      date: doc.publishedOn || doc.createdAt,
    })),
    ...notes.docs.map((doc: any) => ({
      title: doc.title,
      href: `/notes/${doc.slug}`,
      collection: 'notes',
      date: doc.listenedOn || doc.createdAt,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="container">
      <header className="page-header">
        <p className="eyebrow">Archive</p>
        <h1 className="title-with-icon">
          <Icon name="archive" className="title-icon" />
          Archive
        </h1>
        <p>Everything published, newest first.</p>
      </header>

      <ul className="archive-list">
        {items.map((item) => (
          <li key={item.href} className="archive-item">
            <a href={item.href}>{item.title}</a>
            <div className="archive-meta">
              <span className={`pill ${PILL_CLASS[item.collection] || ''}`}>
                {COLLECTION_LABEL[item.collection] || item.collection}
              </span>
              <span>{formatDate(item.date)}</span>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <li style={{ color: 'var(--muted)', fontStyle: 'italic' }}>No posts yet.</li>
        )}
      </ul>
    </div>
  )
}
