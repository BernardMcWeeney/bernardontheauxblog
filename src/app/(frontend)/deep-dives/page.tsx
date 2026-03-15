import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Icon from '@/components/Icon'
import PostCard from '@/components/PostCard'
import { formatDate } from '@/utils/format'

export const metadata = {
  title: 'Deep Dives | Bernard on the Aux',
  description:
    'Long-form explorations of artists, genres, eras, and the stories behind the music.',
}

function getCoverUrl(cover: any): string | undefined {
  if (!cover) return undefined
  if (typeof cover === 'string') return cover
  return cover.url || undefined
}

export default async function DeepDivesPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: dives } = await payload.find({
    collection: 'deep-dives',
    where: { published: { equals: true } },
    sort: '-publishedOn',
    depth: 1,
    limit: 100,
  })

  return (
    <div className="container">
      <header className="page-header page-header-dive">
        <p className="eyebrow">Deep dives</p>
        <h1 className="title-with-icon">
          <Icon name="dive" className="title-icon" />
          Deep Dives
        </h1>
        <p>
          Long-form explorations of artists, genres, eras, and the stories behind the music.
        </p>
      </header>

      <div className="grid">
        {dives.map((d) => (
          <PostCard
            key={d.id}
            title={d.title}
            href={`/deep-dives/${d.slug}/`}
            meta={d.publishedOn ? formatDate(d.publishedOn) : ''}
            excerpt={d.excerpt || undefined}
            label="Deep Dive"
            cover={getCoverUrl(d.cover)}
            pillClass="pill-dive"
          />
        ))}
      </div>
    </div>
  )
}
