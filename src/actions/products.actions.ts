'use server'

import { getAuth } from '@/lib/auth'
import { type FormState, type Result, toFieldErrors } from '@/lib/result'
import { revalidatePath } from 'next/cache'
import { Forbidden, NotFound, ValidationError } from 'payload'
import type { Product } from '@/payload-types'

type ProductFormValues = Pick<Product, 'name' | 'description' | 'niche' | 'regions' | 'website'>

export async function createProductAction(
  _prevState: FormState<ProductFormValues> | undefined,
  formData: FormData,
): Promise<FormState<ProductFormValues>> {
  const { payload, user } = await getAuth()

  if (!user || user.collection !== 'users') {
    return { fieldErrors: null, error: 'UNAUTHORIZED', success: false }
  }

  const regions = formData.getAll('regions') as Product['regions']
  const values: ProductFormValues = {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
    niche: formData.get('niche') as string,
    regions,
    website: (formData.get('website') as string) || null,
  }

  try {
    await payload.create({
      collection: 'products',
      data: {
        ...values,
        createdBy: user.id,
      },
      draft: false,
      overrideAccess: false,
      user,
    })
    revalidatePath('/dashboard')
    revalidatePath('/products')
    return { fieldErrors: null, success: true }
  } catch (error) {
    if (error instanceof ValidationError)
      return { values, fieldErrors: toFieldErrors<ProductFormValues>(error), success: false }
    if (error instanceof Forbidden)
      return { values, fieldErrors: null, error: 'FORBIDDEN', success: false }
    return { values, fieldErrors: null, error: 'INTERNAL_ERROR', success: false }
  }
}

export async function deleteProductAction(productId: string): Promise<Result<void>> {
  const { payload, user } = await getAuth()
  if (!user || user.collection !== 'users') return { success: false, error: 'UNAUTHORIZED' }

  try {
    await payload.delete({
      collection: 'products',
      id: productId,
      overrideAccess: false,
      user,
    })
    revalidatePath('/products')
    revalidatePath('/dashboard')
    return { success: true, data: undefined }
  } catch (error) {
    if (error instanceof Forbidden) return { success: false, error: 'FORBIDDEN' }
    if (error instanceof NotFound) return { success: false, error: 'NOT_FOUND' }
    return { success: false, error: 'INTERNAL_ERROR' }
  }
}
