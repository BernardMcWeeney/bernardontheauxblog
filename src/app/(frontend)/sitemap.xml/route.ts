import { getPayload } from 'payload'
import configPromise from '@payload-config'

const SITE_URL = 'https://bernardontheaux.com'

export async function GET() {
  const payload = await getPayload({ config: configPromise })

  const [reviews, gigs, deepDives, playlists, notes, artists] = await Promise.all([
    payload.find({ collection: 'reviews', where: { published: { equals: true } }, limit: 500, depth: 0 }),
    payload.find({ collection: 'gigs', where: { published: { equals: true } }, limit: 500, depth: 0 }),
    payload.find({ collection: 'deep-dives', where: { published: { equals: true } }, limit: 500, depth: 0 }),
    payload.find({ collection: 'playlists', where: { published: { equals: true } }, limit: 500, depth: 0 }),
    payload.find({ collection: 'notes', where: { published: { equals: true } }, limit: 500, depth: 0 }),
    payload.find({ collection: 'artists', limit: 500, depth: 0 }),
  ])

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/reviews/', priority: '0.9', changefreq: 'daily' },
    { loc: '/gigs/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/deep-dives/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/playlists/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/notes/', priority: '0.7', changefreq: 'weekly' },
    { loc: '/artists/', priority: '0.8', changefreq: 'weekly' },
    { loc: '/archive/', priority: '0.6', changefreq: 'weekly' },
  ]

  const dynamicPages = [
    ...reviews.docs.map((d: any) => ({
      loc: `/reviews/${d.slug}/`,
      lastmod: d.updatedAt,
      priority: '0.8',
      changefreq: 'monthly',
    })),
    ...gigs.docs.map((d: any) => ({
      loc: `/gigs/${d.slug}/`,
      lastmod: d.updatedAt,
      priority: '0.7',
      changefreq: 'monthly',
    })),
    ...deepDives.docs.map((d: any) => ({
      loc: `/deep-dives/${d.slug}/`,
      lastmod: d.updatedAt,
      priority: '0.7',
      changefreq: 'monthly',
    })),
    ...playlists.docs.map((d: any) => ({
      loc: `/playlists/${d.slug}/`,
      lastmod: d.updatedAt,
      priority: '0.6',
      changefreq: 'monthly',
    })),
    ...notes.docs.map((d: any) => ({
      loc: `/notes/${d.slug}/`,
      lastmod: d.updatedAt,
      priority: '0.6',
      changefreq: 'monthly',
    })),
    ...artists.docs.map((d: any) => ({
      loc: `/artists/${d.slug}/`,
      lastmod: d.updatedAt,
      priority: '0.7',
      changefreq: 'weekly',
    })),
  ]

  const allPages: Array<{ loc: string; priority: string; changefreq: string; lastmod?: string }> = [...staticPages, ...dynamicPages]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    ${p.lastmod ? `<lastmod>${new Date(p.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
