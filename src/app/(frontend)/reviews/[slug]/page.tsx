import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Icon from '@/components/Icon'
import { formatDate, formatRating } from '@/utils/format'
import { calculateReadingTime, formatReadingTime } from '@/utils/readingTime'

const typeLabels: Record<string, string> = {
  album: 'Album',
  gig: 'Gig',
  artist: 'Artist',
  single: 'Single',
  ep: 'EP',
  film: 'Film',
  other: 'Other',
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

async function getReview(slug: string) {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'reviews',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const review = await getReview(slug)
  if (!review) return {}

  const cover = review.cover
  const coverUrl =
    typeof cover === 'object' && cover?.url
      ? cover.url
      : typeof cover === 'string'
        ? cover
        : undefined

  const title = review.artist
    ? `${review.artist} — ${review.title}`
    : review.title

  return {
    title: `${title} | Reviews | Bernard on the Aux`,
    description: review.excerpt ?? `Review of ${title}`,
    openGraph: {
      title: `${title} — Review`,
      description: review.excerpt ?? `Review of ${title}`,
      ...(coverUrl ? { images: [{ url: coverUrl }] } : {}),
    },
  }
}

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const review = await getReview(slug)
  if (!review) notFound()

  const cover = review.cover
  const coverUrl =
    typeof cover === 'object' && cover?.url
      ? cover.url
      : typeof cover === 'string'
        ? cover
        : undefined
  const coverAlt =
    typeof cover === 'object' && cover?.alt ? cover.alt : review.title

  const typeLabel = typeLabels[review.reviewType as string] ?? (review.reviewType as string)
  const displayTitle = review.artist
    ? `${review.artist} — ${review.title}`
    : review.title

  // Estimate reading time from rich text (extract plain text)
  const contentJson =
    review.content && typeof review.content === 'object'
      ? JSON.stringify(review.content)
      : ''
  const plainText = contentJson.replace(/"type":"[^"]*"/g, '').replace(/[{}[\]",:]/g, ' ')
  const readingMinutes = calculateReadingTime(plainText)

  const tags = Array.isArray(review.tags) ? (review.tags.filter(Boolean) as string[]) : []
  const standoutTracks = review.standoutTracks ?? ''

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MusicAlbum',
        name: review.title,
        ...(review.artist ? { byArtist: { '@type': 'MusicGroup', name: review.artist } } : {}),
        ...(review.releaseYear ? { datePublished: String(review.releaseYear) } : {}),
        ...(coverUrl ? { image: coverUrl } : {}),
        review: {
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: review.rating,
            bestRating: 10,
            worstRating: 0,
          },
          ...(review.reviewDate ? { datePublished: review.reviewDate } : {}),
          author: {
            '@type': 'Person',
            name: 'Bernard McWeeney',
          },
          ...(review.excerpt ? { description: review.excerpt } : {}),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: '/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Reviews',
            item: '/reviews/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: displayTitle,
            item: `/reviews/${review.slug}/`,
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container">
        <div className="post-layout">
          {/* Back link */}
          <a href="/reviews/" className="post-back">
            &larr; Back to Reviews
          </a>

          {/* Album hero */}
          <div className="album-hero">
            <div className="album-hero-art">
              {coverUrl ? (
                <img src={coverUrl} alt={coverAlt} />
              ) : (
                <div className="album-hero-art-placeholder">
                  <Icon name="vinyl" size={56} />
                </div>
              )}
            </div>

            <div className="album-hero-info">
              <span className="album-hero-badge">
                <Icon name="vinyl" size={13} />
                {typeLabel} Review
              </span>

              <h1 className="album-hero-title">{displayTitle}</h1>

              <div className="album-hero-meta">
                {review.reviewDate && <span>{formatDate(review.reviewDate)}</span>}
                <span>{formatReadingTime(readingMinutes)}</span>
                {review.format && <span>{review.format}</span>}
              </div>

              {review.rating != null && (
                <div className="album-hero-rating">
                  <span className="album-hero-rating-number">
                    {formatRating(review.rating)}
                  </span>
                  <span className="album-hero-rating-suffix">/10</span>
                </div>
              )}
            </div>
          </div>

          {/* Post content: main + sidebar */}
          <div className="post-content">
            <div className="post-main">
              <div className="post-body">
                {review.content && (
                  <RichText data={review.content} />
                )}
              </div>
            </div>

            <aside className="post-sidebar">
              {/* Album Info card */}
              <div className="sidebar-card">
                <p className="sidebar-card-title">Album Info</p>
                {review.artist && (
                  <div className="sidebar-item">
                    <span className="sidebar-item-label">Artist</span>
                    <span className="sidebar-item-value">{review.artist}</span>
                  </div>
                )}
                {review.releaseYear && (
                  <div className="sidebar-item">
                    <span className="sidebar-item-label">Year</span>
                    <span className="sidebar-item-value">{review.releaseYear}</span>
                  </div>
                )}
                {review.format && (
                  <div className="sidebar-item">
                    <span className="sidebar-item-label">Format</span>
                    <span className="sidebar-item-value">{review.format}</span>
                  </div>
                )}
                {review.label && (
                  <div className="sidebar-item">
                    <span className="sidebar-item-label">Label</span>
                    <span className="sidebar-item-value">{review.label}</span>
                  </div>
                )}
                {review.listenedOn && (
                  <div className="sidebar-item">
                    <span className="sidebar-item-label">Listened</span>
                    <span className="sidebar-item-value">
                      {formatDate(review.listenedOn)}
                    </span>
                  </div>
                )}
              </div>

              {/* Standout Tracks card */}
              {standoutTracks && (
                <div className="sidebar-card">
                  <p className="sidebar-card-title">Standout Tracks</p>
                  <p className="sidebar-item-value" style={{ padding: '0.5rem 0', margin: 0 }}>
                    {standoutTracks}
                  </p>
                </div>
              )}

              {/* Tags card */}
              {tags.length > 0 && (
                <div className="sidebar-card">
                  <p className="sidebar-card-title">Tags</p>
                  <div className="detail-tags">
                    {tags.map((tag) => (
                      <a
                        key={tag}
                        href={`/tags/${slugify(tag)}/`}
                        className="detail-tag"
                      >
                        {tag}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
