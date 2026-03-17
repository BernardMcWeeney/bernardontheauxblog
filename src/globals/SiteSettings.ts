import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Editorial',
  },
  fields: [
    {
      name: 'songOfTheWeek',
      type: 'group',
      label: 'Song of the Week',
      fields: [
        { name: 'title', type: 'text', required: true, admin: { description: 'Song title' } },
        { name: 'artist', type: 'text', required: true },
        { name: 'context', type: 'text', admin: { description: 'e.g. "from People Watching" or "latest single"' } },
        { name: 'link', type: 'relationship', relationTo: 'reviews', admin: { description: 'Link to a review (optional)' } },
        { name: 'externalUrl', type: 'text', admin: { description: 'Or link to Spotify/YouTube/etc instead' } },
      ],
    },
    {
      name: 'nowListening',
      type: 'group',
      label: 'Now Listening',
      fields: [
        { name: 'title', type: 'text', required: true, admin: { description: 'What you\'re listening to' } },
        { name: 'subtitle', type: 'text', admin: { description: 'e.g. artist name or context' } },
        { name: 'link', type: 'relationship', relationTo: ['reviews', 'playlists', 'notes'], admin: { description: 'Link to related content (optional)' } },
        { name: 'externalUrl', type: 'text', admin: { description: 'Or link to Spotify/YouTube/etc' } },
      ],
    },
  ],
}
