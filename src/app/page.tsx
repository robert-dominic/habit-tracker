'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import SplashScreen from '@/components/shared/SplashScreen'
import { getCurrentSession } from '@/lib/auth'

const SPLASH_DELAY_MS = 1200

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const session = getCurrentSession()
    const nextRoute = session ? '/dashboard' : '/login'

    const timeoutId = window.setTimeout(() => {
      router.replace(nextRoute)
    }, SPLASH_DELAY_MS)

    return () => window.clearTimeout(timeoutId)
  }, [router])

  return <SplashScreen />
}
