import type { Metadata } from 'next'
import { NewProductForm } from '@/components/new-product-form'

export const metadata: Metadata = { title: 'New Product' }

export default function NewProductPage() {
  return (
    <div className="flex flex-col h-full overflow-auto">
      <header className="h-14 flex items-center px-6 border-b border-border shrink-0">
        <h1 className="font-display text-lg font-semibold text-foreground">New Product</h1>
      </header>
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-lg bg-card border border-border rounded-md">
          <div className="px-5 py-4 border-b border-border">
            <p className="text-sm text-muted-foreground">
              Add a product to start discovering competitors and monitoring your market.
            </p>
          </div>
          <div className="px-5 py-5">
            <NewProductForm />
          </div>
        </div>
      </main>
    </div>
  )
}
