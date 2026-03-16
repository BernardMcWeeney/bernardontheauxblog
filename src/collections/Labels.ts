import type { CollectionConfig } from 'payload'

export const Labels: CollectionConfig = {
  slug: 'labels',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
  },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
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
