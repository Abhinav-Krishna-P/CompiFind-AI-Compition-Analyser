'use server'

import { getAuth } from '@/lib/auth'
import { type FormState, type Result, toFieldErrors } from '@/lib/result'
import { revalidatePath } from 'next/cache'
import { Forbidden, NotFound, ValidationError } from 'payload'
import type { Automation } from '@/payload-types'

type AutomationFormValues = Pick<Automation, 'name' | 'product' | 'interval' | 'sources' | 'regions' | 'status'>

export async function createAutomationAction(
  _prevState: FormState<AutomationFormValues> | undefined,
  formData: FormData,
): Promise<FormState<AutomationFormValues>> {
  const { payload, user } = await getAuth()

  if (!user || user.collection !== 'users') {
    return { fieldErrors: null, error: 'UNAUTHORIZED', success: false }
  }

  const sources = formData.getAll('sources') as Automation['sources']
  const regions = formData.getAll('regions') as Automation['regions']
  const productId = formData.get('product') as string

  const values: AutomationFormValues = {
    name: formData.get('name') as string,
    product: productId,
    interval: formData.get('interval') as Automation['interval'],
    sources,
    regions,
    status: 'active',
  }

  try {
    const automation = await payload.create({
      collection: 'automations',
      data: {
        ...values,
        createdBy: user.id,
      },
      draft: false,
      overrideAccess: false,
      user,
    })

    // Queue the first scrape run immediately
    await queueScrapeRun(String(automation.id), productId, user.id, payload, 'manual')

    revalidatePath('/automations')
    revalidatePath('/dashboard')
    return { fieldErrors: null, success: true }
  } catch (error) {
    if (error instanceof ValidationError)
      return { values, fieldErrors: toFieldErrors<AutomationFormValues>(error), success: false }
    if (error instanceof Forbidden)
      return { values, fieldErrors: null, error: 'FORBIDDEN', success: false }
    return { values, fieldErrors: null, error: 'INTERNAL_ERROR', success: false }
  }
}

export async function toggleAutomationAction(automationId: string): Promise<Result<void>> {
  const { payload, user } = await getAuth()
  if (!user || user.collection !== 'users') return { success: false, error: 'UNAUTHORIZED' }

  try {
    const automation = await payload.findByID({
      collection: 'automations',
      id: automationId,
      overrideAccess: false,
      user,
    })

    const newStatus = automation.status === 'active' ? 'paused' : 'active'

    await payload.update({
      collection: 'automations',
      id: automationId,
      data: { status: newStatus },
      draft: false,
      overrideAccess: false,
      user,
    })

    revalidatePath('/automations')
    return { success: true, data: undefined }
  } catch (error) {
    if (error instanceof Forbidden) return { success: false, error: 'FORBIDDEN' }
    if (error instanceof NotFound) return { success: false, error: 'NOT_FOUND' }
    return { success: false, error: 'INTERNAL_ERROR' }
  }
}

export async function deleteAutomationAction(automationId: string): Promise<Result<void>> {
  const { payload, user } = await getAuth()
  if (!user || user.collection !== 'users') return { success: false, error: 'UNAUTHORIZED' }

  try {
    await payload.delete({
      collection: 'automations',
      id: automationId,
      overrideAccess: false,
      user,
    })
    revalidatePath('/automations')
    revalidatePath('/dashboard')
    return { success: true, data: undefined }
  } catch (error) {
    if (error instanceof Forbidden) return { success: false, error: 'FORBIDDEN' }
    if (error instanceof NotFound) return { success: false, error: 'NOT_FOUND' }
    return { success: false, error: 'INTERNAL_ERROR' }
  }
}

export async function runAutomationNowAction(automationId: string): Promise<Result<{ runId: string }>> {
  const { payload, user } = await getAuth()
  if (!user || user.collection !== 'users') return { success: false, error: 'UNAUTHORIZED' }

  try {
    const automation = await payload.findByID({
      collection: 'automations',
      id: automationId,
      overrideAccess: false,
      user,
    })

    const productId = typeof automation.product === 'string'
      ? automation.product
      : String(automation.product.id)

    const runId = await queueScrapeRun(automationId, productId, user.id, payload, 'manual')
    revalidatePath('/automations')
    revalidatePath('/dashboard')
    return { success: true, data: { runId } }
  } catch (error) {
    if (error instanceof Forbidden) return { success: false, error: 'FORBIDDEN' }
    if (error instanceof NotFound) return { success: false, error: 'NOT_FOUND' }
    return { success: false, error: 'INTERNAL_ERROR' }
  }
}

async function queueScrapeRun(
  automationId: string,
  productId: string,
  userId: string,
  payload: Awaited<ReturnType<typeof getAuth>>['payload'],
  triggerType: 'manual' | 'scheduled',
): Promise<string> {
  // Create the scrape run record
  const run = await payload.create({
    collection: 'scrape-runs',
    data: {
      automation: automationId,
      product: productId,
      createdBy: userId,
      status: 'pending',
      triggerType,
      triggeredAt: new Date().toISOString(),
    },
    draft: false,
    overrideAccess: true,
  })

  const runId = String(run.id)

  // Queue the background job
  await payload.jobs.queue({
    task: 'runScrape',
    input: {
      scrapeRunId: runId,
      automationId,
      productId,
      userId,
    },
  })

  return runId
}
