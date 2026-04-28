import { clearSession, getSession, getUsers, saveSession, saveUsers } from './storage'

import type { Session, User } from "@/types/auth"

type AuthResult = {
  success: boolean
  session?: Session
  error?: string
}

// Normalize email without changing password input.
function normalizeEmail(email: string): string {
  return email.trim()
}

// Read the active session from local storage.
export function getCurrentSession(): Session | null {
  return getSession()
}

export function signup(email: string, password: string): AuthResult {
  const normalizedEmail = normalizeEmail(email)
  const users = getUsers()
  const existingUser = users.find((user) => user.email === normalizedEmail)

  if (existingUser) {
    return {
      success: false,
      error: 'User already exists',
    }
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  }

  saveUsers([...users, newUser])

  const session: Session = {
    userId: newUser.id,
    email: newUser.email,
  }

  saveSession(session)

  return {
    success: true,
    session,
  }
}

export function login(email: string, password: string): AuthResult {
  const normalizedEmail = normalizeEmail(email)
  const users = getUsers()
  const matchedUser = users.find(
    (user) => user.email === normalizedEmail && user.password === password,
  )

  if (!matchedUser) {
    return {
      success: false,
      error: 'Invalid email or password',
    }
  }

  const session: Session = {
    userId: matchedUser.id,
    email: matchedUser.email,
  }

  saveSession(session)

  return {
    success: true,
    session,
  }
}

// Remove the active session during logout.
export function logout(): void {
  clearSession()
}
