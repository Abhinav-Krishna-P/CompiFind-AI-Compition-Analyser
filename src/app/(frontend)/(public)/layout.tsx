import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { getAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Rivalyze — Competitor Intelligence, Automated',
  description:
    'Rivalyze discovers and monitors your market rivals automatically — scraping news, Reddit, X, and social media on a schedule so you never miss a competitive move.',
}

/* ── Nav auth slot — reads session at request time ── */
async function NavAuthLinks() {
  const { user } = await getAuth()
  if (user) {
    return (
      <Button asChild size="sm">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    )
  }
  return (
    <Button asChild size="sm">
      <Link href="/login">Sign In</Link>
    </Button>
  )
}

function NavAuthFallback() {
  return (
    <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
  )
}

/* ── Public nav ── */
function PublicNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            Rival<span className="text-primary">yze</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#sources"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sources
          </Link>
        </nav>

        {/* Auth slot */}
        <Suspense fallback={<NavAuthFallback />}>
          <NavAuthLinks />
        </Suspense>
      </div>
    </header>
  )
}

/* ── Footer ── */
function PublicFooter() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row">
        <span className="font-display text-sm font-semibold tracking-tight text-foreground">
          Rival<span className="text-primary">yze</span>
        </span>
        <p className="font-mono text-xs text-muted-foreground">
          © 2025 Rivalyze. All rights reserved.
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          Competitor intelligence — automated and precise.
        </p>
      </div>
    </footer>
  )
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNav />
      <main>{children}</main>
      <PublicFooter />
    </>
  )
}
