import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Icon from '@/components/Icon'
import PostCard from '@/components/PostCard'
import { formatDate } from '@/utils/format'

export const metadata = {
  title: 'Notes | Bernard on the Aux',
  description:
    'Short listening notes, quick impressions, and personal reactions to albums, tracks, and live sessions.',
}

function getCoverUrl(cover: any): string | undefined {
  if (!cover) return undefined
  if (typeof cover === 'string') return cover
  return cover.url || undefined
}

export default async function NotesPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: notes } = await payload.find({
    collection: 'notes',
    where: { published: { equals: true } },
    sort: '-listenedOn',
    depth: 1,
    limit: 100,
  })

  return (
    <div className="container">
      <header className="page-header page-header-note">
        <p className="eyebrow">Listening notes</p>
        <h1 className="title-with-icon">
          <Icon name="note" className="title-icon" />
          Notes
        </h1>
        <p>
          Quick impressions, personal reactions, and short write-ups on what
          I&apos;ve been listening to.
        </p>
      </header>

      <div className="grid">
        {notes.map((n) => (
          <PostCard
            key={n.id}
            title={n.title}
            href={`/notes/${n.slug}/`}
            meta={n.listenedOn ? formatDate(n.listenedOn) : ''}
            excerpt={n.excerpt || undefined}
            label="Note"
            cover={getCoverUrl(n.cover)}
            pillClass="pill-note"
          />
        ))}
      </div>
    </div>
  )
}
