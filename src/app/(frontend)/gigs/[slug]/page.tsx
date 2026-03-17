import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { getArtistName } from '@/utils/artist'
import GigDetail from './GigDetail'

async function getGig(slug: string) {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'gigs',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
}

function getCoverUrl(cover: any): string | undefined {
  if (!cover) return undefined
  if (typeof cover === 'object' && cover?.url) return cover.url
  if (typeof cover === 'string') return cover
  return undefined
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const gig: any = await getGig(slug)
  if (!gig) return { title: 'Gig Not Found' }

  const metaTitle = gig.meta?.title || `${gig.title} — Bernard On The Aux`
  const metaDescription = gig.meta?.description || gig.excerpt || `Gig diary: ${gig.title}`
  const coverUrl = getCoverUrl(gig.meta?.image) || getCoverUrl(gig.cover)

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'article',
      ...(coverUrl ? { images: [{ url: coverUrl }] } : {}),
    },
    twitter: {
      card: coverUrl ? 'summary_large_image' : 'summary',
      title: metaTitle,
      description: metaDescription,
      ...(coverUrl ? { images: [coverUrl] } : {}),
    },
  }
}

export default async function GigDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const gig: any = await getGig(slug)
  if (!gig) notFound()

  const hdrs = await headers()
  const host = hdrs.get('host') || 'localhost:3000'
  const protocol = host.startsWith('localhost') ? 'http' : 'https'
  const serverURL = `${protocol}://${host}`

  const artistName = getArtistName(gig.artist)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Event',
        name: gig.title,
        ...(gig.eventDate ? { startDate: gig.eventDate } : {}),
        ...(gig.venue || gig.city
          ? {
              location: {
                '@type': 'Place',
                ...(gig.venue ? { name: gig.venue } : {}),
                ...(gig.city ? { address: { '@type': 'PostalAddress', addressLocality: gig.city } } : {}),
              },
            }
          : {}),
        ...(artistName ? { performer: { '@type': 'MusicGroup', name: artistName } } : {}),
        ...(gig.excerpt ? { description: gig.excerpt } : {}),
        review: {
          '@type': 'Review',
          author: { '@type': 'Person', name: 'Bernard McWeeney' },
          ...(gig.excerpt ? { reviewBody: gig.excerpt } : {}),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
          { '@type': 'ListItem', position: 2, name: 'Gigs', item: '/gigs/' },
          { '@type': 'ListItem', position: 3, name: gig.title, item: `/gigs/${gig.slug}/` },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GigDetail initialData={gig} serverURL={serverURL} />
    </>
  )
}
