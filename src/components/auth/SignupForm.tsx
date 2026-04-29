'use client'

import type { SubmitEventHandler } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { signup } from '@/lib/auth'

export default function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const result = signup(email, password)

    if (!result.success) {
      setError(result.error ?? 'Unable to sign up')
      setIsSubmitting(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <section className="w-full max-w-md border border-border bg-surface px-6 py-8 shadow-sm rounded-md sm:px-8">
      <div className="mb-8 space-y-3 sm:text-left">
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary">
          Join us
        </p>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-3xl">
          Create account
        </h1>
        <p className="text-xs sm:text-sm leading-relaxed text-muted">
          Start tracking your daily progress.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" aria-label="Signup form">
        <div className="space-y-2">
          <label
            htmlFor="signup-email"
            className="text-sm font-semibold text-foreground"
          >
            Email
          </label>
          <input
            id="signup-email"
            data-testid="auth-signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-0"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="signup-password"
            className="text-sm font-semibold text-foreground"
          >
            Password
          </label>
          <input
            id="signup-password"
            data-testid="auth-signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-0"
            placeholder="Create a secure password"
            required
          />
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-md border-l-4 border-red-500 bg-red-50 p-4 text-sm font-medium text-red-800"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          data-testid="auth-signup-submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-primary/90 focus:outline-none focus:ring-0 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-primary disabled:active:scale-100"
        >
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted sm:text-left">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-bold text-primary transition hover:text-primary-strong"
        >
          Log in
        </Link>
      </div>
    </section>
  )
}
