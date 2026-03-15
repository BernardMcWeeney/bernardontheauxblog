import type { CollectionConfig } from 'payload'

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
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'artist', type: 'text', required: true },
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
