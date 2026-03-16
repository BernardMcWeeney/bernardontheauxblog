'use client'

import Link from 'next/link'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Icon from '@/components/Icon'
import { formatDate } from '@/utils/format'
import { getArtistName } from '@/utils/artist'

function slugifyTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function NoteDetail({ initialData, serverURL }: { initialData: any; serverURL: string }) {
  const { data: note } = useLivePreview({
    initialData,
    serverURL,
    depth: 1,
  })

  const tags: string[] = Array.isArray(note.tags) ? note.tags.filter(Boolean) : []

  return (
    <div className="container">
      <div className="post-layout" style={{ maxWidth: '700px' }}>
        <Link href="/notes/" className="post-back">
          &larr; Back to Notes
        </Link>

        <header className="post-header-detail">
          <div className="post-collection-badge badge-note">
            <Icon name="note" /> Listening Note
          </div>
          <h1 className="post-title-detail">{note.title}</h1>
          <div className="post-meta-strip">
            {note.listenedOn && <span>{formatDate(note.listenedOn)}</span>}
            {getArtistName(note.artist) && <span>{getArtistName(note.artist)}</span>}
            {note.source && <span>{note.source}</span>}
          </div>
        </header>

        <div className="post-body">
          {note.content && <RichText data={note.content} />}
        </div>

        {tags.length > 0 && (
          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <div className="detail-tags">
              {tags.map((t) => (
                <a key={t} href={`/tags/${slugifyTag(t)}/`} className="detail-tag">
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
