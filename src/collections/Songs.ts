import type { CollectionConfig } from 'payload'

export const Songs: CollectionConfig = {
  slug: 'songs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'artist', 'album', 'released'],
    group: 'Music',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'artist', type: 'relationship', relationTo: 'artists', required: true },
    { name: 'album', type: 'relationship', relationTo: 'reviews', admin: { description: 'Link to album review if one exists' } },
    { name: 'released', type: 'date', admin: { description: 'Release date (optional)' } },
    { name: 'spotifyUrl', type: 'text', admin: { description: 'Spotify link' } },
    { name: 'youtubeUrl', type: 'text', admin: { description: 'YouTube link' } },
    { name: 'appleMusicUrl', type: 'text', admin: { description: 'Apple Music link' } },
  ],
}
