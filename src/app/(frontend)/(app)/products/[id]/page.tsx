import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAuth } from '@/lib/auth'
import { RegionChip, SourceBadge } from '@/components/badges'
import { OneClickDiscoverButton, DeleteProductButton, CompetitorCard } from '@/components/product-detail-client'
import { Button } from '@/components/ui/button'
import { Plus, Zap, ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { payload, user } = await getAuth()
  try {
    const product = await payload.findByID({ collection: 'products', id, overrideAccess: false, user })
    return { title: product.name }
  } catch {
    return { title: 'Product' }
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const { payload, user } = await getAuth()

  let product
  try {
    product = await payload.findByID({
      collection: 'products',
      id,
      overrideAccess: false,
      user,
    })
  } catch {
    notFound()
  }

  const [competitorsRes, contentRes] = await Promise.all([
    payload.find({
      collection: 'competitors',
      where: { product: { equals: id } },
      limit: 50,
      sort: '-createdAt',
      overrideAccess: false,
      user,
    }),
    payload.find({
      collection: 'content-items',
      where: { product: { equals: id } },
      limit: 20,
      sort: '-publishedAt',
      overrideAccess: false,
      user,
    }),
  ])

  const regions = (product.regions ?? []) as string[]

  return (
    <div className="flex flex-col h-full overflow-auto">
      <header className="h-14 flex items-center justify-between px-6 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-lg font-semibold text-foreground leading-tight">{product.name}</h1>
            <p className="text-xs font-mono text-primary/80">{product.niche}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/automations/new?productId=${id}`}>
              <Zap className="h-4 w-4 mr-1" />
              New Automation
            </Link>
          </Button>
          <DeleteProductButton productId={id} />
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl flex flex-col gap-6">
          {/* Product Info + One-Click */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-card border border-border rounded-md p-5">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Product Info</p>
              {product.description && (
                <p className="text-sm text-foreground mb-3">{product.description}</p>
              )}
              {regions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {regions.map((r) => <RegionChip key={r} region={r} />)}
                </div>
              )}
              {product.website && (
                <a
                  href={product.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs font-mono text-primary hover:underline mt-2"
                >
                  {product.website}
                </a>
              )}
            </div>

            <div className="bg-card border border-border rounded-md p-5 flex flex-col gap-3">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">One-Click Discovery</p>
              <p className="text-sm text-muted-foreground">
                Instantly scan the web for competitors in your niche. Results appear below.
              </p>
              <OneClickDiscoverButton productId={id} />
            </div>
          </div>

          {/* Competitors */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-foreground">
                Competitors <span className="text-muted-foreground font-normal text-sm">({competitorsRes.totalDocs})</span>
              </h2>
            </div>

            {competitorsRes.docs.length === 0 ? (
              <div className="bg-card border border-border rounded-md py-12 flex flex-col items-center gap-3 text-center">
                <p className="text-muted-foreground text-sm">No competitors found yet.</p>
                <p className="text-xs text-muted-foreground">Use One-Click Discovery or create an automation to start collecting data.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {competitorsRes.docs.map((comp) => (
                  <CompetitorCard
                    key={comp.id}
                    competitor={{
                      id: comp.id,
                      name: comp.name,
                      website: comp.website ?? null,
                      description: comp.description ?? null,
                      strengths: comp.strengths ?? null,
                      weaknesses: comp.weaknesses ?? null,
                      pricingInfo: comp.pricingInfo ?? null,
                      regions: (comp.regions ?? []) as string[],
                      isOneClick: comp.isOneClick ?? null,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content Items */}
          {contentRes.docs.length > 0 && (
            <div>
              <h2 className="font-display font-semibold text-foreground mb-3">
                Latest Intelligence <span className="text-muted-foreground font-normal text-sm">({contentRes.totalDocs})</span>
              </h2>
              <div className="bg-card border border-border rounded-md divide-y divide-border">
                {contentRes.docs.map((item) => (
                  <div key={item.id} className="px-5 py-3 hover:bg-muted/40 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <SourceBadge type={item.sourceType} />
                          {item.publishedAt && (
                            <span className="text-xs font-mono text-muted-foreground">
                              {new Date(item.publishedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                          >
                            {item.title}
                          </a>
                        ) : (
                          <p className="text-sm font-medium text-foreground">{item.title}</p>
                        )}
                        {item.snippet && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.snippet}</p>
                        )}
                      </div>
                      {item.relevanceScore != null && (
                        <span className="text-xs font-mono text-muted-foreground shrink-0">
                          {item.relevanceScore}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
