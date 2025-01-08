'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const EVENT_TYPES = {
  create: "create",
  update: "update",
  delete: "delete",
}

const DATA_TYPES = {
  tag: "tag",
  enhancedTag: "enhanced_tag",
  workout: "workout",
  session: "session",
  sleep: "sleep",
  dailySleep: "daily_sleep",
  dailyReadiness: "daily_readiness",
  dailyActivity: "daily_activity",
  dailySPO2: "daily_spo2",
  sleepTime: "sleep_time",
  restModePeriod: "rest_mode_period",
  ringConfiguration: "ring_configuration",
  dailyStress: "daily_stress",
}

export default function WebhookManager() {
  const [isOpen, setIsOpen] = useState(false)
  const [eventType, setEventType] = useState('')
  const [dataType, setDataType] = useState('')
  const [webhooks, setWebhooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchWebhooks = async () => {
    try {
      const response = await fetch('/api/webhook/oura')
      if (!response.ok) throw new Error('Failed to fetch webhooks')
      const data = await response.json()
      setWebhooks(data || [])
    } catch (error) {
      console.error('Error fetching webhooks:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch webhooks',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createWebhook = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/webhook/oura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_type: eventType,
          data_type: dataType,
        }),
      })

      if (!response.ok) throw new Error('Failed to create webhook')
      
      toast({
        title: 'Success',
        description: 'Webhook created successfully',
      })
      
      fetchWebhooks()
    } catch (error) {
      console.error('Error creating webhook:', error)
      toast({
        title: 'Error',
        description: 'Failed to create webhook',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteWebhook = async (id) => {
    try {
      const response = await fetch(`/api/webhook/oura?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete webhook')
      
      toast({
        title: 'Success',
        description: 'Webhook deleted successfully',
      })
      
      fetchWebhooks()
    } catch (error) {
      console.error('Error deleting webhook:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete webhook',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    fetchWebhooks()
  }, [])

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Webhook Management</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Manage your Oura Ring webhook subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <Button 
              onClick={() => setIsOpen(!isOpen)} 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Creating...' : 'Create Webhook'}
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="mb-4">Create a Webhook</DialogTitle>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault()
                      await createWebhook()
                    }}
                    className="flex flex-col gap-4"
                  >
                    <Select onValueChange={(value) => setEventType(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Event Type" />
                      </SelectTrigger>
                      <SelectContent>
                          {Object.values(EVENT_TYPES).map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => setDataType(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Data Type" />
                      </SelectTrigger>
                      <SelectContent>
                          {Object.values(DATA_TYPES).map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    
						      {/** some inputs */}
						      <Button className='self-end' type="submit">{isLoading ? 'Creating...' : 'Create Webhook'}</Button>
                </form>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <p className="text-sm text-gray-500 hidden sm:block">
              {webhooks.length} webhook{webhooks.length !== 1 ? 's' : ''} configured
            </p>
          </div>

          <div className="grid gap-4">
            {webhooks.map((webhook) => (
              <div
                key={webhook.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="space-y-1 mb-4 sm:mb-0">
                  <p className="font-medium break-all">ID: {webhook.id}</p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <p className="text-sm text-gray-500">
                      Event: {webhook.event_type}
                    </p>
                    <p className="text-sm text-gray-500">
                      Data: {webhook.data_type}
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => deleteWebhook(webhook.id)}
                  className="w-full sm:w-auto"
                >
                  Delete
                </Button>
              </div>
            ))}

            {webhooks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">
                  No webhooks found
                </p>
                <p className="text-sm text-gray-400">
                  Create one to start receiving Oura Ring data
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
