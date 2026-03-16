import type { CollectionConfig } from 'payload'
import { generateExcerpt } from '../utils/autoExcerpt'

export const Notes: CollectionConfig = {
  slug: 'notes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'artist', 'listenedOn', 'published'],
    livePreview: {
      url: ({ data }) => {
        return `/notes/${data?.slug || ''}`
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
    { name: 'listenedOn', type: 'date', required: true },
    { name: 'artist', type: 'relationship', relationTo: 'artists' },
    { name: 'source', type: 'text' },
    { name: 'tags', type: 'text', hasMany: true },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea' },
    { name: 'content', type: 'richText' },
    { name: 'published', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar' } },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (!data) return data

        // Auto-generate slug from title
        if (data.title && !data.slug) {
          data.slug = data.title
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
