import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import DeepDiveDetail from './DeepDiveDetail'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'deep-dives',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  const dive = docs[0]
  if (!dive) return { title: 'Deep Dive Not Found' }

  return {
    title: `${dive.title} — Bernard On The Aux`,
    description: dive.excerpt || `Deep dive: ${dive.title}`,
  }
}

export default async function DeepDiveDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'deep-dives',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })

  const dive = docs[0]
  if (!dive) notFound()

  const hdrs = await headers()
  const host = hdrs.get('host') || 'localhost:3000'
  const protocol = host.startsWith('localhost') ? 'http' : 'https'
  const serverURL = `${protocol}://${host}`

  return <DeepDiveDetail initialData={dive} serverURL={serverURL} />
}
