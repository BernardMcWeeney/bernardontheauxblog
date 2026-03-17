import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { getArtistName } from '@/utils/artist'
import NoteDetail from './NoteDetail'

async function getNote(slug: string) {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'notes',
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
  const note: any = await getNote(slug)
  if (!note) return { title: 'Note Not Found' }

  const metaTitle = note.meta?.title || `${note.title} — Bernard On The Aux`
  const metaDescription = note.meta?.description || note.excerpt || `Listening note: ${note.title}`
  const coverUrl = getCoverUrl(note.meta?.image) || getCoverUrl(note.cover)

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

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const note: any = await getNote(slug)
  if (!note) notFound()

  const hdrs = await headers()
  const host = hdrs.get('host') || 'localhost:3000'
  const protocol = host.startsWith('localhost') ? 'http' : 'https'
  const serverURL = `${protocol}://${host}`

  const artistName = getArtistName(note.artist)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: note.title,
        author: { '@type': 'Person', name: 'Bernard McWeeney' },
        ...(note.listenedOn ? { datePublished: note.listenedOn } : {}),
        ...(note.excerpt ? { description: note.excerpt } : {}),
        ...(getCoverUrl(note.cover) ? { image: getCoverUrl(note.cover) } : {}),
        ...(artistName ? { about: { '@type': 'MusicGroup', name: artistName } } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
          { '@type': 'ListItem', position: 2, name: 'Notes', item: '/notes/' },
          { '@type': 'ListItem', position: 3, name: note.title, item: `/notes/${note.slug}/` },
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
      <NoteDetail initialData={note} serverURL={serverURL} />
    </>
  )
}
