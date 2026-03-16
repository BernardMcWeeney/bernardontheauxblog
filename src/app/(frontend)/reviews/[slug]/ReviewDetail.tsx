'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLivePreview } from '@payloadcms/live-preview-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Icon from '@/components/Icon'
import { formatDate, formatRating } from '@/utils/format'
import { calculateReadingTime, formatReadingTime } from '@/utils/readingTime'
import { getArtistName, getLabelName, getDisplayTitle } from '@/utils/artist'

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

export default function ReviewDetail({ initialData, serverURL }: { initialData: any; serverURL: string }) {
  const { data: review } = useLivePreview({
    initialData,
    serverURL,
    depth: 1,
  })

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
  const artistName = getArtistName(review.artist)
  const displayTitle = getDisplayTitle(review)

  const contentJson =
    review.content && typeof review.content === 'object'
      ? JSON.stringify(review.content)
      : ''
  const plainText = contentJson.replace(/"type":"[^"]*"/g, '').replace(/[{}[\]",:]/g, ' ')
  const readingMinutes = calculateReadingTime(plainText)

  const tags = Array.isArray(review.tags) ? (review.tags.filter(Boolean) as string[]) : []
  const standoutTracks = review.standoutTracks ?? ''

  return (
    <div className="container">
      <div className="post-layout">
        <Link href="/reviews/" className="post-back">
          &larr; Back to Reviews
        </Link>

        <div className="album-hero">
          <div className="album-hero-art">
            {coverUrl ? (
              <Image src={coverUrl} alt={coverAlt} fill sizes="300px" style={{ objectFit: 'cover' }} />
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

        <div className="post-content">
          <div className="post-main">
            <div className="post-body">
              {review.content && (
                <RichText data={review.content} />
              )}
            </div>
          </div>

          <aside className="post-sidebar">
            <div className="sidebar-card">
              <p className="sidebar-card-title">Album Info</p>
              {artistName && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Artist</span>
                  <span className="sidebar-item-value">
                    {typeof review.artist === 'object' && review.artist !== null && 'slug' in review.artist ? (
                      <Link href={`/artists/${(review.artist as any).slug}/`}>{artistName}</Link>
                    ) : (
                      artistName
                    )}
                  </span>
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
              {getLabelName(review.label) && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Label</span>
                  <span className="sidebar-item-value">{getLabelName(review.label)}</span>
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

            {standoutTracks && (
              <div className="sidebar-card">
                <p className="sidebar-card-title">Standout Tracks</p>
                <p className="sidebar-item-value" style={{ padding: '0.5rem 0', margin: 0 }}>
                  {standoutTracks}
                </p>
              </div>
            )}

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
  )
}
