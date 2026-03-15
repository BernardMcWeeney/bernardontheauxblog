import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Bernard On The Aux',
  description:
    'About Bernard On The Aux — a personal, passion-driven music review and listening log.',
}

export default function AboutPage() {
  return (
    <div className="container">
      <article className="post">
        <header className="post-header">
          <p className="eyebrow">About</p>
          <h1 className="post-title">About Bernard On The Aux</h1>
        </header>

        <div className="post-body">
          <p>
            <strong>Bernard On The Aux</strong> is a personal, passion-driven music review and
            listening log. It prioritizes listening, context, and memory over speed, hype, or blanket
            coverage.
          </p>

          <h2>What you'll find here</h2>
          <ul>
            <li>
              <strong>Album reviews</strong> — Full-album listening notes for new releases and older
              records revisited.
            </li>
            <li>
              <strong>Gig diaries</strong> — Concert notes for shows actually attended. The room, the
              set, the memory.
            </li>
            <li>
              <strong>Deep dives</strong> — Longer reads on artists, genres, and eras that deserve a
              slower pace.
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
            This isn't a news site. There's no race to be first, no algorithm to feed, no content
            calendar to meet. The goal is simple: listen properly, then write about it when there's
            something worth saying.
          </p>

          <p>
            Reviews lean toward records that reward full attention — albums that unfold over time, not
            just collections of singles. The writing focuses on what a record sounds like, how it sits
            in a listening session, and why it might be worth your time.
          </p>

          <h2>Who's behind this</h2>
          <p>
            Bernard. A listener, not a critic. Someone who prefers full albums over playlists, small
            venues over festivals, and context over hot takes.
          </p>

          <h2>Get in touch</h2>
          <p>
            Questions, suggestions, or just want to talk music?{' '}
            <a href="/contact/">Get in touch</a>.
          </p>
        </div>
      </article>
    </div>
  )
}
