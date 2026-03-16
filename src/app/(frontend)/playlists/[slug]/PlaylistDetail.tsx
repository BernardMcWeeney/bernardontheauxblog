'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLivePreview } from '@payloadcms/live-preview-react'
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

export default function PlaylistDetail({ initialData, serverURL }: { initialData: any; serverURL: string }) {
  const { data: playlist } = useLivePreview({
    initialData,
    serverURL,
    depth: 1,
  })

  const coverUrl = getCoverUrl(playlist.cover)
  const tags: string[] = Array.isArray(playlist.tags) ? playlist.tags.filter(Boolean) : []

  return (
    <div className="container">
      <div className="post-layout">
        <Link href="/playlists/" className="post-back">
          &larr; Back to Playlists
        </Link>

        <div className="post-banner">
          {coverUrl ? (
            <Image src={coverUrl} alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} />
          ) : (
            <div className="post-banner-placeholder">
              <Icon name="playlist" size={56} />
            </div>
          )}
        </div>

        <div className="post-content">
          <div className="post-main">
            <header className="post-header-detail">
              <div className="post-collection-badge badge-playlist">
                <Icon name="playlist" /> Playlist
              </div>
              <h1 className="post-title-detail">{playlist.title}</h1>
              <div className="post-meta-strip">
                {playlist.publishedOn && (
                  <span>{formatDate(playlist.publishedOn)}</span>
                )}
                {playlist.platform && (
                  <span className="platform-badge">
                    <Icon name="music" size={12} /> {playlist.platform}
                  </span>
                )}
                {playlist.mood && <span>{playlist.mood}</span>}
                {playlist.duration != null && playlist.duration > 0 && (
                  <span>{playlist.duration} min</span>
                )}
              </div>
            </header>

            {playlist.embedUrl && (
              <div className="playlist-embed">
                <iframe
                  src={playlist.embedUrl}
                  title="Playlist embed"
                  width="100%"
                  height="380"
                  loading="lazy"
                />
              </div>
            )}

            <div className="post-body">
              {playlist.content && <RichText data={playlist.content} />}
            </div>
          </div>

          <aside className="post-sidebar">
            <div className="sidebar-card">
              <p className="sidebar-card-title">Playlist Info</p>
              {playlist.platform && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Platform</span>
                  <span className="sidebar-item-value">{playlist.platform}</span>
                </div>
              )}
              {playlist.duration != null && playlist.duration > 0 && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Duration</span>
                  <span className="sidebar-item-value">{playlist.duration} min</span>
                </div>
              )}
              {playlist.mood && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Mood</span>
                  <span className="sidebar-item-value">{playlist.mood}</span>
                </div>
              )}
              {playlist.playlistUrl && (
                <div className="sidebar-item">
                  <span className="sidebar-item-label">Link</span>
                  <span className="sidebar-item-value">
                    <a
                      href={playlist.playlistUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--accent)', textDecoration: 'underline' }}
                    >
                      Open playlist
                    </a>
                  </span>
                </div>
              )}
            </div>

            {tags.length > 0 && (
              <div className="sidebar-card">
                <p className="sidebar-card-title">Tags</p>
                <div className="detail-tags">
                  {tags.map((t) => (
                    <a key={t} href={`/tags/${slugifyTag(t)}/`} className="detail-tag">
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
