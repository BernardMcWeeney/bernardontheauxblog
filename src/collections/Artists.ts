import type { CollectionConfig } from 'payload'

export const Artists: CollectionConfig = {
  slug: 'artists',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  fields: [
    // Field order must match existing D1 column order to avoid table recreation
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, admin: { position: 'sidebar' } },
    { name: 'bio', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'origin', type: 'text', admin: { description: 'Where the artist is from (e.g. "Newcastle, England")' } },
    { name: 'founded', type: 'text', admin: { description: 'Year formed or born (e.g. "2017" or "1976")' } },
    { name: 'genre', type: 'text', admin: { description: 'Primary genre (e.g. "Indie Rock", "Post-Punk")' } },
    { name: 'label', type: 'relationship', relationTo: 'labels', admin: { description: 'Current or primary label' } },
    { name: 'spotifyUrl', type: 'text', admin: { description: 'Spotify artist link', position: 'sidebar' } },
    { name: 'websiteUrl', type: 'text', admin: { description: 'Official website', position: 'sidebar' } },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data && data.name && !data.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
        }
        return data
      },
    ],
  },
}
