'use server'

import { getAuth } from '@/lib/auth'
import { type Result } from '@/lib/result'
import { discoverCompetitors } from '@/lib/gemini'
import { revalidatePath } from 'next/cache'
import { Forbidden, NotFound } from 'payload'
import type { RegionValue } from '@/lib/gemini'

export async function oneClickDiscoverAction(
  productId: string,
): Promise<Result<{ competitorCount: number }>> {
  const { payload, user } = await getAuth()
  if (!user || user.collection !== 'users') return { success: false, error: 'UNAUTHORIZED' }

  try {
    const product = await payload.findByID({
      collection: 'products',
      id: productId,
      overrideAccess: false,
      user,
    })

    const regions = (product.regions ?? ['global']) as RegionValue[]

    const competitors = await discoverCompetitors(
      product.name,
      product.description ?? null,
      product.niche,
      regions,
    )

    let count = 0
    for (const comp of competitors) {
      await payload.create({
        collection: 'competitors',
        data: {
          name: comp.name,
          product: productId,
          createdBy: user.id,
          website: comp.website ?? null,
          description: comp.description,
          strengths: comp.strengths,
          weaknesses: comp.weaknesses,
          pricingInfo: comp.pricingInfo ?? null,
          sourceUrl: comp.sourceUrl ?? null,
          regions: comp.regions ?? [],
          isOneClick: true,
        },
        draft: false,
        overrideAccess: true,
      })
      count++
    }

    revalidatePath(`/products/${productId}`)
    revalidatePath('/dashboard')
    return { success: true, data: { competitorCount: count } }
  } catch (error) {
    if (error instanceof Forbidden) return { success: false, error: 'FORBIDDEN' }
    if (error instanceof NotFound) return { success: false, error: 'NOT_FOUND' }
    return { success: false, error: 'INTERNAL_ERROR' }
  }
}
