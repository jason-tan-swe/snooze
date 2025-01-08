'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import WebhookManager from '@/app/components/WebhookManager'

export default function DashboardPage() {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      router.push('/')
    }
  }, [session.status, router])

  if (!session.data) {
    return <div>Loading...</div>
  }

  if (session.status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div className="h-screen w-screen mx-auto p-4 space-y-8 overflow-auto">
      <WebhookManager />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            onClick={() => signOut({ callbackUrl: '/home' })}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Oura Ring Data</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(session.data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}