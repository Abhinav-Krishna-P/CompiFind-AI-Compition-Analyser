'use server'

import { login, logout } from '@payloadcms/next/auth'
import { redirect } from 'next/navigation'
import config from '@payload-config'
import type { FormState } from '@/lib/result'

type LoginValues = { email: string; password: string }

export async function loginAction(
  _prevState: FormState<LoginValues> | undefined,
  formData: FormData,
): Promise<FormState<LoginValues>> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const values: LoginValues = { email, password }

  try {
    await login({ collection: 'users', config, email, password })
  } catch {
    return {
      values,
      fieldErrors: null,
      error: 'UNAUTHORIZED',
      success: false,
    }
  }

  redirect('/dashboard')
}

export async function logoutAction() {
  await logout({ config, allSessions: true })
  redirect('/login')
}
