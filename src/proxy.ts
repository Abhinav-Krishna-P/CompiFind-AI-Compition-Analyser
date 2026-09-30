import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protect all (app)/ routes — checks for presence of a Payload auth cookie.
// The real auth validation happens server-side when pages call getAuth().
export function proxy(request: NextRequest) {
  const token = request.cookies.get('payload-token')
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/products/:path*', '/automations/:path*'],
}
