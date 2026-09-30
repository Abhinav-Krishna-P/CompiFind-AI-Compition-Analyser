import { cn } from '@/lib/utils'

type SourceType = 'news' | 'reddit' | 'x' | 'social' | 'launches' | 'reviews'
type StatusType = 'active' | 'paused' | 'running' | 'failed' | 'pending' | 'completed'

const SOURCE_LABELS: Record<SourceType, string> = {
  news: 'News',
  reddit: 'Reddit',
  x: 'X',
  social: 'Social',
  launches: 'Launch',
  reviews: 'Review',
}

const SOURCE_CLASSES: Record<SourceType, string> = {
  news: 'bg-[--badge-news] text-[--badge-news-fg]',
  reddit: 'bg-[--badge-reddit] text-[--badge-reddit-fg]',
  x: 'bg-[--badge-x] text-[--badge-x-fg]',
  social: 'bg-[--badge-social] text-[--badge-social-fg]',
  launches: 'bg-primary/20 text-primary',
  reviews: 'bg-accent/20 text-accent',
}

export function SourceBadge({ type, className }: { type: string; className?: string }) {
  const sourceType = type as SourceType
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs font-mono font-medium',
        SOURCE_CLASSES[sourceType] ?? 'bg-muted text-muted-foreground',
        className,
      )}
    >
      {SOURCE_LABELS[sourceType] ?? type}
    </span>
  )
}

const STATUS_LABELS: Record<StatusType, string> = {
  active: 'Active',
  paused: 'Paused',
  running: 'Running',
  failed: 'Failed',
  pending: 'Pending',
  completed: 'Completed',
}

const STATUS_CLASSES: Record<StatusType, string> = {
  active: 'bg-[--status-active] text-[--status-active-fg]',
  paused: 'bg-[--status-paused] text-[--status-paused-fg]',
  running: 'bg-[--status-running] text-[--status-running-fg]',
  failed: 'bg-[--status-failed] text-[--status-failed-fg]',
  pending: 'bg-muted text-muted-foreground',
  completed: 'bg-[--status-active] text-[--status-active-fg]',
}

export function StatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  const s = status as StatusType
  const isRunning = s === 'running'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
        STATUS_CLASSES[s] ?? 'bg-muted text-muted-foreground',
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full bg-current', isRunning && 'animate-pulse')} />
      {STATUS_LABELS[s] ?? status}
    </span>
  )
}

const REGION_LABELS: Record<string, string> = {
  global: 'Global',
  us: 'US',
  uk: 'UK',
  eu: 'EU',
  ca: 'CA',
  au: 'AU',
  in: 'India',
  sea: 'SEA',
  latam: 'LATAM',
  me: 'ME',
}

export function RegionChip({ region }: { region: string }) {
  return (
    <span className="inline-flex items-center rounded-sm bg-primary/15 text-primary border border-primary/30 px-1.5 py-0.5 text-xs font-mono font-medium">
      {REGION_LABELS[region] ?? region}
    </span>
  )
}
