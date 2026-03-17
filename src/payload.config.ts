import fs from 'fs'
import path from 'path'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'
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
import { Songs } from './collections/Songs'
import { Subscribers } from './collections/Subscribers'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const realpath = (value: string) => (fs.existsSync(value) ? fs.realpathSync(value) : undefined)

const isCLI = process.argv.some((value) => realpath(value)?.endsWith(path.join('payload', 'bin.js')))
const isProduction = process.env.NODE_ENV === 'production'

const createLog =
  (level: string, fn: typeof console.log) => (objOrMsg: object | string, msg?: string) => {
    if (typeof objOrMsg === 'string') {
      fn(JSON.stringify({ level, msg: objOrMsg }))
    } else {
      fn(JSON.stringify({ level, ...objOrMsg, msg: msg ?? (objOrMsg as { msg?: string }).msg }))
    }
  }

const cloudflareLogger = {
  level: process.env.PAYLOAD_LOG_LEVEL || 'info',
  trace: createLog('trace', console.debug),
  debug: createLog('debug', console.debug),
  info: createLog('info', console.log),
  warn: createLog('warn', console.warn),
  error: createLog('error', console.error),
  fatal: createLog('fatal', console.error),
  silent: () => {},
} as any

const cloudflare =
  isCLI || !isProduction
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true })

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      url: ({ data, collectionConfig, req }) => {
        const base = `${req.protocol}//${req.host}`
        const slug = data?.slug || ''
        const collectionSlug = collectionConfig?.slug
        if (collectionSlug === 'reviews') return `${base}/reviews/${slug}`
        if (collectionSlug === 'gigs') return `${base}/gigs/${slug}`
        if (collectionSlug === 'deep-dives') return `${base}/deep-dives/${slug}`
        if (collectionSlug === 'playlists') return `${base}/playlists/${slug}`
        if (collectionSlug === 'notes') return `${base}/notes/${slug}`
        return base
      },
      collections: ['reviews', 'gigs', 'deep-dives', 'playlists', 'notes'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  collections: [Users, Media, Artists, Labels, Reviews, Songs, Gigs, DeepDives, Playlists, Notes, Subscribers],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({ binding: cloudflare.env.D1, push: true }),
  logger: isProduction ? cloudflareLogger : undefined,
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
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        environment: process.env.CLOUDFLARE_ENV,
        remoteBindings: true,
      } satisfies GetPlatformProxyOptions),
  )
}
