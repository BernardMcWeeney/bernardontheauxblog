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
    { name: 'cover', type: 'upload', relationTo: 'media', admin: { description: 'Album art / song artwork' } },
    { name: 'released', type: 'date', admin: { description: 'Release date (optional)' } },
    { name: 'spotifyUrl', type: 'text', admin: { description: 'Spotify track link (e.g. https://open.spotify.com/track/...)' } },
    { name: 'spotifyEmbedUrl', type: 'text', admin: { description: 'Spotify embed URL (e.g. https://open.spotify.com/embed/track/...)' } },
    { name: 'youtubeUrl', type: 'text', admin: { description: 'YouTube link' } },
    { name: 'appleMusicUrl', type: 'text', admin: { description: 'Apple Music link' } },
  ],
}
