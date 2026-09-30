import type { CollectionConfig } from 'payload'

export const ScrapeRuns: CollectionConfig = {
  slug: 'scrape-runs',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['automation', 'status', 'triggeredAt', 'completedAt'],
  },
  access: {
    create: ({ req }) => req.user?.collection === 'app-admin-users',
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'app-admin-users') return true
      return { createdBy: { equals: req.user.id } }
    },
    update: ({ req }) => req.user?.collection === 'app-admin-users',
    delete: ({ req }) => req.user?.collection === 'app-admin-users',
  },
  fields: [
    {
      name: 'automation',
      type: 'relationship',
      relationTo: 'automations',
      required: true,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Running', value: 'running' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'triggerType',
      type: 'select',
      required: true,
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Manual', value: 'manual' },
      ],
    },
    {
      name: 'triggeredAt',
      type: 'date',
    },
    {
      name: 'completedAt',
      type: 'date',
    },
    {
      name: 'errorMessage',
      type: 'textarea',
    },
    {
      name: 'summary',
      type: 'textarea',
      admin: {
        description: 'AI-generated summary of findings',
      },
    },
  ],
}
