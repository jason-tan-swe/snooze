'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Dashboard from '@/app/dashboard/page.js'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (session) {
    return <Dashboard />
  }

  return (
    <main className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to Snooze</h1>
        <button
          onClick={() => signIn('oura', { callbackUrl: '/home' })}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Sign in with Oura Ring
        </button>
      </div>
    </main>
  )
}