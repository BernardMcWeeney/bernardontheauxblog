import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Editorial',
  },
  fields: [
    // ── Now Playing ────────────────────────────────────────────────
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

    // ── Editorial Picks ────────────────────────────────────────────
    {
      name: 'albumOfTheMonth',
      type: 'group',
      label: 'Album of the Month',
      fields: [
        { name: 'review', type: 'relationship', relationTo: 'reviews', admin: { description: 'Link to a review in the Reviews collection' } },
        { name: 'blurb', type: 'textarea', admin: { description: 'Short editorial note — why this album, why now' } },
      ],
    },
    {
      name: 'featuredArtist',
      type: 'group',
      label: 'Featured Artist',
      fields: [
        { name: 'artist', type: 'relationship', relationTo: 'artists' },
        { name: 'note', type: 'text', admin: { description: 'e.g. "Essential listening", "Currently obsessed with"' } },
      ],
    },
    {
      name: 'featuredPlaylist',
      type: 'group',
      label: 'Featured Playlist',
      fields: [
        { name: 'playlist', type: 'relationship', relationTo: 'playlists' },
        { name: 'note', type: 'text', admin: { description: 'e.g. "Perfect for late nights", "Weekend mood"' } },
      ],
    },

    // ── Homepage ───────────────────────────────────────────────────
    {
      name: 'homepage',
      type: 'group',
      label: 'Homepage',
      fields: [
        {
          name: 'tagline',
          type: 'text',
          admin: { description: 'Short tagline shown in the hero — e.g. "Music writing from the listening room"' },
        },
        {
          name: 'heroEnabled',
          type: 'checkbox',
          label: 'Show hero slider',
          defaultValue: true,
        },
        {
          name: 'onRotationLabel',
          type: 'text',
          defaultValue: 'On Rotation',
          admin: { description: 'Label for the "On Rotation" picks section' },
        },
        {
          name: 'latestSectionLabel',
          type: 'text',
          defaultValue: 'Latest',
          admin: { description: 'Label for the latest content section' },
        },
        {
          name: 'showSubscribeBanner',
          type: 'checkbox',
          label: 'Show subscribe banner',
          defaultValue: true,
        },
        {
          name: 'subscribeBannerHeading',
          type: 'text',
          defaultValue: 'Stay in the loop',
          admin: { description: 'Heading for the newsletter subscribe banner' },
        },
        {
          name: 'subscribeBannerSubtext',
          type: 'text',
          admin: { description: 'Subtext beneath the subscribe heading' },
        },
      ],
    },

    // ── Social & Links ─────────────────────────────────────────────
    {
      name: 'social',
      type: 'group',
      label: 'Social & Links',
      fields: [
        { name: 'spotify', type: 'text', label: 'Spotify profile URL' },
        { name: 'instagram', type: 'text', label: 'Instagram URL' },
        { name: 'twitter', type: 'text', label: 'Twitter / X URL' },
        { name: 'letterboxd', type: 'text', label: 'Letterboxd URL' },
        { name: 'lastfm', type: 'text', label: 'Last.fm URL' },
        { name: 'rateyourmusic', type: 'text', label: 'RateYourMusic URL' },
        { name: 'bluesky', type: 'text', label: 'Bluesky URL' },
      ],
    },

    // ── SEO & Meta ─────────────────────────────────────────────────
    {
      name: 'seo',
      type: 'group',
      label: 'SEO & Meta',
      fields: [
        {
          name: 'siteDescription',
          type: 'textarea',
          admin: { description: 'Default meta description used on the homepage and as a fallback' },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Default OG / share image',
          admin: { description: 'Used when sharing homepage links on social media' },
        },
        {
          name: 'canonicalDomain',
          type: 'text',
          admin: { description: 'e.g. https://bernardontheaux.com — used for sitemap and canonical URLs' },
        },
      ],
    },
  ],
}
