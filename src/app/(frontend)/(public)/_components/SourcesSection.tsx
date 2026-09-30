const sources = [
  {
    id: 'news',
    label: 'News',
    badgeClass: 'bg-[--badge-news] text-[--badge-news-fg]',
    description: 'Press coverage, product announcements, funding rounds, executive changes.',
    items: [
      { title: 'Acme Corp raises $40M Series B to expand into APAC', time: '2h ago' },
      { title: 'CEO of RivalCo steps down amid restructuring', time: '5h ago' },
      { title: 'New product launch: CompetitorX unveils enterprise tier', time: '1d ago' },
    ],
  },
  {
    id: 'reddit',
    label: 'Reddit',
    badgeClass: 'bg-[--badge-reddit] text-[--badge-reddit-fg]',
    description: 'Customer sentiment, product complaints, feature requests, comparisons.',
    items: [
      { title: 'Why I switched from RivalCo to [your product]', time: '3h ago' },
      { title: 'Acme Corp pricing is insane now — alternatives?', time: '8h ago' },
      { title: 'CompetitorX new UI is a disaster according to r/SaaS', time: '2d ago' },
    ],
  },
  {
    id: 'x',
    label: 'X / Twitter',
    badgeClass: 'bg-[--badge-x] text-[--badge-x-fg]',
    description: 'Real-time chatter, influencer takes, viral product moments.',
    items: [
      { title: '@techanalyst: "RivalCo just broke prod for 3rd time this month"', time: '45m ago' },
      { title: 'Acme Corp trending after controversial pricing change', time: '6h ago' },
      { title: 'CompetitorX partnership with BigCo confirmed 🔥', time: '1d ago' },
    ],
  },
  {
    id: 'social',
    label: 'Social',
    badgeClass: 'bg-[--badge-social] text-[--badge-social-fg]',
    description: 'LinkedIn posts, Instagram campaigns, Facebook group discussions.',
    items: [
      { title: 'Acme Corp LinkedIn: "We hit 10,000 customers" post', time: '4h ago' },
      { title: 'RivalCo running aggressive LinkedIn ad campaign', time: '12h ago' },
      { title: 'CompetitorX CEO thought-leadership piece gaining traction', time: '3d ago' },
    ],
  },
]

export function SourcesSection() {
  return (
    <section id="sources" className="border-b border-border/50 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-24">
        {/* Header */}
        <div className="mb-16">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-primary">
              Intelligence Sources
            </span>
          </div>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Four sources. One unified feed.
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Rivalyze aggregates signals across the open web into a single structured
            intelligence stream — each item tagged by source, filterable by region.
          </p>
        </div>

        {/* Source columns */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {sources.map((source) => (
            <div key={source.id} className="flex flex-col gap-4">
              {/* Source header */}
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-sm px-1.5 py-0.5 font-mono text-xs font-medium ${source.badgeClass}`}
                >
                  {source.label}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {source.description}
              </p>

              {/* Sample items */}
              <div className="flex flex-col gap-0 overflow-hidden rounded-md border border-border/50">
                {source.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-1 border-b border-border/50 bg-card px-3 py-2.5 last:border-b-0"
                  >
                    <p className="text-xs leading-snug text-foreground line-clamp-2">
                      {item.title}
                    </p>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
