import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Icon from '@/components/Icon'
import { formatDate } from '@/utils/format'
import { calculateReadingTime, formatReadingTime } from '@/utils/readingTime'

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
    collection: 'deep-dives',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  const dive = docs[0]
  if (!dive) return { title: 'Deep Dive Not Found' }

  return {
    title: `${dive.title} — Bernard On The Aux`,
    description: dive.excerpt || `Deep dive: ${dive.title}`,
  }
}

export default async function DeepDiveDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'deep-dives',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })

  const dive = docs[0]
  if (!dive) notFound()

  const coverUrl = getCoverUrl(dive.cover)
  const tags = Array.isArray(dive.tags) ? dive.tags.filter(Boolean) : []

  // Approximate reading time from the rich-text JSON
  const contentText =
    dive.content && typeof dive.content === 'object'
      ? JSON.stringify(dive.content)
      : ''
  const readingMinutes = calculateReadingTime(contentText)

  return (
    <div className="container">
      <div className="post-layout">
        {/* Back link */}
        <a href="/deep-dives/" className="post-back">
          &larr; Back to Deep Dives
        </a>

        {/* Banner */}
        <div className="post-banner">
          {coverUrl ? (
            <img src={coverUrl} alt="" />
          ) : (
            <div className="post-banner-placeholder">
              <Icon name="dive" size={56} />
            </div>
          )}
        </div>

        {/* Content grid */}
        <div className="post-content">
          {/* Main column */}
          <div className="post-main">
            <header className="post-header-detail">
              <div className="post-collection-badge badge-dive">
                <Icon name="dive" /> Deep Dive
              </div>
              <h1 className="post-title-detail">{dive.title}</h1>
              <div className="post-meta-strip">
                {dive.publishedOn && <span>{formatDate(dive.publishedOn)}</span>}
                <span>{formatReadingTime(readingMinutes)}</span>
                {dive.topic && <span>{dive.topic}</span>}
                {dive.era && <span>{dive.era}</span>}
              </div>
            </header>

            <div className="post-body">
              {dive.content && <RichText data={dive.content} />}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="post-sidebar">
            <div className="sidebar-card">
              <p className="sidebar-card-title">Details</p>
              {dive.topic && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Topic</span>
                  <span className="sidebar-item-value">{dive.topic}</span>
                </div>
              )}
              {dive.era && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Era</span>
                  <span className="sidebar-item-value">{dive.era}</span>
                </div>
              )}
              <div className="sidebar-item">
                <span className="sidebar-item-label">Reading time</span>
                <span className="sidebar-item-value">{formatReadingTime(readingMinutes)}</span>
              </div>
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
