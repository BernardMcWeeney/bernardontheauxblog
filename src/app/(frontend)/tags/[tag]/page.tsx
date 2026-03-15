import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import PostCard from '@/components/PostCard'
import { formatDate } from '@/utils/format'

function slugifyTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const { tag } = await params
  const displayTag = decodeURIComponent(tag).replace(/-/g, ' ')
  return {
    title: `${displayTag} | Bernard On The Aux`,
    description: `Posts tagged "${displayTag}" on Bernard On The Aux.`,
  }
}

interface TaggedPost {
  title: string
  href: string
  collection: string
  date: string
  excerpt: string
  coverUrl?: string
  rating?: number
}

export default async function TagDetailPage({
  params,
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag } = await params
  const tagSlug = decodeURIComponent(tag)

  const payload = await getPayload({ config: configPromise })

  const [reviews, gigs, deepDives, playlists, notes] = await Promise.all([
    payload.find({ collection: 'reviews', where: { published: { equals: true } }, limit: 500, depth: 1 }),
    payload.find({ collection: 'gigs', where: { published: { equals: true } }, limit: 500, depth: 1 }),
    payload.find({ collection: 'deep-dives', where: { published: { equals: true } }, limit: 500, depth: 1 }),
    payload.find({ collection: 'playlists', where: { published: { equals: true } }, limit: 500, depth: 1 }),
    payload.find({ collection: 'notes', where: { published: { equals: true } }, limit: 500, depth: 1 }),
  ])

  function hasTag(doc: any): boolean {
    if (!Array.isArray(doc.tags)) return false
    return doc.tags.some((t: string) => slugifyTag(t) === tagSlug)
  }

  const posts: TaggedPost[] = [
    ...reviews.docs.filter(hasTag).map((doc: any) => ({
      title: doc.title,
      href: `/reviews/${doc.slug}`,
      collection: 'reviews',
      date: doc.reviewDate || doc.createdAt,
      excerpt: doc.excerpt || '',
      coverUrl: getCoverUrl(doc.cover),
      rating: doc.rating,
    })),
    ...gigs.docs.filter(hasTag).map((doc: any) => ({
      title: doc.title,
      href: `/gigs/${doc.slug}`,
      collection: 'gigs',
      date: doc.eventDate || doc.createdAt,
      excerpt: doc.excerpt || '',
      coverUrl: getCoverUrl(doc.cover),
    })),
    ...deepDives.docs.filter(hasTag).map((doc: any) => ({
      title: doc.title,
      href: `/deep-dives/${doc.slug}`,
      collection: 'deep-dives',
      date: doc.publishedOn || doc.createdAt,
      excerpt: doc.excerpt || '',
      coverUrl: getCoverUrl(doc.cover),
    })),
    ...playlists.docs.filter(hasTag).map((doc: any) => ({
      title: doc.title,
      href: `/playlists/${doc.slug}`,
      collection: 'playlists',
      date: doc.publishedOn || doc.createdAt,
      excerpt: doc.excerpt || '',
      coverUrl: getCoverUrl(doc.cover),
    })),
    ...notes.docs.filter(hasTag).map((doc: any) => ({
      title: doc.title,
      href: `/notes/${doc.slug}`,
      collection: 'notes',
      date: doc.listenedOn || doc.createdAt,
      excerpt: doc.excerpt || '',
      coverUrl: getCoverUrl(doc.cover),
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Derive a display name from the first matching tag
  let displayTag = tagSlug.replace(/-/g, ' ')
  for (const doc of [
    ...reviews.docs,
    ...gigs.docs,
    ...deepDives.docs,
    ...playlists.docs,
    ...notes.docs,
  ]) {
    const tags = (doc as any).tags
    if (Array.isArray(tags)) {
      const match = tags.find((t: string) => slugifyTag(t) === tagSlug)
      if (match) {
        displayTag = match
        break
      }
    }
  }

  return (
    <div className="container">
      <header className="page-header">
        <p className="eyebrow">Tag</p>
        <h1>{displayTag}</h1>
        <p>
          {posts.length} post{posts.length === 1 ? '' : 's'}
        </p>
      </header>

      <div className="grid">
        {posts.map((post) => (
          <PostCard
            key={post.href}
            title={post.title}
            href={post.href}
            meta={formatDate(post.date)}
            excerpt={post.excerpt}
            label={COLLECTION_LABEL[post.collection]}
            cover={post.coverUrl}
            rating={post.rating}
            pillClass={PILL_CLASS[post.collection]}
          />
        ))}
      </div>

      {posts.length === 0 && (
        <p style={{ color: 'var(--muted)', fontStyle: 'italic', marginTop: '1rem' }}>
          No posts found with this tag.
        </p>
      )}
    </div>
  )
}
