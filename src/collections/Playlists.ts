import type { CollectionConfig } from 'payload'
import { generateExcerpt } from '../utils/autoExcerpt'

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
    {
      name: 'headline',
      type: 'text',
      admin: {
        description: 'Optional clickbait/SEO headline. Shows on cards and social shares. Falls back to title if empty.',
      },
    },
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
    { name: 'embedUrl', type: 'text', admin: { description: 'Paste the Spotify/Apple Music embed iframe or URL — the src will be extracted automatically' } },
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
      async ({ data }) => {
        if (!data) return data

        // Auto-generate slug from title
        if (data.title && !data.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
        }

        // Extract src from iframe paste for embed URL
        if (data.embedUrl) {
          const match = data.embedUrl.match(/src=["']([^"']+)["']/)
          if (match) data.embedUrl = match[1]
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
