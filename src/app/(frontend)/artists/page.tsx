import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Icon from '@/components/Icon'

export const metadata: Metadata = {
  title: 'Artists | Bernard on the Aux',
  description: 'Browse all artists reviewed, seen live, or featured on Bernard on the Aux.',
}

export default async function ArtistsPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs: artists } = await payload.find({
    collection: 'artists',
    sort: 'name',
    limit: 500,
    depth: 1,
  })

  return (
    <div className="container">
      <div className="post-layout">
        <Link href="/" className="post-back">
          &larr; Home
        </Link>

        <div className="section-head">
          <div>
            <h1 className="section-title">
              <Icon name="music" className="title-icon" /> Artists
            </h1>
            <p>Everyone reviewed, seen live, or featured on the site.</p>
          </div>
        </div>

        {artists.length === 0 ? (
          <p className="empty-state">No artists yet. Check back after the first review.</p>
        ) : (
          <div className="grid">
            {artists.map((artist: any) => {
              const imageUrl =
                typeof artist.image === 'object' && artist.image?.url
                  ? artist.image.url
                  : undefined

              return (
                <Link
                  key={artist.slug}
                  href={`/artists/${artist.slug}/`}
                  className="format-link"
                >
                  {imageUrl ? (
                    <span className="format-icon" style={{ position: 'relative', overflow: 'hidden' }}>
                      <Image
                        src={imageUrl}
                        alt={artist.name}
                        fill
                        sizes="48px"
                        style={{ objectFit: 'cover', borderRadius: 'var(--radius)' }}
                      />
                    </span>
                  ) : (
                    <span className="format-icon" aria-hidden="true">
                      <Icon name="music" />
                    </span>
                  )}
                  <div className="format-copy">
                    <p className="format-title">{artist.name}</p>
                    {artist.bio && (
                      <p className="format-note">
                        {artist.bio.length > 80 ? artist.bio.substring(0, 80) + '...' : artist.bio}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
