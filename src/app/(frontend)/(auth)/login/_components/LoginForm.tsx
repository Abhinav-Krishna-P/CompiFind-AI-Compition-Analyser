'use client'

import { useActionState } from 'react'
import Form from 'next/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Field, FieldError } from '@/components/ui/field'
import { loginAction } from '@/actions/(auth)/auth.actions'
import { AlertCircle, Loader2 } from 'lucide-react'

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined)

  return (
    <Form action={action} className="flex flex-col gap-5">
      {/* Global error */}
      {state?.error === 'UNAUTHORIZED' && (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">
            Invalid email or password.
          </p>
        </div>
      )}

      {/* Email field */}
      <Field>
        <Label
          htmlFor="email"
          className="text-sm font-medium text-foreground"
        >
          Email address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          required
          placeholder="you@company.com"
          defaultValue={state?.values?.email}
          aria-invalid={!!state?.fieldErrors?.email}
          className="h-10 bg-input font-sans text-sm"
        />
        {state?.fieldErrors?.email && (
          <FieldError>{state.fieldErrors.email[0]}</FieldError>
        )}
      </Field>

      {/* Password field */}
      <Field>
        <Label
          htmlFor="password"
          className="text-sm font-medium text-foreground"
        >
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          aria-invalid={!!state?.fieldErrors?.password}
          className="h-10 bg-input font-sans text-sm"
        />
        {state?.fieldErrors?.password && (
          <FieldError>{state.fieldErrors.password[0]}</FieldError>
        )}
      </Field>

      {/* Submit */}
      <Button
        type="submit"
        disabled={pending}
        className="mt-1 h-10 w-full font-sans font-medium"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      {/* Invite-only notice */}
      <p className="text-center font-mono text-xs text-muted-foreground">
        Invite-only — contact an admin for access.
      </p>
    </Form>
  )
}
