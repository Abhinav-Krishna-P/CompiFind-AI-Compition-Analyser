import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { TerminalCursor } from './TerminalCursor'

export function HeroSection() {
  return (
    <section className="relative border-b border-border/50 bg-background">
      {/* Subtle grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24">
        {/* Eyebrow label */}
        <div className="mb-8 flex items-center gap-3">
          <span className="h-px w-8 bg-primary" />
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-primary">
            Competitor Intelligence Platform
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display mb-6 max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Know every move{' '}
          <span className="text-primary">your rivals</span>{' '}
          make.
          <TerminalCursor />
        </h1>

        {/* Subheadline */}
        <p className="mb-10 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Rivalyze automatically discovers your competitors and monitors them across news,
          Reddit, X, and social media — delivering structured intelligence on a schedule
          you set.
        </p>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Button asChild className="h-11 px-6 font-sans font-medium">
            <Link href="/login">Get Started</Link>
          </Button>
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            See how it works →
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-16 flex flex-wrap items-center gap-8 border-t border-border/50 pt-8">
          {[
            { value: '4', label: 'Intel sources' },
            { value: '1-click', label: 'Competitor discovery' },
            { value: 'Scheduled', label: 'Automated scraping' },
            { value: 'Regional', label: 'Geo targeting' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-0.5">
              <span className="font-display text-xl font-semibold text-primary">
                {stat.value}
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero image */}
      <div className="mx-auto max-w-6xl px-6 pb-0">
        <div className="relative overflow-hidden rounded-t-md border border-b-0 border-border/50">
          {/* Fake window chrome */}
          <div className="flex h-8 items-center gap-1.5 border-b border-border/50 bg-card px-3">
            <span className="h-2.5 w-2.5 rounded-full bg-muted" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">
              rivalyze — intelligence feed
            </span>
          </div>
          <Image
            src="/marketing/hero-dashboard.png"
            alt="Rivalyze competitor intelligence dashboard showing multi-source news and social feeds"
            width={1200}
            height={675}
            priority
            className="w-full"
          />
        </div>
      </div>
    </section>
  )
}
