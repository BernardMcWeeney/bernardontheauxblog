import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Icon from '@/components/Icon'
import { formatDate } from '@/utils/format'

function slugifyTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'notes',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  const note = docs[0]
  if (!note) return { title: 'Note Not Found' }

  return {
    title: `${note.title} — Bernard On The Aux`,
    description: note.excerpt || `Listening note: ${note.title}`,
  }
}

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'notes',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })

  const note = docs[0]
  if (!note) notFound()

  const tags = Array.isArray(note.tags) ? note.tags.filter(Boolean) : []

  return (
    <div className="container">
      <div className="post-layout" style={{ maxWidth: '700px' }}>
        {/* Back link */}
        <a href="/notes/" className="post-back">
          &larr; Back to Notes
        </a>

        {/* No banner, no sidebar for notes */}

        <header className="post-header-detail">
          <div className="post-collection-badge badge-note">
            <Icon name="note" /> Listening Note
          </div>
          <h1 className="post-title-detail">{note.title}</h1>
          <div className="post-meta-strip">
            {note.listenedOn && <span>{formatDate(note.listenedOn)}</span>}
            {note.artist && <span>{note.artist}</span>}
            {note.source && <span>{note.source}</span>}
          </div>
        </header>

        <div className="post-body">
          {note.content && <RichText data={note.content} />}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <div className="detail-tags">
              {tags.map((t) => (
                <a
                  key={t}
                  href={`/tags/${slugifyTag(t)}/`}
                  className="detail-tag"
                >
                  {t}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
