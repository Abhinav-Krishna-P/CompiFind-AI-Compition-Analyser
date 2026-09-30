import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { appAgentsPlugin } from '@coldbrew/app-agents'
import { coldbrewAdapter } from '@coldbrew/db-coldbrew'
import { coldbrewEmailAdapter } from '@coldbrew/email-coldbrew'
import { coldbrewJobsAccessConfig } from '@coldbrew/jobs-coldbrew'
import { coldbrewStorage } from '@coldbrew/storage-coldbrew'

import { agents } from './agents'
import { AppAdminUsers } from './collections/AppAdminUsers'
import { PAYLOAD_ADMIN_ROUTE } from './lib/payload-routes'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  auth: {
    // Required: cookie-first auth for reverse proxy and iframe compatibility
    jwtOrder: ['cookie', 'JWT', 'Bearer'],
  },
  serverURL: process.env.APP_URL,
  admin: {
    user: AppAdminUsers.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    AppAdminUsers,
    /* Add your collections here.
       For apps with end users, add a domain auth collection (conventionally
       `users`) following the data-plane access posture. Every auth collection
       receives its OAuth AS and Payload API resource by default. */
  ],
  jobs: {
    /* Add your tasks and workflows here */
    ...coldbrewJobsAccessConfig,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: coldbrewAdapter(),
  email: coldbrewEmailAdapter(),
  sharp,
  routes: {
    admin: PAYLOAD_ADMIN_ROUTE,
  },
  plugins: [
    coldbrewStorage({
      collections: {
        /* Add your collections here
           who wants to use storage service
        */
      },
    }),
    /* The agent plumbing is baseline: every app carries it, and declaring an
       agent under src/agents/ is the only edit an app ever makes to turn it
       on. An app with no agents seeds nothing and dials nothing, so
       APP_AGENTS_URL being unset is a legitimate state — it is refused
       where it is needed, not at boot. */
    appAgentsPlugin({
      endpoint: process.env.APP_AGENTS_URL,
      agents,
    }),
  ],
})
