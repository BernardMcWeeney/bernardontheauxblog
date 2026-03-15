import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Icon from '@/components/Icon'
import PostCard from '@/components/PostCard'
import { formatDate } from '@/utils/format'
import { PlaylistFilters } from './PlaylistsClient'

export const metadata = {
  title: 'Playlists | Bernard on the Aux',
  description: 'Curated sequences tied to posts, themes, or moods.',
}

function getCoverUrl(cover: any): string | undefined {
  if (!cover) return undefined
  if (typeof cover === 'string') return cover
  return cover.url || undefined
}

export default async function PlaylistsPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: playlists } = await payload.find({
    collection: 'playlists',
    where: { published: { equals: true } },
    sort: '-publishedOn',
    depth: 1,
    limit: 100,
  })

  /* ---- derive filter options from data ---- */
  const platformsSet = new Set<string>()
  const tagsSet = new Set<string>()

  for (const p of playlists) {
    if (p.platform) platformsSet.add(p.platform)
    if (Array.isArray(p.tags)) {
      for (const t of p.tags) if (t) tagsSet.add(t)
    }
  }

  const platforms = Array.from(platformsSet).sort()
  const tags = Array.from(tagsSet).sort()

  return (
    <div className="container">
      <header className="page-header page-header-playlist">
        <p className="eyebrow">Playlists</p>
        <h1 className="title-with-icon">
          <Icon name="playlist" className="title-icon" />
          Playlists
        </h1>
        <p>
          Curated sequences tied to posts, themes, or moods.
        </p>
      </header>

      {/* Filter bar */}
      <div className="filter-bar">
        {platforms.length > 1 && (
          <div className="filter-group">
            <span className="filter-label">Platform</span>
            <select className="filter-select" data-filter="platform" defaultValue="all">
              <option value="all">All</option>
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        )}

        {tags.length > 0 && (
          <div className="filter-group">
            <span className="filter-label">Tags</span>
            <select className="filter-select" data-filter="tag" defaultValue="all">
              <option value="all">All</option>
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}

        <span className="filter-count" id="filter-count">
          {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid */}
      <div className="grid" id="filterable-grid">
        {playlists.map((p) => {
          const coverUrl = getCoverUrl(p.cover)
          const playlistTags = Array.isArray(p.tags) ? p.tags.filter(Boolean) : []

          return (
            <div
              key={p.id}
              className="filterable-card"
              data-platform={p.platform ?? ''}
              data-tags={playlistTags.join(',')}
            >
              <PostCard
                title={p.title}
                href={`/playlists/${p.slug}/`}
                meta={`${p.publishedOn ? formatDate(p.publishedOn) : ''} · ${p.platform || ''}`}
                excerpt={p.excerpt || undefined}
                label="Playlist"
                cover={coverUrl}
                pillClass="pill-playlist"
              />
            </div>
          )
        })}
      </div>

      <PlaylistFilters />
    </div>
  )
}
