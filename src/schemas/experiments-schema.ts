
import type { CollectionSchema } from 'deepspace/schema'

export const experimentsSchema: CollectionSchema = {
  name: 'experiments',
  columns: [
    { name: 'title', storage: 'text', interpretation: 'plain', required: true },
    { name: 'description', storage: 'text', interpretation: 'plain' },
    { name: 'robot', storage: 'text', interpretation: 'plain' },
    { name: 'simulator', storage: 'text', interpretation: 'plain' },
    { name: 'status', storage: 'text', interpretation: 'plain', required: true },
    { name: 'hypothesis', storage: 'text', interpretation: 'plain' },
    {
      name: 'ownerId',
      storage: 'text',
      interpretation: 'plain',
      required: true,
      userBound: true,
      immutable: true,
    },
  ],
  ownerField: 'ownerId',
  permissions: {
    viewer: { read: false, create: false, update: false, delete: false },
    member: { read: 'own', create: true, update: 'own', delete: 'own' },
    admin: { read: true, create: true, update: true, delete: true },
  },
}
