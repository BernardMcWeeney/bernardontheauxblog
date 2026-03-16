import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import PlaylistDetail from './PlaylistDetail'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'playlists',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  const playlist = docs[0]
  if (!playlist) return { title: 'Playlist Not Found' }

  return {
    title: `${playlist.title} — Bernard On The Aux`,
    description: playlist.excerpt || `Playlist: ${playlist.title}`,
  }
}

export default async function PlaylistDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'playlists',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })

  const playlist = docs[0]
  if (!playlist) notFound()

  const hdrs = await headers()
  const host = hdrs.get('host') || 'localhost:3000'
  const protocol = host.startsWith('localhost') ? 'http' : 'https'
  const serverURL = `${protocol}://${host}`

  return <PlaylistDetail initialData={playlist} serverURL={serverURL} />
}
