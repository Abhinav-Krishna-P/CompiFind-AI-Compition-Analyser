import { Suspense } from 'react'
import Link from 'next/link'
import { getAuth } from '@/lib/auth'
import { Package, Zap, FileSearch, Plus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/badges'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

async function DashboardStats() {
  const { payload, user } = await getAuth()

  const [productsRes, automationsRes, runsRes, competitorsRes] = await Promise.all([
    payload.find({ collection: 'products', limit: 0, overrideAccess: false, user }),
    payload.find({ collection: 'automations', limit: 0, overrideAccess: false, user }),
    payload.find({ collection: 'scrape-runs', limit: 0, overrideAccess: false, user }),
    payload.find({ collection: 'competitors', limit: 0, overrideAccess: false, user }),
  ])

  const stats = [
    { label: 'Products', value: productsRes.totalDocs, icon: Package, href: '/products' },
    { label: 'Automations', value: automationsRes.totalDocs, icon: Zap, href: '/automations' },
    { label: 'Scrape Runs', value: runsRes.totalDocs, icon: FileSearch, href: '/automations' },
    { label: 'Competitors Found', value: competitorsRes.totalDocs, icon: Package, href: '/products' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, href }) => (
        <Link
          key={label}
          href={href}
          className="bg-card border border-border rounded-md p-5 hover:border-primary/40 transition-colors group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{label}</p>
              <p className="text-3xl font-display font-semibold mt-1 text-foreground">{value}</p>
            </div>
            <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </Link>
      ))}
    </div>
  )
}

async function RecentRuns() {
  const { payload, user } = await getAuth()

  const runs = await payload.find({
    collection: 'scrape-runs',
    limit: 6,
    sort: '-triggeredAt',
    depth: 1,
    overrideAccess: false,
    user,
  })

  if (runs.docs.length === 0) {
    return (
      <div className="bg-card border border-border rounded-md">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-display font-semibold text-sm uppercase tracking-widest text-muted-foreground">Recent Runs</h2>
        </div>
        <div className="px-5 py-8 text-center text-sm text-muted-foreground">
          No scrape runs yet. Create an automation to get started.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-md">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h2 className="font-display font-semibold text-sm uppercase tracking-widest text-muted-foreground">Recent Runs</h2>
        <Link href="/automations" className="text-xs text-primary hover:underline flex items-center gap-1">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {runs.docs.map((run) => {
          const product = typeof run.product === 'object' ? run.product : null
          const automation = typeof run.automation === 'object' ? run.automation : null
          return (
            <div key={run.id} className="px-5 py-3 flex items-center justify-between hover:bg-muted/40 transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {product?.name ?? 'Unknown product'}
                </p>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  {automation?.name ?? 'Unknown automation'} ·{' '}
                  {run.triggeredAt ? new Date(run.triggeredAt).toLocaleString() : '—'}
                </p>
              </div>
              <StatusBadge status={run.status} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

async function RecentCompetitors() {
  const { payload, user } = await getAuth()

  const competitors = await payload.find({
    collection: 'competitors',
    limit: 5,
    sort: '-createdAt',
    depth: 1,
    overrideAccess: false,
    user,
  })

  if (competitors.docs.length === 0) return null

  return (
    <div className="bg-card border border-border rounded-md">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h2 className="font-display font-semibold text-sm uppercase tracking-widest text-muted-foreground">Recently Found</h2>
      </div>
      <div className="divide-y divide-border">
        {competitors.docs.map((comp) => {
          const product = typeof comp.product === 'object' ? comp.product : null
          return (
            <div key={comp.id} className="px-5 py-3 flex items-center justify-between hover:bg-muted/40 transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground">{comp.name}</p>
                {comp.website && (
                  <a
                    href={comp.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary font-mono hover:underline"
                  >
                    {comp.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {product?.name ?? '—'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-border shrink-0">
        <h1 className="font-display text-lg font-semibold text-foreground">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/products/new">
              <Plus className="h-4 w-4 mr-1" />
              New Product
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/automations/new">
              <Zap className="h-4 w-4 mr-1" />
              New Automation
            </Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex flex-col gap-6 max-w-6xl">
          <Suspense fallback={
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-md p-5 h-24 animate-pulse" />
              ))}
            </div>
          }>
            <DashboardStats />
          </Suspense>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Suspense fallback={<div className="bg-card border border-border rounded-md h-64 animate-pulse" />}>
              <RecentRuns />
            </Suspense>
            <Suspense fallback={null}>
              <RecentCompetitors />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
