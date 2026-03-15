import type { CollectionConfig } from 'payload'

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
    { name: 'artist', type: 'text' },
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
    { name: 'label', type: 'text' },
    { name: 'releaseYear', type: 'number' },
    { name: 'standoutTracks', type: 'text' },
    { name: 'venue', type: 'text' },
    { name: 'city', type: 'text' },
    { name: 'eventDate', type: 'date' },
    { name: 'tags', type: 'text', hasMany: true },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea' },
    { name: 'content', type: 'richText' },
    { name: 'published', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar' } },
    { name: 'pinned', type: 'checkbox', admin: { position: 'sidebar' } },
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
