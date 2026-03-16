import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { getArtistName } from '@/utils/artist'
import ReviewDetail from './ReviewDetail'

async function getReview(slug: string) {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'reviews',
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
  const review = await getReview(slug)
  if (!review) return {}

  const cover = review.cover
  const coverUrl =
    typeof cover === 'object' && cover?.url
      ? cover.url
      : typeof cover === 'string'
        ? cover
        : undefined

  const artistName = getArtistName(review.artist)
  const displayTitle = artistName
    ? `${artistName} — ${review.title}`
    : review.title

  const metaTitle = review.meta?.title || `${displayTitle} | Reviews | Bernard on the Aux`
  const metaDescription = review.meta?.description || review.excerpt || `Review of ${displayTitle}`
  const metaImage = review.meta?.image
  const metaImageUrl =
    typeof metaImage === 'object' && metaImage?.url
      ? metaImage.url
      : coverUrl

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      ...(metaImageUrl ? { images: [{ url: metaImageUrl }] } : {}),
    },
  }
}

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const review = await getReview(slug)
  if (!review) notFound()

  const hdrs = await headers()
  const host = hdrs.get('host') || 'localhost:3000'
  const protocol = host.startsWith('localhost') ? 'http' : 'https'
  const serverURL = `${protocol}://${host}`

  // JSON-LD structured data
  const artistName = getArtistName(review.artist)
  const displayTitle = artistName
    ? `${artistName} — ${review.title}`
    : review.title
  const cover = review.cover
  const coverUrl =
    typeof cover === 'object' && cover?.url
      ? cover.url
      : typeof cover === 'string'
        ? cover
        : undefined

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MusicAlbum',
        name: review.title,
        ...(artistName ? { byArtist: { '@type': 'MusicGroup', name: artistName } } : {}),
        ...(review.releaseYear ? { datePublished: String(review.releaseYear) } : {}),
        ...(coverUrl ? { image: coverUrl } : {}),
        review: {
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: review.rating,
            bestRating: 10,
            worstRating: 0,
          },
          ...(review.reviewDate ? { datePublished: review.reviewDate } : {}),
          author: {
            '@type': 'Person',
            name: 'Bernard McWeeney',
          },
          ...(review.excerpt ? { description: review.excerpt } : {}),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
          { '@type': 'ListItem', position: 2, name: 'Reviews', item: '/reviews/' },
          { '@type': 'ListItem', position: 3, name: displayTitle, item: `/reviews/${review.slug}/` },
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
      <ReviewDetail initialData={review} serverURL={serverURL} />
    </>
  )
}
