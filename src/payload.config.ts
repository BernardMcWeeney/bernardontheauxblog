import path from 'path'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import type { GetPlatformProxyOptions } from 'wrangler'
import { r2Storage } from '@payloadcms/storage-r2'
import { seoPlugin } from '@payloadcms/plugin-seo'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Artists } from './collections/Artists'
import { Labels } from './collections/Labels'
import { Reviews } from './collections/Reviews'
import { Gigs } from './collections/Gigs'
import { DeepDives } from './collections/DeepDives'
import { Playlists } from './collections/Playlists'
import { Notes } from './collections/Notes'
import { Subscribers } from './collections/Subscribers'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProduction = process.env.NODE_ENV === 'production'

// Detect Payload CLI (e.g. `payload migrate`). Wrapped in try/catch because
// fs operations may not be available in the Cloudflare Workers runtime.
let isCLI = false
try {
  const fs = await import('fs')
  isCLI = process.argv.some((value) => {
    if (!fs.existsSync(value)) return false
    return fs.realpathSync(value).endsWith(path.join('payload', 'bin.js'))
  })
} catch {
  // Workers runtime — not CLI
}

// CF_PAGES is set during Cloudflare Pages builds (not at runtime).
// During build, getCloudflareContext tries to connect to edge-preview which can timeout.
// Use wrangler's local proxy instead during the build phase.
const isCFPagesBuild = process.env.CF_PAGES === '1'

const cloudflare =
  isCLI || !isProduction
    ? await getCloudflareContextFromWrangler()
    : isCFPagesBuild
      ? await getCloudflareContextFromWrangler(false)
      : await getCloudflareContext({ async: true })

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Artists, Labels, Reviews, Gigs, DeepDives, Playlists, Notes, Subscribers],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
    seoPlugin({
      collections: ['reviews', 'gigs', 'deep-dives', 'playlists', 'notes'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }: any) => {
        if (doc?.headline) return `${doc.headline} | Bernard on the Aux`
        const artistName = typeof doc?.artist === 'object' ? doc.artist?.name : ''
        const prefix = artistName ? `${artistName} — ` : ''
        return `${prefix}${doc?.title || ''} | Bernard on the Aux`
      },
      generateDescription: ({ doc }: any) => {
        return doc?.excerpt || ''
      },
      generateURL: ({ doc, collectionSlug }: any) => {
        return `https://bernardontheaux.com/${collectionSlug}/${doc?.slug || ''}/`
      },
      generateImage: ({ doc }: any) => {
        if (typeof doc?.cover === 'object' && doc.cover?.id) {
          return doc.cover.id
        }
        return undefined
      },
    }),
  ],
})

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
function getCloudflareContextFromWrangler(remoteBindings?: boolean): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        remoteBindings: remoteBindings ?? isProduction,
      } satisfies GetPlatformProxyOptions),
  )
}
