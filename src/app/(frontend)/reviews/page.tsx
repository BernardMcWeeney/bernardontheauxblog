import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Icon from '@/components/Icon'
import PostCard from '@/components/PostCard'
import { formatDate, formatRating } from '@/utils/format'
import { ReviewFilters } from './ReviewsClient'

const typeLabels: Record<string, string> = {
  album: 'Album',
  gig: 'Gig',
  artist: 'Artist',
  single: 'Single',
  ep: 'EP',
  film: 'Film',
  other: 'Other',
}

export const metadata = {
  title: 'Reviews | Bernard on the Aux',
  description: 'Album reviews, gig write-ups, and more — rated and reviewed.',
}

function getCoverUrl(cover: any): string | undefined {
  if (!cover) return undefined
  if (typeof cover === 'string') return cover
  return cover.url || undefined
}

export default async function ReviewsPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: reviews } = await payload.find({
    collection: 'reviews',
    where: { published: { equals: true } },
    sort: '-reviewDate',
    depth: 1,
    limit: 0,
  })

  // Build filter options from the data
  const allTypes = [...new Set(reviews.map((r) => r.reviewType).filter(Boolean))] as string[]
  const allTags = [...new Set(reviews.flatMap((r) => (Array.isArray(r.tags) ? r.tags : []).filter(Boolean)))] as string[]
  const allFormats = [...new Set(reviews.map((r) => r.format).filter(Boolean))] as string[]
  const allYears = [
    ...new Set(
      reviews
        .map((r) => (r.reviewDate ? new Date(r.reviewDate).getFullYear().toString() : null))
        .filter(Boolean),
    ),
  ].sort((a, b) => Number(b) - Number(a)) as string[]

  return (
    <div className="container">
      <header className="page-header page-header-review">
        <p className="eyebrow">Album reviews</p>
        <h1 className="title-with-icon">
          <Icon name="review" className="title-icon" />
          Reviews
        </h1>
        <p>
          Honest thoughts on records, gigs, and everything in between — rated out of ten.
        </p>
      </header>

      {/* Filter bar */}
      <div className="filter-bar">
        {allTypes.length > 1 && (
          <div className="filter-group">
            <span className="filter-label">Type</span>
            <select className="filter-select" data-filter="type" defaultValue="all">
              <option value="all">All</option>
              {allTypes.map((t) => (
                <option key={t} value={t}>
                  {typeLabels[t] ?? t}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="filter-group">
          <span className="filter-label">Rating</span>
          <select className="filter-select" data-filter="rating" defaultValue="all">
            <option value="all">All</option>
            <option value="8+">8+</option>
            <option value="6-8">6 &ndash; 8</option>
            <option value="under6">Under 6</option>
          </select>
        </div>

        {allFormats.length > 1 && (
          <div className="filter-group">
            <span className="filter-label">Format</span>
            <select className="filter-select" data-filter="format" defaultValue="all">
              <option value="all">All</option>
              {allFormats.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        )}

        {allYears.length > 1 && (
          <div className="filter-group">
            <span className="filter-label">Year</span>
            <select className="filter-select" data-filter="year" defaultValue="all">
              <option value="all">All</option>
              {allYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        )}

        {allTags.length > 0 && (
          <div className="filter-group">
            <span className="filter-label">Tags</span>
            <select className="filter-select" data-filter="tag" defaultValue="all">
              <option value="all">All</option>
              {allTags.sort().map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        )}

        <span className="filter-count" id="filter-count">
          {reviews.length} review{reviews.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid */}
      <div className="grid" id="filterable-grid">
        {reviews.map((review) => {
          const coverUrl = getCoverUrl(review.cover)

          const reviewYear = review.reviewDate
            ? new Date(review.reviewDate).getFullYear().toString()
            : ''

          const tags = Array.isArray(review.tags) ? review.tags.filter(Boolean) : []
          const typeLabel = typeLabels[review.reviewType as string] ?? (review.reviewType as string)
          const cardTitle = review.artist
            ? `${review.artist} — ${review.title}`
            : review.title

          return (
            <div
              key={review.id}
              className="filterable-card"
              data-type={review.reviewType ?? ''}
              data-rating={review.rating?.toString() ?? ''}
              data-format={review.format ?? ''}
              data-year={reviewYear}
              data-tags={tags.join(',')}
            >
              <PostCard
                title={cardTitle}
                href={`/reviews/${review.slug}/`}
                meta={review.reviewDate ? formatDate(review.reviewDate) : undefined}
                excerpt={review.excerpt ?? undefined}
                label={typeLabel}
                cover={coverUrl}
                rating={review.rating ?? undefined}
                square
                pillClass="pill-review"
              />
            </div>
          )
        })}
      </div>

      <ReviewFilters />
    </div>
  )
}
