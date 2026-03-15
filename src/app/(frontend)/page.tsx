import { getPayload } from 'payload'
import configPromise from '@payload-config'
import HeroSlider from '@/components/HeroSlider'
import PostCard from '@/components/PostCard'
import Icon from '@/components/Icon'
import { formatDate } from '@/utils/format'

/* ── helpers ── */

function getCoverUrl(cover: any): string | undefined {
  if (!cover) return undefined
  if (typeof cover === 'string') return cover
  return cover.url || undefined
}

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  /* ── Fetch all five collections ── */
  const [reviewsRes, gigsRes, deepDivesRes, playlistsRes, notesRes] = await Promise.all([
    payload.find({
      collection: 'reviews',
      where: { published: { equals: true } },
      sort: '-reviewDate',
      depth: 1,
      limit: 100,
    }),
    payload.find({
      collection: 'gigs',
      where: { published: { equals: true } },
      sort: '-eventDate',
      depth: 1,
      limit: 100,
    }),
    payload.find({
      collection: 'deep-dives',
      where: { published: { equals: true } },
      sort: '-publishedOn',
      depth: 1,
      limit: 100,
    }),
    payload.find({
      collection: 'playlists',
      where: { published: { equals: true } },
      sort: '-publishedOn',
      depth: 1,
      limit: 100,
    }),
    payload.find({
      collection: 'notes',
      where: { published: { equals: true } },
      sort: '-listenedOn',
      depth: 1,
      limit: 100,
    }),
  ])

  const reviews = reviewsRes.docs
  const gigs = gigsRes.docs
  const deepDives = deepDivesRes.docs
  const playlists = playlistsRes.docs
  const notes = notesRes.docs

  /* ── Hero Slider: latest 6 posts (3 reviews, 2 gigs, 1 deep-dive) ── */
  const sliderPosts = [
    ...reviews.slice(0, 3).map((r: any) => ({
      type: 'review' as const,
      title: `${r.artist} — ${r.title}`,
      href: `/reviews/${r.slug}/`,
      meta: `${formatDate(r.reviewDate)} · ${r.rating}/10`,
      excerpt: r.excerpt,
      cover: getCoverUrl(r.cover),
      date: new Date(r.reviewDate),
      icon: 'review',
      label: 'Review',
      pillClass: 'pill-review',
    })),
    ...gigs.slice(0, 2).map((g: any) => ({
      type: 'gig' as const,
      title: g.title,
      href: `/gigs/${g.slug}/`,
      meta: `${formatDate(g.eventDate)} · ${g.city}`,
      excerpt: g.excerpt,
      cover: getCoverUrl(g.cover),
      date: new Date(g.eventDate),
      icon: 'gig',
      label: 'Gig',
      pillClass: 'pill-gig',
    })),
    ...deepDives.slice(0, 1).map((d: any) => ({
      type: 'deep-dive' as const,
      title: d.title,
      href: `/deep-dives/${d.slug}/`,
      meta: formatDate(d.publishedOn),
      excerpt: d.excerpt,
      cover: getCoverUrl(d.cover),
      date: new Date(d.publishedOn),
      icon: 'dive',
      label: 'Deep Dive',
      pillClass: 'pill-dive',
    })),
  ]
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
    .slice(0, 6)

  /* ── Signal board data ── */
  const latestReview: any = reviews[0]
  const latestNote: any = notes[0]
  const latestPlaylist: any = playlists[0]

  // Album of the Month
  const newestReviewDate = latestReview ? new Date(latestReview.reviewDate) : null
  const albumMonthPool = newestReviewDate
    ? reviews.filter((entry: any) => {
        const d = new Date(entry.reviewDate)
        return (
          d.getFullYear() === newestReviewDate.getFullYear() &&
          d.getMonth() === newestReviewDate.getMonth()
        )
      })
    : []

  const albumOfMonth: any = [...(albumMonthPool.length > 0 ? albumMonthPool : reviews)].sort(
    (a: any, b: any) => {
      if (b.rating !== a.rating) return b.rating - a.rating
      return new Date(b.reviewDate).valueOf() - new Date(a.reviewDate).valueOf()
    },
  )[0]

  const albumMonthLabel = albumOfMonth
    ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(
        new Date(albumOfMonth.reviewDate),
      )
    : 'No reviews yet'

  // Song of the Week
  const standoutTrack = latestReview?.standoutTracks
    ?.split(',')
    .map((t: string) => t.trim())
    .filter(Boolean)[0]
  const hasTrackPick = Boolean(standoutTrack && latestReview)

  const songOfWeekTitle =
    standoutTrack ?? latestNote?.title ?? 'A fresh pick lands soon'
  const songOfWeekSubtitle =
    hasTrackPick && latestReview
      ? `${latestReview.artist} · from ${latestReview.title}`
      : latestNote?.artist
        ? `${latestNote.artist} · listening note`
        : 'From the listening desk'
  const songOfWeekMeta =
    hasTrackPick && latestReview
      ? `Selected this week · ${formatDate(latestReview.reviewDate)}`
      : latestNote
        ? `Logged ${formatDate(latestNote.listenedOn)}`
        : 'Check back after the next listen'
  const songOfWeekHref =
    hasTrackPick && latestReview
      ? `/reviews/${latestReview.slug}/`
      : latestNote
        ? `/notes/${latestNote.slug}/`
        : '/reviews/'

  // Listening Now
  const noteTs = latestNote ? new Date(latestNote.listenedOn).valueOf() : 0
  const playlistTs = latestPlaylist ? new Date(latestPlaylist.publishedOn).valueOf() : 0

  const nowListening =
    playlistTs > noteTs && latestPlaylist
      ? {
          title: latestPlaylist.title,
          subtitle: `${latestPlaylist.platform} playlist`,
          meta: `Updated ${formatDate(latestPlaylist.publishedOn)}`,
          href: `/playlists/${latestPlaylist.slug}/`,
          cta: 'Open playlist',
        }
      : latestNote
        ? {
            title: latestNote.title,
            subtitle: latestNote.artist ?? 'Listening note',
            meta: `Logged ${formatDate(latestNote.listenedOn)}`,
            href: `/notes/${latestNote.slug}/`,
            cta: 'Read note',
          }
        : latestReview
          ? {
              title: `${latestReview.artist} — ${latestReview.title}`,
              subtitle: 'Latest album review',
              meta: `Reviewed ${formatDate(latestReview.reviewDate)}`,
              href: `/reviews/${latestReview.slug}/`,
              cta: 'Read review',
            }
          : {
              title: 'No listen logged yet',
              subtitle: 'Music in motion',
              meta: 'New updates coming soon',
              href: '/archive/',
              cta: 'Browse archive',
            }

  // Format links grid
  const formatLinks = [
    {
      title: 'Record Reviews',
      note: 'Full album listening sessions',
      href: '/reviews/',
      icon: 'turntable',
    },
    {
      title: 'Playlists',
      note: 'Curated by mood and moment',
      href: '/playlists/',
      icon: 'cassette',
    },
    {
      title: 'Deep Dives',
      note: 'Context, eras, and sonic detail',
      href: '/deep-dives/',
      icon: 'cd',
    },
    {
      title: 'Live Diaries',
      note: 'Venue notes and set memories',
      href: '/gigs/',
      icon: 'speaker',
    },
  ]

  /* ── Pinned + latest reviews ── */
  const pinnedReviews = reviews.filter((r: any) => r.pinned).slice(0, 2)
  const latestReviews = reviews.filter((r: any) => !r.pinned).slice(0, 3)

  /* ── From the Field ── */
  const latestGig: any = gigs[0]
  const latestDeepDive: any = deepDives[0]

  return (
    <div className="container">
      {/* ═══ HERO SLIDER ═══ */}
      <HeroSlider posts={sliderPosts} />

      {/* ═══ ON ROTATION ═══ */}
      <section className="signal-board section">
        <div className="section-head">
          <div>
            <h2 className="section-title">
              <Icon name="music" className="title-icon" />
              On Rotation
            </h2>
            <p>The headline picks right now.</p>
          </div>
        </div>

        <div className="signal-grid">
          <article className="signal-card">
            <div className="signal-top">
              <p className="signal-label">Song of the Week</p>
              <span className="signal-icon" aria-hidden="true">
                <Icon name="music" />
              </span>
            </div>
            <h3 className="signal-title">{songOfWeekTitle}</h3>
            <p className="signal-subtitle">{songOfWeekSubtitle}</p>
            <p className="signal-meta">{songOfWeekMeta}</p>
            <a className="signal-link" href={songOfWeekHref}>
              Open pick
            </a>
          </article>

          <article className="signal-card">
            <div className="signal-top">
              <p className="signal-label">Album of the Month</p>
              <span className="signal-icon" aria-hidden="true">
                <Icon name="review" />
              </span>
            </div>
            <h3 className="signal-title">
              {albumOfMonth
                ? `${albumOfMonth.artist} — ${albumOfMonth.title}`
                : 'No album selected yet'}
            </h3>
            <p className="signal-subtitle">
              {albumOfMonth
                ? `${albumMonthLabel} pick · ${albumOfMonth.rating}/10`
                : 'Waiting on the next review cycle'}
            </p>
            <p className="signal-meta">
              {albumOfMonth
                ? `Reviewed ${formatDate(albumOfMonth.reviewDate)}`
                : 'Keep listening'}
            </p>
            <a
              className="signal-link"
              href={albumOfMonth ? `/reviews/${albumOfMonth.slug}/` : '/reviews/'}
            >
              Read review
            </a>
          </article>

          <article className="signal-card">
            <div className="signal-top">
              <p className="signal-label">Listening Now</p>
              <span className="signal-icon" aria-hidden="true">
                <Icon name="headphones" />
              </span>
            </div>
            <h3 className="signal-title">{nowListening.title}</h3>
            <p className="signal-subtitle">{nowListening.subtitle}</p>
            <p className="signal-meta">{nowListening.meta}</p>
            <a className="signal-link" href={nowListening.href}>
              {nowListening.cta}
            </a>
          </article>
        </div>

        <div className="format-grid" aria-label="Music sections">
          {formatLinks.map((link) => (
            <a key={link.href} className="format-link" href={link.href}>
              <span className="format-icon" aria-hidden="true">
                <Icon name={link.icon as any} />
              </span>
              <div className="format-copy">
                <p className="format-title">{link.title}</p>
                <p className="format-note">{link.note}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ═══ PINNED ═══ */}
      {pinnedReviews.length > 0 && (
        <section className="section">
          <div className="section-head">
            <div>
              <h2 className="section-title">
                <Icon name="review" className="title-icon" /> Pinned
              </h2>
              <p>Anchor reviews that stay at the top.</p>
            </div>
          </div>
          <div className="grid">
            {pinnedReviews.map((entry: any) => (
              <PostCard
                key={entry.slug}
                title={`${entry.artist} — ${entry.title}`}
                href={`/reviews/${entry.slug}/`}
                meta={`${formatDate(entry.reviewDate)} · ${entry.rating}/10`}
                excerpt={entry.excerpt}
                label="Pinned"
                cover={getCoverUrl(entry.cover)}
                rating={entry.rating}
                square={true}
                pillClass="pill-review"
              />
            ))}
          </div>
        </section>
      )}

      {/* ═══ LATEST REVIEWS ═══ */}
      <section className="section">
        <div className="section-head">
          <div>
            <h2 className="section-title">
              <Icon name="vinyl" className="title-icon" /> Latest Reviews
            </h2>
            <p>
              Full-album listening notes for new releases and older records worth another spin.
            </p>
          </div>
          <a className="button ghost" href="/reviews/">
            All Reviews
          </a>
        </div>
        <div className="grid">
          {latestReviews.map((entry: any) => (
            <PostCard
              key={entry.slug}
              title={`${entry.artist} — ${entry.title}`}
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

      {/* ═══ FROM THE FIELD ═══ */}
      <section className="section">
        <div className="section-head">
          <div>
            <h2 className="section-title">
              <Icon name="speaker" className="title-icon" /> From the Field
            </h2>
            <p>Gig diaries, deep dives, playlists, and quick notes.</p>
          </div>
        </div>
        <div className="grid">
          {latestGig && (
            <PostCard
              title={latestGig.title}
              href={`/gigs/${latestGig.slug}/`}
              meta={`${formatDate(latestGig.eventDate)} · ${latestGig.city}`}
              excerpt={latestGig.excerpt}
              label="Gig"
              cover={getCoverUrl(latestGig.cover)}
              pillClass="pill-gig"
            />
          )}
          {latestDeepDive && (
            <PostCard
              title={latestDeepDive.title}
              href={`/deep-dives/${latestDeepDive.slug}/`}
              meta={formatDate(latestDeepDive.publishedOn)}
              excerpt={latestDeepDive.excerpt}
              label="Deep Dive"
              cover={getCoverUrl(latestDeepDive.cover)}
              pillClass="pill-dive"
            />
          )}
          {latestPlaylist && (
            <PostCard
              title={latestPlaylist.title}
              href={`/playlists/${latestPlaylist.slug}/`}
              meta={`${formatDate(latestPlaylist.publishedOn)} · ${latestPlaylist.platform}`}
              excerpt={latestPlaylist.excerpt}
              label="Playlist"
              cover={getCoverUrl(latestPlaylist.cover)}
              pillClass="pill-playlist"
            />
          )}
          {latestNote && (
            <PostCard
              title={latestNote.title}
              href={`/notes/${latestNote.slug}/`}
              meta={formatDate(latestNote.listenedOn)}
              excerpt={latestNote.excerpt}
              label="Note"
              cover={getCoverUrl(latestNote.cover)}
              pillClass="pill-note"
            />
          )}
        </div>
      </section>
    </div>
  )
}
