import type { CollectionConfig } from 'payload'
import { generateExcerpt } from '../utils/autoExcerpt'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'artist', 'rating', 'reviewDate', 'published'],
    livePreview: {
      url: ({ data }) => {
        return `/reviews/${data?.slug || ''}`
      },
    },
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'headline',
      type: 'text',
      admin: {
        description: 'Optional clickbait/SEO headline. Shows on cards, slider, and social shares. Falls back to "Artist — Title" if empty.',
      },
    },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'reviewType', type: 'select', defaultValue: 'album', options: [
      { label: 'Album', value: 'album' },
      { label: 'Gig', value: 'gig' },
      { label: 'Artist', value: 'artist' },
      { label: 'Single', value: 'single' },
      { label: 'EP', value: 'ep' },
      { label: 'Film', value: 'film' },
      { label: 'Other', value: 'other' },
    ]},
    { name: 'artist', type: 'relationship', relationTo: 'artists' },
    { name: 'reviewDate', type: 'date', required: true },
    { name: 'listenedOn', type: 'date' },
    { name: 'rating', type: 'number', required: true, min: 0, max: 10 },
    { name: 'format', type: 'select', options: [
      { label: 'Vinyl', value: 'Vinyl' },
      { label: 'CD', value: 'CD' },
      { label: 'Digital', value: 'Digital' },
      { label: 'Stream', value: 'Stream' },
      { label: 'Cassette', value: 'Cassette' },
      { label: 'Other', value: 'Other' },
    ]},
    { name: 'label', type: 'relationship', relationTo: 'labels' },
    { name: 'releaseYear', type: 'number' },
    { name: 'standoutTracks', type: 'text' },
    { name: 'venue', type: 'text' },
    { name: 'city', type: 'text' },
    { name: 'eventDate', type: 'date' },
    { name: 'tags', type: 'text', hasMany: true },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Album cover art. Suggested alt text: "Album Cover — Artist — Title"' },
    },
    { name: 'excerpt', type: 'textarea' },
    { name: 'content', type: 'richText' },
    { name: 'published', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar' } },
    { name: 'pinned', type: 'checkbox', admin: { position: 'sidebar' } },
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
