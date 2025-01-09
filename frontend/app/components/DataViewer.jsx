import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { parseErrorResponse } from "@/lib/utils"

const DataViewer = () => {
    const [objectId, setObjectId] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            const res = await fetch(`/api/event/${objectId}`)
            if (!res.ok) {
                const errorDetails = await parseErrorResponse(res)
                console.error('Error listing webhooks:', errorDetails)
                throw new Error(errorDetails.error)
            }

            const body = await res.json()
            setData(body.data)
        } catch(err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="overflow-auto w-full h-full bg-white shadow-lg">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Data Viewer</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                    View a singular data point
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Input type="text" value={objectId} onChange={(e) => setObjectId(e.target.value)} placeholder="Enter an events object id" />
                <form onSubmit={handleSubmit}>
                    <Button type="submit">Get Info</Button>
                </form>
                {data && !isLoading && (
                    <>
                        <pre>
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </>
                )}
            </CardContent>
        </Card>
    )

}

export default DataViewer