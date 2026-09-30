'use client'

import { useActionState } from 'react'
import Form from 'next/form'
import Link from 'next/link'
import { createProductAction } from '@/actions/products.actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Loader2 } from 'lucide-react'

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

export function NewProductForm() {
  const [state, action, pending] = useActionState(createProductAction, undefined)

  return (
    <Form action={action} className="flex flex-col gap-5">
      {state?.error && (
        <div className="rounded-md bg-destructive/15 border border-destructive/40 text-destructive px-4 py-3 text-sm">
          {state.error === 'UNAUTHORIZED' ? 'You must be signed in.' : 'Something went wrong. Please try again.'}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          required
          placeholder="e.g. My SaaS App"
          defaultValue={state?.values?.name ?? ''}
          aria-invalid={!!state?.fieldErrors?.name}
          disabled={pending}
        />
        {state?.fieldErrors?.name && (
          <p className="text-xs text-destructive">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="niche">Market Niche</Label>
        <Input
          id="niche"
          name="niche"
          required
          placeholder='e.g. "project management software", "organic skincare"'
          defaultValue={state?.values?.niche ?? ''}
          aria-invalid={!!state?.fieldErrors?.niche}
          disabled={pending}
        />
        <p className="text-xs text-muted-foreground">Describe the category or market — Rivalyze uses this to find competitors.</p>
        {state?.fieldErrors?.niche && (
          <p className="text-xs text-destructive">{state.fieldErrors.niche[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description <span className="text-muted-foreground">(optional)</span></Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Brief description of what your product does"
          defaultValue={state?.values?.description ?? ''}
          disabled={pending}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="website">Website <span className="text-muted-foreground">(optional)</span></Label>
        <Input
          id="website"
          name="website"
          type="url"
          placeholder="https://yourproduct.com"
          defaultValue={state?.values?.website ?? ''}
          disabled={pending}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Regions to Monitor</Label>
        <p className="text-xs text-muted-foreground">Select which regions to look up competitors in.</p>
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
          <Link href="/products">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Cancel
          </Link>
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
          Create Product
        </Button>
      </div>
    </Form>
  )
}
