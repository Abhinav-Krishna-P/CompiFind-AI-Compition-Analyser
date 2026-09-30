import type { CollectionConfig } from 'payload'

export const ContentItems: CollectionConfig = {
  slug: 'content-items',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'sourceType', 'product', 'publishedAt'],
  },
  access: {
    create: ({ req }) => req.user?.collection === 'app-admin-users',
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'app-admin-users') return true
      return { createdBy: { equals: req.user.id } }
    },
    update: ({ req }) => req.user?.collection === 'app-admin-users',
    delete: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'app-admin-users') return true
      return { createdBy: { equals: req.user.id } }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'scrapeRun',
      type: 'relationship',
      relationTo: 'scrape-runs',
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'sourceType',
      type: 'select',
      required: true,
      options: [
        { label: 'News', value: 'news' },
        { label: 'Reddit', value: 'reddit' },
        { label: 'X / Twitter', value: 'x' },
        { label: 'Social Media', value: 'social' },
        { label: 'Product Launch', value: 'launches' },
        { label: 'Review', value: 'reviews' },
      ],
    },
    {
      name: 'url',
      type: 'text',
    },
    {
      name: 'snippet',
      type: 'textarea',
    },
    {
      name: 'competitor',
      type: 'relationship',
      relationTo: 'competitors',
    },
    {
      name: 'region',
      type: 'select',
      options: [
        { label: 'Global', value: 'global' },
        { label: 'United States', value: 'us' },
        { label: 'United Kingdom', value: 'uk' },
        { label: 'European Union', value: 'eu' },
        { label: 'Canada', value: 'ca' },
        { label: 'Australia', value: 'au' },
        { label: 'India', value: 'in' },
        { label: 'Southeast Asia', value: 'sea' },
        { label: 'Latin America', value: 'latam' },
        { label: 'Middle East', value: 'me' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
    {
      name: 'relevanceScore',
      type: 'number',
      admin: {
        description: 'AI-assigned relevance score 0-100',
      },
    },
  ],
}
