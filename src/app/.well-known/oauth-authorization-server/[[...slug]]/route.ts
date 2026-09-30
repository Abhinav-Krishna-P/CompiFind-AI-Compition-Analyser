import {
  OAUTH_AUTHORIZATION_SERVER_GET,
  OAUTH_AUTHORIZATION_SERVER_HEAD,
} from '@payloadcms/next/routes'

import config from '@/payload.config'

export const GET = OAUTH_AUTHORIZATION_SERVER_GET(config)
export const HEAD = OAUTH_AUTHORIZATION_SERVER_HEAD(config)
