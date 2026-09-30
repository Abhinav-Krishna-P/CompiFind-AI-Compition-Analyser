import { headers } from 'next/headers'
import { getPayload } from 'payload'

import config from '@/payload.config'

export async function getAuth() {
  // Establish request-time context before initializing Payload. Payload and its
  // dependencies may read the clock synchronously, which must not happen while
  // Next.js is producing the static shell with Cache Components enabled.
  const headersList = new Headers(await headers())
  const payload = await getPayload({ config })
  let user = null
  try {
    // App UI auth resolves the app session cookie even when the page was opened
    // from the Admin Panel and carries an admin referer.
    headersList.delete('referer')
    headersList.delete('referrer')
    const result = await payload.auth({ headers: headersList })
    user = result.user || null
  } catch {
    user = null
  }
  return { payload, user }
}
