import { withPayload } from '@payloadcms/next/withPayload'
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // NO `output` option: the Coldbrew adapter (NEXT_ADAPTER_PATH at
  // build time) assembles the deployable tree itself, and `standalone`
  // silently disables immutable-asset support (§13)
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Enable filesystem caching for `next dev`
    turbopackFileSystemCacheForDev: true,
    // Enable filesystem caching for `next build`
    turbopackFileSystemCacheForBuild: true,
  },
    images: {
    localPatterns: [
      {
        pathname: '/**',
      },
    ],
  },
}

// Disable telemetry
process.env.NEXT_TELEMETRY_DISABLED = '1'

export default withPayload(nextConfig, { devBundleServerPackages: false })
