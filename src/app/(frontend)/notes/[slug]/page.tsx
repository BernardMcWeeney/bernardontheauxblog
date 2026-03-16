import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import NoteDetail from './NoteDetail'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'notes',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  const note = docs[0]
  if (!note) return { title: 'Note Not Found' }

  const metaTitle = note.meta?.title || `${note.title} — Bernard On The Aux`
  const metaDescription = note.meta?.description || note.excerpt || `Listening note: ${note.title}`

  return {
    title: metaTitle,
    description: metaDescription,
  }
}

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'notes',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })

  const note = docs[0]
  if (!note) notFound()

  const hdrs = await headers()
  const host = hdrs.get('host') || 'localhost:3000'
  const protocol = host.startsWith('localhost') ? 'http' : 'https'
  const serverURL = `${protocol}://${host}`

  return <NoteDetail initialData={note} serverURL={serverURL} />
}
