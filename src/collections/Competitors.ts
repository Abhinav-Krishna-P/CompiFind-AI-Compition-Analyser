import type { CollectionConfig } from 'payload'

export const Competitors: CollectionConfig = {
  slug: 'competitors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'product', 'website', 'scrapeRun'],
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
      name: 'name',
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
      name: 'website',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'strengths',
      type: 'textarea',
    },
    {
      name: 'weaknesses',
      type: 'textarea',
    },
    {
      name: 'pricingInfo',
      type: 'text',
    },
    {
      name: 'regions',
      type: 'select',
      hasMany: true,
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
      name: 'sourceUrl',
      type: 'text',
    },
    {
      name: 'isOneClick',
      type: 'checkbox',
      admin: {
        description: 'Found via one-click discovery (not a scheduled run)',
      },
    },
  ],
}
