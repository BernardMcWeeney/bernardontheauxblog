import type { Metadata } from 'next'
import Icon from '@/components/Icon'

export const metadata: Metadata = {
  title: 'About | Bernard On The Aux',
  description:
    'About Bernard On The Aux — a personal, passion-driven music review and listening log.',
}

export default function AboutPage() {
  return (
    <div className="container">
      <div className="post-layout">
        <div className="page-header">
          <p className="eyebrow">About</p>
          <h1>Bernard On The Aux</h1>
          <p>A personal, passion-driven music review and listening log.</p>
        </div>

        <div className="post-content">
          <div className="post-main">
            <div className="post-body">
              <p>
                <strong>Bernard On The Aux</strong> is a place for honest music writing. It
                prioritizes listening, context, and memory over speed, hype, or blanket coverage.
              </p>

              <h2>What you&apos;ll find here</h2>
              <ul>
                <li>
                  <strong>Album reviews</strong> — Full-album listening notes for new releases and
                  older records revisited.
                </li>
                <li>
                  <strong>Gig diaries</strong> — Concert notes for shows actually attended. The room,
                  the set, the memory.
                </li>
                <li>
                  <strong>Deep dives</strong> — Longer reads on artists, genres, and eras that
                  deserve a slower pace.
                </li>
                <li>
                  <strong>Playlists</strong> — Curated sequences tied to posts, themes, or moods.
                </li>
                <li>
                  <strong>Listening notes</strong> — Short notes when a moment deserves saving.
                </li>
              </ul>

              <h2>The approach</h2>
              <p>
                This isn&apos;t a news site. There&apos;s no race to be first, no algorithm to feed,
                no content calendar to meet. The goal is simple: listen properly, then write about it
                when there&apos;s something worth saying.
              </p>

              <p>
                Reviews lean toward records that reward full attention — albums that unfold over time,
                not just collections of singles. The writing focuses on what a record sounds like, how
                it sits in a listening session, and why it might be worth your time.
              </p>

              <h2>Who&apos;s behind this</h2>
              <p>
                Bernard. A listener, not a critic. Someone who prefers full albums over playlists,
                small venues over festivals, and context over hot takes.
              </p>

              <h2>Get in touch</h2>
              <p>
                Questions, suggestions, or just want to talk music?{' '}
                <a href="mailto:hello@bernardontheaux.com">hello@bernardontheaux.com</a>
              </p>
            </div>
          </div>

          <aside className="post-sidebar">
            <div className="sidebar-card">
              <p className="sidebar-card-title">Formats</p>
              <div className="sidebar-item">
                <span className="sidebar-item-label">Reviews</span>
                <span className="sidebar-item-value"><Icon name="vinyl" size={14} /> Album &amp; single reviews</span>
              </div>
              <div className="sidebar-item">
                <span className="sidebar-item-label">Gigs</span>
                <span className="sidebar-item-value"><Icon name="gig" size={14} /> Live show diaries</span>
              </div>
              <div className="sidebar-item">
                <span className="sidebar-item-label">Deep Dives</span>
                <span className="sidebar-item-value"><Icon name="dive" size={14} /> Long-form pieces</span>
              </div>
              <div className="sidebar-item">
                <span className="sidebar-item-label">Playlists</span>
                <span className="sidebar-item-value"><Icon name="playlist" size={14} /> Curated mixes</span>
              </div>
              <div className="sidebar-item">
                <span className="sidebar-item-label">Notes</span>
                <span className="sidebar-item-value"><Icon name="note" size={14} /> Quick listens</span>
              </div>
            </div>

            <div className="sidebar-card">
              <p className="sidebar-card-title">Connect</p>
              <div className="sidebar-item">
                <span className="sidebar-item-label">Email</span>
                <span className="sidebar-item-value">
                  <a href="mailto:hello@bernardontheaux.com">hello@bernardontheaux.com</a>
                </span>
              </div>
              <div className="sidebar-item">
                <span className="sidebar-item-label">RSS</span>
                <span className="sidebar-item-value">
                  <a href="/rss.xml">Subscribe via RSS</a>
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
