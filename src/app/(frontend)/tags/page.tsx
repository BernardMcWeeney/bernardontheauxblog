import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const metadata: Metadata = {
  title: 'Tags | Bernard On The Aux',
  description: 'Browse all tags across reviews, gigs, deep dives, playlists, and notes.',
}

function slugifyTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default async function TagsPage() {
  const payload = await getPayload({ config: configPromise })

  const [reviews, gigs, deepDives, playlists, notes] = await Promise.all([
    payload.find({ collection: 'reviews', where: { published: { equals: true } }, limit: 500, depth: 0 }),
    payload.find({ collection: 'gigs', where: { published: { equals: true } }, limit: 500, depth: 0 }),
    payload.find({ collection: 'deep-dives', where: { published: { equals: true } }, limit: 500, depth: 0 }),
    payload.find({ collection: 'playlists', where: { published: { equals: true } }, limit: 500, depth: 0 }),
    payload.find({ collection: 'notes', where: { published: { equals: true } }, limit: 500, depth: 0 }),
  ])

  const allDocs = [
    ...reviews.docs,
    ...gigs.docs,
    ...deepDives.docs,
    ...playlists.docs,
    ...notes.docs,
  ]

  const tagCounts: Record<string, { display: string; count: number }> = {}

  for (const doc of allDocs) {
    const tags = (doc as any).tags
    if (!Array.isArray(tags)) continue
    for (const tag of tags) {
      if (typeof tag !== 'string' || !tag.trim()) continue
      const slug = slugifyTag(tag)
      if (!tagCounts[slug]) {
        tagCounts[slug] = { display: tag, count: 0 }
      }
      tagCounts[slug].count++
    }
  }

  const sortedTags = Object.entries(tagCounts).sort((a, b) =>
    a[1].display.toLowerCase().localeCompare(b[1].display.toLowerCase()),
  )

  return (
    <div className="container">
      <header className="page-header">
        <p className="eyebrow">Browse</p>
        <h1>Tags</h1>
      </header>

      <div className="detail-tags" style={{ gap: '0.5rem' }}>
        {sortedTags.map(([slug, { display, count }]) => (
          <a key={slug} href={`/tags/${slug}`} className="detail-tag">
            {display} ({count})
          </a>
        ))}
        {sortedTags.length === 0 && (
          <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>No tags yet.</p>
        )}
      </div>
    </div>
  )
}
