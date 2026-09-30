import {
  OAUTH_PROTECTED_RESOURCE_GET,
  OAUTH_PROTECTED_RESOURCE_HEAD,
} from '@payloadcms/next/routes'

import config from '@/payload.config'

export const GET = OAUTH_PROTECTED_RESOURCE_GET(config)
export const HEAD = OAUTH_PROTECTED_RESOURCE_HEAD(config)
