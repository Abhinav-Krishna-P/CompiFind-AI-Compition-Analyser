type BuildPathOptions = {
  buildPath: (token: string) => string
}

type AuthEmailGeneratorInput = {
  token?: string | null
}

type RequiredTokenEmailHTMLGenerator = (input: AuthEmailGeneratorInput) => string
type OptionalTokenEmailHTMLGenerator = (input?: AuthEmailGeneratorInput) => string

type AuthEmailType = 'forgot-password' | 'verification'

type SerializeAuthEmailPayloadArgs = {
  path: string
  type: AuthEmailType
}

export function createVerificationEmailHTMLGenerator(
  options: BuildPathOptions,
): RequiredTokenEmailHTMLGenerator {
  return (input) => {
    const token = input.token
    if (!token) {
      throw new Error('Missing verification token')
    }

    return serializeAuthEmailPayload({
      type: 'verification',
      path: options.buildPath(token),
    })
  }
}

export function createForgotPasswordEmailHTMLGenerator(
  options: BuildPathOptions,
): OptionalTokenEmailHTMLGenerator {
  return (input) => {
    const token = input?.token
    if (!token) {
      throw new Error('Missing forgot-password token')
    }

    return serializeAuthEmailPayload({
      type: 'forgot-password',
      path: options.buildPath(token),
    })
  }
}

function serializeAuthEmailPayload(args: SerializeAuthEmailPayloadArgs): string {
  const appUrl = requireAppUrl()
  const url = new URL(args.path, appUrl).toString()

  return JSON.stringify({
    __coldbrew: 'auth-email',
    type: args.type,
    url,
  })
}

function requireAppUrl(): string {
  const appUrl = process.env.APP_URL
  if (!appUrl) {
    throw new Error('Missing required environment variable: APP_URL')
  }
  return appUrl
}
