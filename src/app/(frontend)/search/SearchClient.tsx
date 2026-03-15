'use client'

import { useState, useMemo, useCallback } from 'react'
import Icon from '@/components/Icon'

interface SearchItem {
  title: string
  href: string
  collection: string
  collectionLabel: string
  excerpt: string
  artist: string
  tags: string[]
  date: string
  coverUrl?: string
}

const COLLECTION_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'reviews', label: 'Reviews', icon: 'review' as const },
  { value: 'gigs', label: 'Gigs', icon: 'gig' as const },
  { value: 'deep-dives', label: 'Deep Dives', icon: 'dive' as const },
  { value: 'playlists', label: 'Playlists', icon: 'playlist' as const },
  { value: 'notes', label: 'Notes', icon: 'note' as const },
]

const PILL_CLASS: Record<string, string> = {
  reviews: 'pill-review',
  gigs: 'pill-gig',
  'deep-dives': 'pill-dive',
  playlists: 'pill-playlist',
  notes: 'pill-note',
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.valueOf())) return ''
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function matchesQuery(item: SearchItem, query: string): boolean {
  const q = query.toLowerCase()
  return (
    item.title.toLowerCase().includes(q) ||
    item.artist.toLowerCase().includes(q) ||
    item.excerpt.toLowerCase().includes(q) ||
    item.tags.some((t) => t.toLowerCase().includes(q))
  )
}

export default function SearchClient({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState('')
  const [activeCollection, setActiveCollection] = useState('all')

  const handleFilterClick = useCallback((value: string) => {
    setActiveCollection(value)
  }, [])

  const results = useMemo(() => {
    if (!query.trim()) return []
    return items
      .filter((item) => matchesQuery(item, query.trim()))
      .filter((item) => activeCollection === 'all' || item.collection === activeCollection)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 50)
  }, [query, activeCollection, items])

  const filteredCount = useMemo(() => {
    if (!query.trim()) return 0
    return items.filter((item) => matchesQuery(item, query.trim())).length
  }, [query, items])

  return (
    <div className="container">
      <header className="page-header">
        <p className="eyebrow">Search</p>
        <h1 className="title-with-icon">
          <Icon name="search" className="title-icon" />
          Search
        </h1>
        <p>Find posts by title, artist, tag, or keyword.</p>
      </header>

      <div className="search-panel">
        <label htmlFor="search-input" className="sr-only">
          Search all content
        </label>
        <input
          id="search-input"
          type="search"
          className="search-input"
          placeholder="Search reviews, gigs, playlists..."
          autoComplete="off"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <nav className="search-filters" aria-label="Filter by content type">
          <span className="filter-label">Filter</span>
          {COLLECTION_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`filter-pill${activeCollection === f.value ? ' active' : ''}`}
              onClick={() => handleFilterClick(f.value)}
              aria-pressed={activeCollection === f.value}
            >
              {f.icon && <Icon name={f.icon} size={12} />}
              {f.label}
            </button>
          ))}
        </nav>

        <div className="search-results" role="region" aria-live="polite" aria-label="Search results">
          {!query.trim() && (
            <p className="search-hint">Start typing to search across {items.length} posts...</p>
          )}

          {query.trim() && results.length === 0 && (
            <div className="search-empty">
              <p>No results for &ldquo;{query}&rdquo;</p>
              {activeCollection !== 'all' && (
                <p>
                  Try searching in{' '}
                  <button
                    type="button"
                    className="search-empty-link"
                    onClick={() => setActiveCollection('all')}
                  >
                    all collections
                  </button>
                  .
                </p>
              )}
            </div>
          )}

          {results.length > 0 && (
            <>
              <p className="search-count">
                {results.length === filteredCount
                  ? `${results.length} result${results.length === 1 ? '' : 's'}`
                  : `Showing ${results.length} of ${filteredCount} results`}
                {' '}for &ldquo;{query}&rdquo;
                {activeCollection !== 'all' && (
                  <> in <strong>{COLLECTION_FILTERS.find((f) => f.value === activeCollection)?.label}</strong></>
                )}
              </p>

              <ul className="search-result-list">
                {results.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="search-result-card">
                      <div className="search-result-head">
                        <span className={`pill ${PILL_CLASS[item.collection] || ''}`}>
                          {item.collectionLabel}
                        </span>
                        {item.date && (
                          <time className="search-result-date" dateTime={item.date}>
                            {formatDate(item.date)}
                          </time>
                        )}
                      </div>
                      <h3 className="search-result-title">
                        {item.artist ? `${item.artist} \u2014 ${item.title}` : item.title}
                      </h3>
                      {item.excerpt && (
                        <p className="search-result-excerpt">{item.excerpt}</p>
                      )}
                      {item.tags.length > 0 && (
                        <div className="search-result-tags">
                          {item.tags.map((tag) => (
                            <span key={tag} className="detail-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <style>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
        .search-panel {
          max-width: 720px;
        }
        .search-input {
          width: 100%;
          padding: 0.9rem 1.1rem;
          font-size: 1rem;
          border: 2px solid var(--ink);
          border-radius: var(--radius);
          background: var(--bg);
          color: var(--ink);
          outline: none;
          font-family: var(--font-body);
          transition: border-color 0.15s ease;
        }
        .search-input:focus {
          border-color: var(--accent);
        }
        .search-input::placeholder {
          color: var(--muted);
        }
        .search-filters {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.4rem;
          margin-top: 1rem;
          padding: 0.5rem 0;
        }
        .search-results {
          margin-top: 2rem;
        }
        .search-hint {
          color: var(--muted);
          font-style: italic;
        }
        .search-empty {
          color: var(--muted);
          font-style: italic;
        }
        .search-empty-link {
          background: none;
          border: none;
          color: var(--accent);
          cursor: pointer;
          text-decoration: underline;
          font: inherit;
          font-style: italic;
          padding: 0;
        }
        .search-empty-link:hover {
          color: var(--accent-strong);
        }
        .search-count {
          font-size: 0.85rem;
          color: var(--muted);
          margin-bottom: 1.5rem;
          font-family: var(--font-label);
          letter-spacing: 0.05em;
        }
        .search-count strong {
          color: var(--ink);
        }
        .search-result-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 0.8rem;
        }
        .search-result-card {
          display: block;
          padding: 1.2rem;
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: var(--card);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          color: inherit;
          text-decoration: none;
        }
        .search-result-card:hover {
          border-color: var(--ink);
          box-shadow: var(--shadow-sm);
          color: inherit;
        }
        .search-result-head {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .search-result-date {
          font-size: 0.7rem;
          color: var(--muted);
          font-family: var(--font-label);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .search-result-title {
          margin: 0;
          font-size: 1.1rem;
          color: var(--ink);
          line-height: 1.3;
        }
        .search-result-excerpt {
          margin: 0.4rem 0 0;
          font-size: 0.88rem;
          color: var(--muted);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .search-result-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-top: 0.7rem;
        }
      `}</style>
    </div>
  )
}
