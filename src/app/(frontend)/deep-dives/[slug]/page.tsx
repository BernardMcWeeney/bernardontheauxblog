import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import DeepDiveDetail from './DeepDiveDetail'

async function getDeepDive(slug: string) {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'deep-dives',
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
  const dive: any = await getDeepDive(slug)
  if (!dive) return { title: 'Deep Dive Not Found' }

  const metaTitle = dive.meta?.title || `${dive.title} — Bernard On The Aux`
  const metaDescription = dive.meta?.description || dive.excerpt || `Deep dive: ${dive.title}`
  const coverUrl = getCoverUrl(dive.meta?.image) || getCoverUrl(dive.cover)

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

export default async function DeepDiveDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const dive: any = await getDeepDive(slug)
  if (!dive) notFound()

  const hdrs = await headers()
  const host = hdrs.get('host') || 'localhost:3000'
  const protocol = host.startsWith('localhost') ? 'http' : 'https'
  const serverURL = `${protocol}://${host}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: dive.title,
        author: { '@type': 'Person', name: 'Bernard McWeeney' },
        ...(dive.publishedOn ? { datePublished: dive.publishedOn } : {}),
        ...(dive.updatedAt ? { dateModified: dive.updatedAt } : {}),
        ...(dive.excerpt ? { description: dive.excerpt } : {}),
        ...(getCoverUrl(dive.cover) ? { image: getCoverUrl(dive.cover) } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
          { '@type': 'ListItem', position: 2, name: 'Deep Dives', item: '/deep-dives/' },
          { '@type': 'ListItem', position: 3, name: dive.title, item: `/deep-dives/${dive.slug}/` },
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
      <DeepDiveDetail initialData={dive} serverURL={serverURL} />
    </>
  )
}
