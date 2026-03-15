import type { CollectionConfig } from 'payload'

export const Playlists: CollectionConfig = {
  slug: 'playlists',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'platform', 'publishedOn', 'published'],
    livePreview: {
      url: ({ data }) => {
        return `/playlists/${data?.slug || ''}`
      },
    },
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'publishedOn', type: 'date', required: true },
    { name: 'platform', type: 'select', required: true, options: [
      { label: 'Spotify', value: 'Spotify' },
      { label: 'Apple Music', value: 'Apple Music' },
      { label: 'YouTube', value: 'YouTube' },
      { label: 'Tidal', value: 'Tidal' },
      { label: 'Bandcamp', value: 'Bandcamp' },
      { label: 'Other', value: 'Other' },
    ]},
    { name: 'playlistUrl', type: 'text', required: true },
    { name: 'embedUrl', type: 'text' },
    { name: 'mood', type: 'text' },
    { name: 'duration', type: 'number' },
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
