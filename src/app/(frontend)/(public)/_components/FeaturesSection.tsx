import {
  Search,
  CalendarClock,
  Layers,
  Globe,
} from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'One-Click Competitor Discovery',
    description:
      'Enter your product name and Rivalyze instantly surfaces market rivals — no manual research, no guesswork. Discovery is a single action.',
    badge: null,
  },
  {
    icon: CalendarClock,
    title: 'Scheduled Automations',
    description:
      'Set scraping intervals — hourly, daily, weekly. Rivalyze runs on schedule and delivers fresh intelligence without you lifting a finger.',
    badge: 'cron',
  },
  {
    icon: Layers,
    title: 'Multi-Source Intelligence',
    description:
      'News, Reddit threads, X/Twitter posts, and broader social media — every source in a single structured feed, tagged and filterable.',
    badge: 'multi',
  },
  {
    icon: Globe,
    title: 'Region Targeting',
    description:
      'Narrow competitor signals to specific geographies. Track how rivals are perceived differently across markets and regions.',
    badge: null,
  },
]

const sourceBadges = [
  { label: 'news', className: 'bg-[--badge-news] text-[--badge-news-fg]' },
  { label: 'reddit', className: 'bg-[--badge-reddit] text-[--badge-reddit-fg]' },
  { label: 'x', className: 'bg-[--badge-x] text-[--badge-x-fg]' },
  { label: 'social', className: 'bg-[--badge-social] text-[--badge-social-fg]' },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-b border-border/50 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24">
        {/* Section header */}
        <div className="mb-16 flex items-start gap-6 md:items-center">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-primary" />
              <span className="font-mono text-xs font-medium uppercase tracking-widest text-primary">
                Platform Features
              </span>
            </div>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Built for systematic<br />
              <span className="text-primary">competitive intelligence.</span>
            </h2>
          </div>
          <p className="hidden max-w-sm text-sm leading-relaxed text-muted-foreground md:block">
            Every feature is purpose-built for teams that treat competitive awareness
            as a continuous process — not a quarterly review.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-px border border-border/50 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col gap-4 bg-card p-8 transition-colors hover:bg-card/80"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border/50 bg-muted">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                {feature.badge === 'cron' && (
                  <span className="font-mono text-xs text-muted-foreground">
                    0 */6 * * *
                  </span>
                )}
                {feature.badge === 'multi' && (
                  <div className="flex gap-1">
                    {sourceBadges.map((b) => (
                      <span
                        key={b.label}
                        className={`rounded-sm px-1.5 py-0.5 font-mono text-xs font-medium ${b.className}`}
                      >
                        {b.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
