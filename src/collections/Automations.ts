import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'

const setCreatedBy: CollectionBeforeChangeHook = ({ data, req, operation }) => {
  if (operation === 'create' && req.user) {
    data.createdBy = req.user.id
  }
  return data
}

export const Automations: CollectionConfig = {
  slug: 'automations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'product', 'status', 'interval', 'nextRunAt'],
  },
  access: {
    create: ({ req }) => !!req.user && req.user.collection === 'users',
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'app-admin-users') return true
      return { createdBy: { equals: req.user.id } }
    },
    update: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'app-admin-users') return true
      return { createdBy: { equals: req.user.id } }
    },
    delete: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'app-admin-users') return true
      return { createdBy: { equals: req.user.id } }
    },
  },
  hooks: {
    beforeChange: [setCreatedBy],
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
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Paused', value: 'paused' },
      ],
    },
    {
      name: 'interval',
      type: 'select',
      required: true,
      options: [
        { label: 'Every 6 hours', value: '6h' },
        { label: 'Every 12 hours', value: '12h' },
        { label: 'Daily', value: '24h' },
        { label: 'Every 3 days', value: '72h' },
        { label: 'Weekly', value: '168h' },
      ],
      admin: {
        description: 'How often this automation runs',
      },
    },
    {
      name: 'sources',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'News & Articles', value: 'news' },
        { label: 'Reddit', value: 'reddit' },
        { label: 'X / Twitter', value: 'x' },
        { label: 'Social Media', value: 'social' },
        { label: 'Product Launches', value: 'launches' },
        { label: 'Review Sites', value: 'reviews' },
      ],
    },
    {
      name: 'regions',
      type: 'select',
      hasMany: true,
      required: true,
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
      name: 'lastRunAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'nextRunAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
      },
    },
  ],
}
