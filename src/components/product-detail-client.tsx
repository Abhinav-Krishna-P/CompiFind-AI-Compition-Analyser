'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { oneClickDiscoverAction } from '@/actions/discover.actions'
import { deleteProductAction } from '@/actions/products.actions'
import { Button } from '@/components/ui/button'
import { Zap, Trash2, Loader2, ExternalLink } from 'lucide-react'

export function OneClickDiscoverButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<string | null>(null)
  const router = useRouter()

  function handleDiscover() {
    startTransition(async () => {
      setResult(null)
      const res = await oneClickDiscoverAction(productId)
      if (res.success) {
        setResult(`Found ${res.data.competitorCount} competitors!`)
        router.refresh()
      } else {
        setResult('Error: ' + res.error)
      }
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleDiscover} disabled={isPending} className="gap-2">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
        {isPending ? 'Scanning the web...' : 'One-Click Discovery'}
      </Button>
      {result && (
        <p className="text-xs text-muted-foreground font-mono">{result}</p>
      )}
    </div>
  )
}

export function DeleteProductButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    if (!confirm('Delete this product and all its data?')) return
    startTransition(async () => {
      await deleteProductAction(productId)
      router.push('/products')
    })
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isPending}>
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </Button>
  )
}

interface CompetitorCardProps {
  competitor: {
    id: string | number
    name: string
    website?: string | null
    description?: string | null
    strengths?: string | null
    weaknesses?: string | null
    pricingInfo?: string | null
    regions?: string[] | null
    isOneClick?: boolean | null
  }
}

export function CompetitorCard({ competitor }: CompetitorCardProps) {
  return (
    <div className="bg-card border border-border rounded-md p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display font-semibold text-foreground">{competitor.name}</h3>
          {competitor.website && (
            <a
              href={competitor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-primary hover:underline flex items-center gap-1 mt-0.5"
            >
              {competitor.website.replace(/^https?:\/\//, '')}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        {competitor.isOneClick && (
          <span className="inline-flex items-center gap-1 rounded-sm bg-primary/15 text-primary border border-primary/30 px-1.5 py-0.5 text-xs font-mono shrink-0">
            <Zap className="h-2.5 w-2.5" />
            Quick
          </span>
        )}
      </div>
      {competitor.description && (
        <p className="text-sm text-muted-foreground">{competitor.description}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {competitor.strengths && (
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">Strengths</p>
            <p className="text-foreground/80">{competitor.strengths}</p>
          </div>
        )}
        {competitor.weaknesses && (
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">Weaknesses</p>
            <p className="text-foreground/80">{competitor.weaknesses}</p>
          </div>
        )}
      </div>
      {competitor.pricingInfo && (
        <p className="text-xs font-mono text-muted-foreground border-t border-border pt-2">
          Pricing: {competitor.pricingInfo}
        </p>
      )}
    </div>
  )
}
