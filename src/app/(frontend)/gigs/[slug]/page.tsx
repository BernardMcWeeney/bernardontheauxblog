import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Icon from '@/components/Icon'
import { formatDate } from '@/utils/format'

function getCoverUrl(cover: any): string | undefined {
  if (!cover) return undefined
  if (typeof cover === 'string') return cover
  return cover.url || undefined
}

function slugifyTag(tag: string): string {
  return tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'gigs',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  const gig = docs[0]
  if (!gig) return { title: 'Gig Not Found' }

  return {
    title: `${gig.title} — Bernard On The Aux`,
    description: gig.excerpt || `Gig diary: ${gig.title}`,
  }
}

export default async function GigDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'gigs',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })

  const gig = docs[0]
  if (!gig) notFound()

  const coverUrl = getCoverUrl(gig.cover)
  const tags = Array.isArray(gig.tags) ? gig.tags.filter(Boolean) : []

  return (
    <div className="container">
      <div className="post-layout">
        {/* Back link */}
        <a href="/gigs/" className="post-back">
          &larr; Back to Gigs
        </a>

        {/* Banner */}
        <div className="post-banner">
          {coverUrl ? (
            <img src={coverUrl} alt="" />
          ) : (
            <div className="post-banner-placeholder">
              <Icon name="gig" size={56} />
            </div>
          )}
        </div>

        {/* Content grid */}
        <div className="post-content">
          {/* Main column */}
          <div className="post-main">
            <header className="post-header-detail">
              <div className="post-collection-badge badge-gig">
                <Icon name="gig" /> Gig Diary
              </div>
              <h1 className="post-title-detail">{gig.title}</h1>
              <div className="post-meta-strip">
                {gig.eventDate && <span>{formatDate(gig.eventDate)}</span>}
                {gig.venue && <span>{gig.venue}</span>}
                {gig.city && <span>{gig.city}</span>}
              </div>
            </header>

            {gig.highlights && (
              <div className="highlights-callout">
                <p className="highlights-callout-title">Highlights</p>
                <p>{gig.highlights}</p>
              </div>
            )}

            <div className="post-body">
              {gig.content && <RichText data={gig.content} />}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="post-sidebar">
            <div className="sidebar-card">
              <p className="sidebar-card-title">Event Info</p>
              {gig.artist && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Artist</span>
                  <span className="sidebar-item-value">{gig.artist}</span>
                </div>
              )}
              {gig.venue && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Venue</span>
                  <span className="sidebar-item-value">{gig.venue}</span>
                </div>
              )}
              {gig.city && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">City</span>
                  <span className="sidebar-item-value">{gig.city}</span>
                </div>
              )}
              {gig.eventDate && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Date</span>
                  <span className="sidebar-item-value">{formatDate(gig.eventDate)}</span>
                </div>
              )}
              {gig.tour && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Tour</span>
                  <span className="sidebar-item-value">{gig.tour}</span>
                </div>
              )}
              {gig.support && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Support</span>
                  <span className="sidebar-item-value">{gig.support}</span>
                </div>
              )}
            </div>

            {tags.length > 0 && (
              <div className="sidebar-card">
                <p className="sidebar-card-title">Tags</p>
                <div className="detail-tags">
                  {tags.map((t) => (
                    <a
                      key={t}
                      href={`/tags/${slugifyTag(t)}/`}
                      className="detail-tag"
                    >
                      {t}
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
