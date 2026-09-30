import type { CollectionConfig, CollectionBeforeChangeHook } from 'payload'

const setCreatedBy: CollectionBeforeChangeHook = ({ data, req, operation }) => {
  if (operation === 'create' && req.user) {
    data.createdBy = req.user.id
  }
  return data
}

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'niche', 'regions', 'createdAt'],
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
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'niche',
      type: 'text',
      required: true,
      admin: {
        description: 'The product category or market niche (e.g. "project management software", "organic skincare")',
      },
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
      name: 'website',
      type: 'text',
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
