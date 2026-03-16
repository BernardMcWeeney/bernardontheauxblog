import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import GigDetail from './GigDetail'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'gigs',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  const gig = docs[0]
  if (!gig) return { title: 'Gig Not Found' }

  const metaTitle = gig.meta?.title || `${gig.title} — Bernard On The Aux`
  const metaDescription = gig.meta?.description || gig.excerpt || `Gig diary: ${gig.title}`

  return {
    title: metaTitle,
    description: metaDescription,
  }
}

export default async function GigDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'gigs',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })

  const gig = docs[0]
  if (!gig) notFound()

  const hdrs = await headers()
  const host = hdrs.get('host') || 'localhost:3000'
  const protocol = host.startsWith('localhost') ? 'http' : 'https'
  const serverURL = `${protocol}://${host}`

  return <GigDetail initialData={gig} serverURL={serverURL} />
}
