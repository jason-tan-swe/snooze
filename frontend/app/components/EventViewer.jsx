import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import { columns } from "./EventsTable/columns"
import { DataTable } from "./EventsTable/data-table"

const EventViewer = () => {
    const [events, setEvents] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchEvents = async () => {
        try {
          setIsLoading(true)
          const response = await fetch('/api/event')
          if (!response.ok) throw new Error('Failed to fetch webhooks')
          const data = await response.json()
          setEvents(data.data || [])
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to fetch webhooks',
            variant: 'destructive',
          })
        } finally {
          setIsLoading(false)
        }
      }

    useEffect(() => {
        fetchEvents()
    }, [])

    return (
        <Card className="overflow-auto w-full h-full bg-white shadow-lg">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Event Viewer</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                    View your Oura Ring Webhook events
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Found {events.length} events</p>
                {isLoading ? (
                    <Skeleton className="w-[100px] h-[20px] rounded-full" /> 
                )
                : (
                    <DataTable columns={columns} data={events}/>
                )}
                
            </CardContent>
        </Card>
    )

}

export default EventViewer