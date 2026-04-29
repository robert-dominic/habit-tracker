import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'
import { SESSION_KEY, USERS_KEY } from '@/lib/constants'

const push = vi.fn()
const replace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push,
    replace,
  }),
}))

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('auth flow', () => {
  beforeEach(() => {
    localStorage.clear()
    push.mockReset()
    replace.mockReset()
  })

  it('submits the signup form and creates a session', async () => {
    const user = userEvent.setup()

    render(<SignupForm />)

    await user.type(screen.getByTestId('auth-signup-email'), 'user@example.com')
    await user.type(screen.getByTestId('auth-signup-password'), 'password123')
    await user.click(screen.getByTestId('auth-signup-submit'))

    const users = JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]')
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null')

    expect(users).toHaveLength(1)
    expect(users[0].email).toBe('user@example.com')
    expect(session).toMatchObject({
      email: 'user@example.com',
      userId: users[0].id,
    })
    expect(push).toHaveBeenCalledWith('/dashboard')
  })

  it('shows an error for duplicate signup email', async () => {
    const user = userEvent.setup()

    localStorage.setItem(
      USERS_KEY,
      JSON.stringify([
        {
          id: 'user-1',
          email: 'user@example.com',
          password: 'password123',
          createdAt: '2026-04-28T00:00:00.000Z',
        },
      ]),
    )

    render(<SignupForm />)

    await user.type(screen.getByTestId('auth-signup-email'), 'user@example.com')
    await user.type(screen.getByTestId('auth-signup-password'), 'different-pass')
    await user.click(screen.getByTestId('auth-signup-submit'))

    expect(screen.getByRole('alert')).toHaveTextContent('User already exists')
    expect(push).not.toHaveBeenCalled()
  })

  it('submits the login form and stores the active session', async () => {
    const user = userEvent.setup()

    localStorage.setItem(
      USERS_KEY,
      JSON.stringify([
        {
          id: 'user-1',
          email: 'user@example.com',
          password: 'password123',
          createdAt: '2026-04-28T00:00:00.000Z',
        },
      ]),
    )

    render(<LoginForm />)

    await user.type(screen.getByTestId('auth-login-email'), 'user@example.com')
    await user.type(screen.getByTestId('auth-login-password'), 'password123')
    await user.click(screen.getByTestId('auth-login-submit'))

    const session = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null')

    expect(session).toEqual({
      userId: 'user-1',
      email: 'user@example.com',
    })
    expect(push).toHaveBeenCalledWith('/dashboard')
  })

  it('shows an error for invalid login credentials', async () => {
    const user = userEvent.setup()

    localStorage.setItem(
      USERS_KEY,
      JSON.stringify([
        {
          id: 'user-1',
          email: 'user@example.com',
          password: 'password123',
          createdAt: '2026-04-28T00:00:00.000Z',
        },
      ]),
    )

    render(<LoginForm />)

    await user.type(screen.getByTestId('auth-login-email'), 'user@example.com')
    await user.type(screen.getByTestId('auth-login-password'), 'wrong-password')
    await user.click(screen.getByTestId('auth-login-submit'))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Invalid email or password',
    )
    expect(localStorage.getItem(SESSION_KEY)).toBeNull()
    expect(push).not.toHaveBeenCalled()
  })
})
