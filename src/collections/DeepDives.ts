import type { CollectionConfig } from 'payload'
import { generateExcerpt } from '../utils/autoExcerpt'

export const DeepDives: CollectionConfig = {
  slug: 'deep-dives',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'topic', 'publishedOn', 'published'],
    livePreview: {
      url: ({ data }) => {
        return `/deep-dives/${data?.slug || ''}`
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
    { name: 'publishedOn', type: 'date', required: true },
    { name: 'topic', type: 'text' },
    { name: 'era', type: 'text' },
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
