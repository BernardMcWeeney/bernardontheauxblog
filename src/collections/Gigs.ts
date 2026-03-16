import type { CollectionConfig } from 'payload'
import { generateExcerpt } from '../utils/autoExcerpt'

export const Gigs: CollectionConfig = {
  slug: 'gigs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'artist', 'venue', 'eventDate', 'published'],
    livePreview: {
      url: ({ data }) => {
        return `/gigs/${data?.slug || ''}`
      },
    },
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'headline',
      type: 'text',
      admin: {
        description: 'Optional clickbait/SEO headline. Shows on cards and social shares. Falls back to title if empty.',
      },
    },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'artist', type: 'relationship', relationTo: 'artists', required: true },
    { name: 'venue', type: 'text', required: true },
    { name: 'city', type: 'text', required: true },
    { name: 'eventDate', type: 'date', required: true },
    { name: 'tour', type: 'text' },
    { name: 'support', type: 'text' },
    { name: 'highlights', type: 'textarea' },
    { name: 'tags', type: 'text', hasMany: true },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea' },
    { name: 'content', type: 'richText' },
    { name: 'published', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar' } },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!data) return data

        // Auto-generate slug from artist + title
        if (data.title && !data.slug) {
          let prefix = ''
          if (data.artist && req?.payload) {
            try {
              const artistDoc = await req.payload.findByID({
                collection: 'artists',
                id: data.artist,
                depth: 0,
              })
              if (artistDoc?.name) {
                prefix = artistDoc.name
              }
            } catch {
              // fallback: no prefix
            }
          }
          const slugSource = prefix ? `${prefix} ${data.title}` : data.title
          data.slug = slugSource
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
        }

        // Auto-generate excerpt from content
        if (!data.excerpt && data.content) {
          const excerpt = generateExcerpt(data.content)
          if (excerpt) data.excerpt = excerpt
        }

        return data
      },
    ],
  },
}
