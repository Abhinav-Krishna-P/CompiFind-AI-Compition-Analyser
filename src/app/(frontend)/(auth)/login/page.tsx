import type { Metadata } from 'next'
import { LoginForm } from './_components/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Rivalyze account.',
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm">
      {/* Card */}
      <div className="rounded-md border border-border bg-card p-8">
        {/* Card header */}
        <div className="mb-8">
          {/* Top accent */}
          <div className="mb-6 flex items-center gap-2">
            <span className="h-px w-4 bg-primary" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
              Secure access
            </span>
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Sign in to Rivalyze
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Access your competitor intelligence dashboard.
          </p>
        </div>

        {/* Form */}
        <LoginForm />
      </div>

      {/* Below-card label */}
      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
        Rivalyze · Competitor Intelligence Platform
      </p>
    </div>
  )
}
