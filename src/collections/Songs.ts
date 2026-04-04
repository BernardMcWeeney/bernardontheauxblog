import type { CollectionConfig } from 'payload'

/** Extract src URL from an iframe string, or return the value as-is if it's already a URL */
function extractEmbedSrc(value: string | undefined): string | undefined {
  if (!value) return undefined
  const match = value.match(/src=["']([^"']+)["']/)
  return match ? match[1] : value
}

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
    { name: 'spotifyEmbedUrl', type: 'text', admin: { description: 'Paste the Spotify embed iframe or URL — the src will be extracted automatically' } },
    { name: 'youtubeUrl', type: 'text', admin: { description: 'YouTube link' } },
    { name: 'appleMusicUrl', type: 'text', admin: { description: 'Apple Music link' } },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data) return data
        if (data.spotifyEmbedUrl) {
          data.spotifyEmbedUrl = extractEmbedSrc(data.spotifyEmbedUrl)
        }
        return data
      },
    ],
  },
}
