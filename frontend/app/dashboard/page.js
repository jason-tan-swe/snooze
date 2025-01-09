'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import WebhookManager from '@/app/components/WebhookManager'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Button } from '@/components/ui/button'
import { LogOutIcon } from 'lucide-react'
import EventViewer from '../components/EventViewer'
import DataViewer from '../components/DataViewer'
import PersonalDataManager from '../components/PersonalDataManager'

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
    <div className="max-h-body h-full w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button
          onClick={() => signOut({ callbackUrl: '/home' })}
          variant="ghost"
        >
          <LogOutIcon />
        </Button>
      </div>

      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel
              minSize={20}
            >
              <PersonalDataManager data={session.data} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel
              minSize={40}
            >
              <WebhookManager />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel
              minSize={20}
            >
              <DataViewer />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel
              minSize={40}
            >
              <EventViewer />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}