import type { CollectionConfig } from 'payload'

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
      ({ data }) => {
        if (data && data.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
        }
        return data
      },
    ],
  },
}
