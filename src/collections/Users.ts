import type { CollectionConfig } from 'payload'
import { isLoggedInAppAdmin } from './AppAdminUsers'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    verify: false,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'createdAt'],
  },
  access: {
    create: isLoggedInAppAdmin,
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'app-admin-users') return true
      return { id: { equals: req.user.id } }
    },
    update: ({ req }) => {
      if (!req.user) return false
      if (req.user.collection === 'app-admin-users') return true
      return { id: { equals: req.user.id } }
    },
    delete: isLoggedInAppAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}
