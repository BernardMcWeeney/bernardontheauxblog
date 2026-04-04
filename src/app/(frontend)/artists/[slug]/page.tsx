import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import PostCard from '@/components/PostCard'
import Icon from '@/components/Icon'
import { formatDate } from '@/utils/format'
import { getDisplayTitle } from '@/utils/artist'
import { cfImageUrl } from '@/utils/cfImage'

function getCoverUrl(cover: any): string | undefined {
  if (!cover) return undefined
  if (typeof cover === 'string') return cover
  return cover.url || undefined
}

async function getArtist(slug: string) {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'artists',
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
  const artist: any = await getArtist(slug)
  if (!artist) return {}

  const metaTitle = `${artist.name} | Artists | Bernard on the Aux`
  const metaDescription = artist.bio || `All reviews, gigs, and notes for ${artist.name}.`
  const imageUrl = typeof artist.image === 'object' && artist.image?.url ? artist.image.url : undefined

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title: metaTitle,
      description: metaDescription,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  }
}

export default async function ArtistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const artist = await getArtist(slug)
  if (!artist) notFound()

  const payload = await getPayload({ config: configPromise })

  const [reviewsRes, gigsRes, notesRes] = await Promise.all([
    payload.find({
      collection: 'reviews',
      where: {
        artist: { equals: artist.id },
        published: { equals: true },
      },
      sort: '-reviewDate',
      depth: 1,
      limit: 100,
    }),
    payload.find({
      collection: 'gigs',
      where: {
        artist: { equals: artist.id },
        published: { equals: true },
      },
      sort: '-eventDate',
      depth: 1,
      limit: 100,
    }),
    payload.find({
      collection: 'notes',
      where: {
        artist: { equals: artist.id },
        published: { equals: true },
      },
      sort: '-listenedOn',
      depth: 1,
      limit: 100,
    }),
  ])

  const reviews = reviewsRes.docs
  const gigs = gigsRes.docs
  const notes = notesRes.docs
  const totalContent = reviews.length + gigs.length + notes.length

  const imageUrl =
    typeof artist.image === 'object' && artist.image?.url
      ? artist.image.url
      : undefined
  const imageAlt =
    typeof artist.image === 'object' && artist.image?.alt
      ? artist.image.alt
      : artist.name

  // Average rating across reviews
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null

  const artistJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MusicGroup',
        name: artist.name,
        ...(imageUrl ? { image: imageUrl } : {}),
        ...(artist.bio ? { description: artist.bio } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
          { '@type': 'ListItem', position: 2, name: 'Artists', item: '/artists/' },
          { '@type': 'ListItem', position: 3, name: artist.name, item: `/artists/${artist.slug}/` },
        ],
      },
    ],
  }

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(artistJsonLd) }}
    />
    <div className="container">
      <div className="post-layout">
        <Link href="/artists/" className="post-back">
          &larr; All Artists
        </Link>

        {/* Artist profile header */}
        <div className="artist-profile">
          <div className="artist-profile-image">
            {imageUrl ? (
              <Image src={cfImageUrl(imageUrl, { width: 340, height: 340 })} alt={imageAlt} fill sizes="(max-width: 768px) 100vw, 340px" style={{ objectFit: 'cover' }} />
            ) : (
              <div className="artist-profile-placeholder">
                <Icon name="music" size={56} />
              </div>
            )}
          </div>

          <div className="artist-profile-info">
            <span className="album-hero-badge">
              <Icon name="music" size={13} />
              Artist
            </span>

            <h1 className="artist-profile-name">{artist.name}</h1>

            <div className="artist-profile-details">
              {(artist as any).origin && (
                <span className="artist-detail">
                  <Icon name="music" size={12} />
                  {(artist as any).origin}
                </span>
              )}
              {(artist as any).founded && (
                <span className="artist-detail">
                  Est. {(artist as any).founded}
                </span>
              )}
              {(artist as any).genre && (
                <span className="artist-detail">
                  {(artist as any).genre}
                </span>
              )}
              {typeof (artist as any).label === 'object' && (artist as any).label?.name && (
                <span className="artist-detail">
                  {(artist as any).label.name}
                </span>
              )}
            </div>

            <div className="artist-profile-stats">
              {reviews.length > 0 && (
                <span className="artist-stat">
                  <strong>{reviews.length}</strong> {reviews.length === 1 ? 'review' : 'reviews'}
                </span>
              )}
              {gigs.length > 0 && (
                <span className="artist-stat">
                  <strong>{gigs.length}</strong> {gigs.length === 1 ? 'gig' : 'gigs'}
                </span>
              )}
              {notes.length > 0 && (
                <span className="artist-stat">
                  <strong>{notes.length}</strong> {notes.length === 1 ? 'note' : 'notes'}
                </span>
              )}
              {avgRating && (
                <span className="artist-stat">
                  <strong>{avgRating}</strong> avg rating
                </span>
              )}
            </div>

            {((artist as any).spotifyUrl || (artist as any).websiteUrl) && (
              <div className="artist-profile-links">
                {(artist as any).spotifyUrl && (
                  <a href={(artist as any).spotifyUrl} target="_blank" rel="noopener noreferrer" className="artist-ext-link">
                    Spotify
                  </a>
                )}
                {(artist as any).websiteUrl && (
                  <a href={(artist as any).websiteUrl} target="_blank" rel="noopener noreferrer" className="artist-ext-link">
                    Website
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bio section */}
        {artist.bio && (
          <section className="artist-bio">
            <h2 className="artist-bio-heading">About {artist.name}</h2>
            <div className="artist-bio-text">
              {artist.bio.split('\n').filter(Boolean).map((paragraph: string, i: number) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="section">
            <div className="section-head">
              <div>
                <h2 className="section-title">
                  <Icon name="vinyl" className="title-icon" /> Reviews
                </h2>
                <p>Album reviews for {artist.name}.</p>
              </div>
            </div>
            <div className="grid">
              {reviews.map((entry: any) => (
                <PostCard
                  key={entry.slug}
                  title={getDisplayTitle(entry)}
                  href={`/reviews/${entry.slug}/`}
                  meta={`${formatDate(entry.reviewDate)} · ${entry.rating}/10`}
                  excerpt={entry.excerpt}
                  label="Review"
                  cover={getCoverUrl(entry.cover)}
                  rating={entry.rating}
                  square={true}
                  pillClass="pill-review"
                />
              ))}
            </div>
          </section>
        )}

        {/* Gigs */}
        {gigs.length > 0 && (
          <section className="section">
            <div className="section-head">
              <div>
                <h2 className="section-title">
                  <Icon name="gig" className="title-icon" /> Live
                </h2>
                <p>Gig diaries and live experiences.</p>
              </div>
            </div>
            <div className="grid">
              {gigs.map((entry: any) => (
                <PostCard
                  key={entry.slug}
                  title={entry.headline || entry.title}
                  href={`/gigs/${entry.slug}/`}
                  meta={`${formatDate(entry.eventDate)} · ${entry.city}`}
                  excerpt={entry.excerpt}
                  label="Gig"
                  cover={getCoverUrl(entry.cover)}
                  pillClass="pill-gig"
                />
              ))}
            </div>
          </section>
        )}

        {/* Notes */}
        {notes.length > 0 && (
          <section className="section">
            <div className="section-head">
              <div>
                <h2 className="section-title">
                  <Icon name="note" className="title-icon" /> Notes
                </h2>
                <p>Listening notes and quick takes.</p>
              </div>
            </div>
            <div className="grid">
              {notes.map((entry: any) => (
                <PostCard
                  key={entry.slug}
                  title={entry.headline || entry.title}
                  href={`/notes/${entry.slug}/`}
                  meta={formatDate(entry.listenedOn)}
                  excerpt={entry.excerpt}
                  label="Note"
                  cover={getCoverUrl(entry.cover)}
                  pillClass="pill-note"
                />
              ))}
            </div>
          </section>
        )}

        {totalContent === 0 && (
          <p className="empty-state">No content for {artist.name} yet.</p>
        )}
      </div>
    </div>
    </>
  )
}
