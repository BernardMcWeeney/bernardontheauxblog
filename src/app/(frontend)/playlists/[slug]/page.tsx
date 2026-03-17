import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import PlaylistDetail from './PlaylistDetail'

async function getPlaylist(slug: string) {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'playlists',
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
  const playlist: any = await getPlaylist(slug)
  if (!playlist) return { title: 'Playlist Not Found' }

  const metaTitle = playlist.meta?.title || `${playlist.title} — Bernard On The Aux`
  const metaDescription = playlist.meta?.description || playlist.excerpt || `Playlist: ${playlist.title}`
  const coverUrl = getCoverUrl(playlist.meta?.image) || getCoverUrl(playlist.cover)

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

export default async function PlaylistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const playlist: any = await getPlaylist(slug)
  if (!playlist) notFound()

  const hdrs = await headers()
  const host = hdrs.get('host') || 'localhost:3000'
  const protocol = host.startsWith('localhost') ? 'http' : 'https'
  const serverURL = `${protocol}://${host}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MusicPlaylist',
        name: playlist.title,
        author: { '@type': 'Person', name: 'Bernard McWeeney' },
        ...(playlist.publishedOn ? { datePublished: playlist.publishedOn } : {}),
        ...(playlist.excerpt ? { description: playlist.excerpt } : {}),
        ...(getCoverUrl(playlist.cover) ? { image: getCoverUrl(playlist.cover) } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
          { '@type': 'ListItem', position: 2, name: 'Playlists', item: '/playlists/' },
          { '@type': 'ListItem', position: 3, name: playlist.title, item: `/playlists/${playlist.slug}/` },
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
      <PlaylistDetail initialData={playlist} serverURL={serverURL} />
    </>
  )
}
