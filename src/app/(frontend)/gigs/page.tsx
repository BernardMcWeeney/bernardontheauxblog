import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Icon from '@/components/Icon'
import PostCard from '@/components/PostCard'
import { formatDate } from '@/utils/format'
import { GigFilters } from './GigsClient'

export const metadata = {
  title: 'Gigs | Bernard on the Aux',
  description: 'Concert diaries for shows actually attended. The room, the set, the memory.',
}

function getCoverUrl(cover: any): string | undefined {
  if (!cover) return undefined
  if (typeof cover === 'string') return cover
  return cover.url || undefined
}

export default async function GigsPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: gigs } = await payload.find({
    collection: 'gigs',
    where: { published: { equals: true } },
    sort: '-eventDate',
    depth: 1,
    limit: 100,
  })

  /* ---- derive filter options from data ---- */
  const yearsSet = new Set<string>()
  const citiesSet = new Set<string>()
  const venuesSet = new Set<string>()
  const tagsSet = new Set<string>()

  for (const g of gigs) {
    if (g.eventDate) yearsSet.add(new Date(g.eventDate).getFullYear().toString())
    if (g.city) citiesSet.add(g.city)
    if (g.venue) venuesSet.add(g.venue)
    if (Array.isArray(g.tags)) {
      for (const t of g.tags) if (t) tagsSet.add(t)
    }
  }

  const years = Array.from(yearsSet).sort().reverse()
  const cities = Array.from(citiesSet).sort()
  const venues = Array.from(venuesSet).sort()
  const tags = Array.from(tagsSet).sort()

  return (
    <div className="container">
      <header className="page-header page-header-gig">
        <p className="eyebrow">Gig diaries</p>
        <h1 className="title-with-icon">
          <Icon name="gig" className="title-icon" />
          Gigs
        </h1>
        <p>
          Concert diaries for shows actually attended. The room, the set, the memory.
        </p>
      </header>

      {/* Filter bar */}
      <div className="filter-bar">
        {years.length > 1 && (
          <div className="filter-group">
            <span className="filter-label">Year</span>
            <select className="filter-select" data-filter="year" defaultValue="all">
              <option value="all">All</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        )}

        {cities.length > 1 && (
          <div className="filter-group">
            <span className="filter-label">City</span>
            <select className="filter-select" data-filter="city" defaultValue="all">
              <option value="all">All</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        {venues.length > 1 && (
          <div className="filter-group">
            <span className="filter-label">Venue</span>
            <select className="filter-select" data-filter="venue" defaultValue="all">
              <option value="all">All</option>
              {venues.map((v) => (
                <option key={v} value={v}>
                  {v}
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
          {gigs.length} gig{gigs.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid */}
      <div className="grid" id="filterable-grid">
        {gigs.map((g) => {
          const coverUrl = getCoverUrl(g.cover)
          const gigYear = g.eventDate
            ? new Date(g.eventDate).getFullYear().toString()
            : ''
          const gigTags = Array.isArray(g.tags) ? g.tags.filter(Boolean) : []

          return (
            <div
              key={g.id}
              className="filterable-card"
              data-year={gigYear}
              data-city={g.city ?? ''}
              data-venue={g.venue ?? ''}
              data-tags={gigTags.join(',')}
            >
              <PostCard
                title={g.title}
                href={`/gigs/${g.slug}/`}
                meta={`${g.eventDate ? formatDate(g.eventDate) : ''} · ${g.city || ''}`}
                excerpt={g.excerpt ?? undefined}
                label="Gig"
                cover={coverUrl}
                pillClass="pill-gig"
              />
            </div>
          )
        })}
      </div>

      <GigFilters />
    </div>
  )
}
