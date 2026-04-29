import type { Metadata } from 'next'
import { Inter, Montserrat_Alternates } from 'next/font/google'

import ServiceWorkerRegistration from '@/components/shared/ServiceWorkerRegistration'

import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const montserratAlternates = Montserrat_Alternates({
  variable: '--font-montserrat-alternates',
  subsets: ['latin'],
  weight: ['600', '700'],
})

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description: 'A mobile-first habit tracker progressive web app',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserratAlternates.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  )
}
