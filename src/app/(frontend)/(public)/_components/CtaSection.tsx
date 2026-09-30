import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden rounded-md border border-border/50 bg-card px-8 py-16 md:px-16">
          {/* Decorative border accent */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-primary/50"
          />

          {/* Corner monospace decorations */}
          <span
            aria-hidden
            className="absolute left-4 top-3 font-mono text-[10px] text-muted-foreground/30"
          >
            rivalyze.intel
          </span>
          <span
            aria-hidden
            className="absolute right-4 top-3 font-mono text-[10px] text-muted-foreground/30"
          >
            v2.0.0
          </span>

          <div className="relative flex flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-3">
              <span className="h-px w-6 bg-primary" />
              <span className="font-mono text-xs font-medium uppercase tracking-widest text-primary">
                Ready to start
              </span>
              <span className="h-px w-6 bg-primary" />
            </div>

            <h2 className="font-display max-w-2xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Stop reading about competitors.{' '}
              <span className="text-primary">Start knowing them.</span>
            </h2>

            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Rivalyze is invite-only. Contact your administrator to get access and
              start monitoring your competitive landscape automatically.
            </p>

            <Button asChild className="h-11 gap-2 px-6 font-sans font-medium">
              <Link href="/login">
                Sign In to Rivalyze
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <p className="font-mono text-xs text-muted-foreground">
              Invite-only access — contact an admin to get started.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
