import { Suspense } from 'react'
import Link from 'next/link'
import { getAuth } from '@/lib/auth'
import { Plus, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge, SourceBadge, RegionChip } from '@/components/badges'
import { ToggleAutomationButton, RunNowButton, DeleteAutomationButton } from '@/components/automation-actions'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Automations' }

const INTERVAL_LABELS: Record<string, string> = {
  '6h': 'Every 6 hours',
  '12h': 'Every 12 hours',
  '24h': 'Daily',
  '72h': 'Every 3 days',
  '168h': 'Weekly',
}

async function AutomationsList() {
  const { payload, user } = await getAuth()

  const automations = await payload.find({
    collection: 'automations',
    limit: 50,
    sort: '-createdAt',
    depth: 1,
    overrideAccess: false,
    user,
  })

  if (automations.docs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
        <Zap className="h-12 w-12 text-muted-foreground/40" />
        <div>
          <p className="font-display font-semibold text-foreground">No automations yet</p>
          <p className="text-sm text-muted-foreground mt-1">Create an automation to schedule recurring competitor scans.</p>
        </div>
        <Button asChild>
          <Link href="/automations/new">
            <Plus className="h-4 w-4 mr-1" />
            Create your first automation
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 max-w-4xl">
      {automations.docs.map((automation) => {
        const product = typeof automation.product === 'object' ? automation.product : null
        const sources = (automation.sources ?? []) as string[]
        const regions = (automation.regions ?? []) as string[]

        return (
          <div key={automation.id} className="bg-card border border-border rounded-md">
            <div className="px-5 py-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="font-display font-semibold text-foreground">{automation.name}</h2>
                  <StatusBadge status={automation.status} />
                </div>
                {product && (
                  <Link
                    href={`/products/${product.id}`}
                    className="text-xs font-mono text-primary hover:underline mt-0.5 block"
                  >
                    {product.name}
                  </Link>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <RunNowButton automationId={String(automation.id)} />
                <ToggleAutomationButton automationId={String(automation.id)} status={automation.status} />
                <DeleteAutomationButton automationId={String(automation.id)} />
              </div>
            </div>

            <div className="px-5 py-3 border-t border-border bg-muted/20 flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-1">Schedule</span>
                <span className="font-mono text-xs text-foreground">{INTERVAL_LABELS[automation.interval] ?? automation.interval}</span>
              </div>
              {automation.nextRunAt && (
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-1">Next Run</span>
                  <span className="font-mono text-xs text-foreground">{new Date(automation.nextRunAt).toLocaleString()}</span>
                </div>
              )}
              {automation.lastRunAt && (
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground block mb-1">Last Run</span>
                  <span className="font-mono text-xs text-foreground">{new Date(automation.lastRunAt).toLocaleString()}</span>
                </div>
              )}
            </div>

            {(sources.length > 0 || regions.length > 0) && (
              <div className="px-5 py-3 border-t border-border flex flex-wrap gap-3">
                {sources.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {sources.map((s) => <SourceBadge key={s} type={s} />)}
                  </div>
                )}
                {regions.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {regions.map((r) => <RegionChip key={r} region={r} />)}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function AutomationsPage() {
  return (
    <div className="flex flex-col h-full overflow-auto">
      <header className="h-14 flex items-center justify-between px-6 border-b border-border shrink-0">
        <h1 className="font-display text-lg font-semibold text-foreground">Automations</h1>
        <Button asChild size="sm">
          <Link href="/automations/new">
            <Plus className="h-4 w-4 mr-1" />
            New Automation
          </Link>
        </Button>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <Suspense fallback={
          <div className="flex flex-col gap-4 max-w-4xl">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-md h-28 animate-pulse" />
            ))}
          </div>
        }>
          <AutomationsList />
        </Suspense>
      </main>
    </div>
  )
}
