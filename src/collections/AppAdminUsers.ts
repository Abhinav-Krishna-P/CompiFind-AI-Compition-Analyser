import type { AuthSSOProviderConfig, CollectionConfig, PayloadRequest } from 'payload'

export const isLoggedInAppAdmin = ({ req }: { req: PayloadRequest }): boolean =>
  req.user?.collection === 'app-admin-users'

export const getConfiguredAdminSSOProviders = (): AuthSSOProviderConfig[] => {
  const coldbrewIssuer = process.env.COLDBREW_OIDC_ISSUER?.trim()
  const coldbrewClientId = process.env.COLDBREW_OIDC_CLIENT_ID?.trim()
  const coldbrewClientSecret = process.env.COLDBREW_OIDC_CLIENT_SECRET?.trim()

  if (coldbrewIssuer && coldbrewClientId && coldbrewClientSecret) {
    return [
      {
        claimsSource: 'id-token',
        clientId: coldbrewClientId,
        clientSecret: coldbrewClientSecret,
        disableEmailAutoLink: true,
        id: 'cb-app-admin',
        issuer: coldbrewIssuer,
        label: 'Sign in with Coldbrew',
        // The sole authorization gate for this collection. `includes` over
        // the role array.
        oidcPolicy: {
          requiredClaims: [{ includes: 'admin', path: 'app_admin_role' }],
        },
        scopes: ['openid', 'email', 'profile'],
        type: 'oidc',
      },
    ]
  }

  return []
}

export const AppAdminUsers: CollectionConfig = {
  slug: 'app-admin-users',
  auth: {
    // Declared methods are exhaustive: SSO only — no password strategy, while
    // core retains the identity fields SSO needs for lookup and linkage.
    methods: {
      sso: {
        providers: getConfiguredAdminSSOProviders(),
      },
    },
    tokenExpiration: 60 * 60,
  },
  admin: {
    useAsTitle: 'email',
  },
  access: {
    create: isLoggedInAppAdmin,
    delete: () => false,
    read: isLoggedInAppAdmin,
    update: isLoggedInAppAdmin,
  },
  fields: [],
}
