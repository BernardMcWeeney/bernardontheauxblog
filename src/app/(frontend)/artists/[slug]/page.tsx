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
  const artist = await getArtist(slug)
  if (!artist) return {}

  return {
    title: `${artist.name} | Artists | Bernard on the Aux`,
    description: artist.bio || `All reviews, gigs, and notes for ${artist.name}.`,
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

  // Fetch all content for this artist
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

  return (
    <div className="container">
      <div className="post-layout">
        <Link href="/artists/" className="post-back">
          &larr; All Artists
        </Link>

        {/* Artist hero */}
        <div className="album-hero">
          <div className="album-hero-art">
            {imageUrl ? (
              <Image src={imageUrl} alt={imageAlt} fill sizes="300px" style={{ objectFit: 'cover' }} />
            ) : (
              <div className="album-hero-art-placeholder">
                <Icon name="music" size={56} />
              </div>
            )}
          </div>

          <div className="album-hero-info">
            <span className="album-hero-badge">
              <Icon name="music" size={13} />
              Artist
            </span>

            <h1 className="album-hero-title">{artist.name}</h1>

            <div className="album-hero-meta">
              <span>{totalContent} {totalContent === 1 ? 'entry' : 'entries'}</span>
              {reviews.length > 0 && <span>{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>}
              {gigs.length > 0 && <span>{gigs.length} {gigs.length === 1 ? 'gig' : 'gigs'}</span>}
            </div>

            {artist.bio && <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', lineHeight: 1.6 }}>{artist.bio}</p>}
          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="section">
            <div className="section-head">
              <div>
                <h2 className="section-title">
                  <Icon name="vinyl" className="title-icon" /> Reviews
                </h2>
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
  )
}
