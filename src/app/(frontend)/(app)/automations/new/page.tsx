import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getAuth } from '@/lib/auth'
import { NewAutomationForm } from '@/components/new-automation-form'

export const metadata: Metadata = { title: 'New Automation' }

interface Props {
  searchParams: Promise<{ productId?: string }>
}

async function AutomationFormWrapper({ defaultProductId }: { defaultProductId: string }) {
  const { payload, user } = await getAuth()

  const productsRes = await payload.find({
    collection: 'products',
    limit: 100,
    sort: 'name',
    overrideAccess: false,
    user,
  })

  const products = productsRes.docs.map((p) => ({
    id: String(p.id),
    name: p.name,
    niche: p.niche,
  }))

  return <NewAutomationForm products={products} defaultProductId={defaultProductId} />
}

export default async function NewAutomationPage({ searchParams }: Props) {
  const { productId = '' } = await searchParams
  return (
    <div className="flex flex-col h-full overflow-auto">
      <header className="h-14 flex items-center px-6 border-b border-border shrink-0">
        <h1 className="font-display text-lg font-semibold text-foreground">New Automation</h1>
      </header>
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-lg bg-card border border-border rounded-md">
          <div className="px-5 py-4 border-b border-border">
            <p className="text-sm text-muted-foreground">
              Set a schedule and select your sources. The first run will queue immediately after creation.
            </p>
          </div>
          <div className="px-5 py-5">
            <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-md" />}>
              <AutomationFormWrapper defaultProductId={productId} />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  )
}
