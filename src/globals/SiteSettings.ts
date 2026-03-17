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
        { name: 'song', type: 'relationship', relationTo: 'songs', admin: { description: 'Pick a song from the Songs collection' } },
        { name: 'context', type: 'text', admin: { description: 'e.g. "from People Watching" or "on repeat this week"' } },
      ],
    },
    {
      name: 'nowListening',
      type: 'group',
      label: 'Now Listening',
      fields: [
        { name: 'song', type: 'relationship', relationTo: 'songs', admin: { description: 'What you\'re listening to right now' } },
        { name: 'subtitle', type: 'text', admin: { description: 'e.g. "On repeat" or "Late night vibes"' } },
        { name: 'externalUrl', type: 'text', admin: { description: 'Override link to Spotify/YouTube/etc' } },
      ],
    },
  ],
}
