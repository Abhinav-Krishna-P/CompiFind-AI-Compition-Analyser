import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Subtle grid texture */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Top accent line */}
      <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-px bg-primary/60" />

      {/* Minimal nav */}
      <header className="relative z-10 flex h-14 items-center px-6">
        <Link href="/" className="font-display text-base font-semibold tracking-tight text-foreground">
          Rival<span className="text-primary">yze</span>
        </Link>
      </header>

      {/* Centered content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        {children}
      </div>

      {/* Bottom label */}
      <div className="relative z-10 flex h-10 items-center justify-center">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
          Competitor Intelligence — Automated and Precise
        </span>
      </div>
    </div>
  )
}
