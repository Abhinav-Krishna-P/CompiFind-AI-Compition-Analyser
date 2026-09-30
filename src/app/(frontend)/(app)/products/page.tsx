import Link from 'next/link'
import { getAuth } from '@/lib/auth'
import { Plus, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RegionChip } from '@/components/badges'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Products' }

export default async function ProductsPage() {
  const { payload, user } = await getAuth()

  const products = await payload.find({
    collection: 'products',
    limit: 50,
    sort: '-createdAt',
    overrideAccess: false,
    user,
  })

  return (
    <div className="flex flex-col h-full overflow-auto">
      <header className="h-14 flex items-center justify-between px-6 border-b border-border shrink-0">
        <h1 className="font-display text-lg font-semibold text-foreground">Products</h1>
        <Button asChild size="sm">
          <Link href="/products/new">
            <Plus className="h-4 w-4 mr-1" />
            New Product
          </Link>
        </Button>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        {products.docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
            <Globe className="h-12 w-12 text-muted-foreground/40" />
            <div>
              <p className="font-display font-semibold text-foreground">No products yet</p>
              <p className="text-sm text-muted-foreground mt-1">Add a product to start tracking competitors.</p>
            </div>
            <Button asChild>
              <Link href="/products/new">
                <Plus className="h-4 w-4 mr-1" />
                Add your first product
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
            {products.docs.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-card border border-border rounded-md p-5 hover:border-primary/40 transition-colors group block"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-display font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {product.name}
                    </p>
                    <p className="text-xs font-mono text-primary/80 mt-0.5">{product.niche}</p>
                  </div>
                </div>
                {product.description && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
                )}
                {product.regions && product.regions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {(product.regions as string[]).map((r) => (
                      <RegionChip key={r} region={r} />
                    ))}
                  </div>
                )}
                {product.website && (
                  <p className="text-xs font-mono text-muted-foreground mt-2 truncate">
                    {product.website.replace(/^https?:\/\//, '')}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
