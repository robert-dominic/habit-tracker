'use client'

import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { getCurrentSession } from '@/lib/auth'

type ProtectedRouteProps = {
  children: ReactNode
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const session = getCurrentSession()

    if (!session) {
      router.replace('/login')
      return
    }

    setIsAuthorized(true)
  }, [router])

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
