'use client'

import { useActionState } from 'react'
import Form from 'next/form'
import Link from 'next/link'
import { createAutomationAction } from '@/actions/automations.actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2 } from 'lucide-react'

const SOURCES = [
  { value: 'news', label: 'News & Articles' },
  { value: 'reddit', label: 'Reddit' },
  { value: 'x', label: 'X / Twitter' },
  { value: 'social', label: 'Social Media' },
  { value: 'launches', label: 'Product Launches' },
  { value: 'reviews', label: 'Review Sites' },
]

const REGIONS = [
  { value: 'global', label: 'Global' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'eu', label: 'European Union' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'in', label: 'India' },
  { value: 'sea', label: 'Southeast Asia' },
  { value: 'latam', label: 'Latin America' },
  { value: 'me', label: 'Middle East' },
]

const INTERVALS = [
  { value: '6h', label: 'Every 6 hours' },
  { value: '12h', label: 'Every 12 hours' },
  { value: '24h', label: 'Daily' },
  { value: '72h', label: 'Every 3 days' },
  { value: '168h', label: 'Weekly' },
]

interface Product {
  id: string
  name: string
  niche: string
}

export function NewAutomationForm({ products, defaultProductId = '' }: { products: Product[]; defaultProductId?: string }) {
  const [state, action, pending] = useActionState(createAutomationAction, undefined)

  return (
    <Form action={action} className="flex flex-col gap-5">
      {state?.error && (
        <div className="rounded-md bg-destructive/15 border border-destructive/40 text-destructive px-4 py-3 text-sm">
          {state.error === 'UNAUTHORIZED' ? 'You must be signed in.' : 'Something went wrong. Please try again.'}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Automation Name</Label>
        <Input
          id="name"
          name="name"
          required
          placeholder='e.g. "Weekly competitor scan"'
          defaultValue={state?.values?.name ?? ''}
          disabled={pending}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="product">Product</Label>
        {products.length === 0 ? (
          <div className="rounded-md border border-border p-3 text-sm text-muted-foreground">
            No products yet.{' '}
            <Link href="/products/new" className="text-primary hover:underline">Create one first.</Link>
          </div>
        ) : (
          <select
            id="product"
            name="product"
            required
            defaultValue={defaultProductId || String(state?.values?.product ?? '')}
            disabled={pending}
            className="flex h-9 w-full rounded-md border border-border bg-input px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select a product…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.niche}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="interval">Run Schedule</Label>
        <select
          id="interval"
          name="interval"
          required
          defaultValue={String(state?.values?.interval ?? '24h')}
          disabled={pending}
          className="flex h-9 w-full rounded-md border border-border bg-input px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {INTERVALS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Sources to Scrape</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SOURCES.map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm cursor-pointer hover:border-primary/40 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/10"
            >
              <input
                type="checkbox"
                name="sources"
                value={value}
                className="accent-primary"
                defaultChecked={
                  state?.values?.sources
                    ? (state.values.sources as string[]).includes(value)
                    : ['news', 'reddit'].includes(value)
                }
                disabled={pending}
              />
              <span className="font-mono text-xs">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Regions</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {REGIONS.map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm cursor-pointer hover:border-primary/40 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/10"
            >
              <input
                type="checkbox"
                name="regions"
                value={value}
                className="accent-primary"
                defaultChecked={
                  state?.values?.regions
                    ? (state.values.regions as string[]).includes(value)
                    : value === 'global'
                }
                disabled={pending}
              />
              <span className="font-mono text-xs">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button asChild variant="ghost" type="button" disabled={pending}>
          <Link href="/automations">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Cancel
          </Link>
        </Button>
        <Button type="submit" disabled={pending || products.length === 0}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
          Create & Run Now
        </Button>
      </div>
    </Form>
  )
}
