import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const PersonalDataManager = ({ data }) => {
    return (
        <Card className="overflow-auto w-full h-full bg-white shadow-lg">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Personal Information</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                View your Oura Ring Data
                </CardDescription>
            </CardHeader>
            <CardContent>
                <pre className="h-full bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(data, null, 2)}
                </pre>
            </CardContent>
        </Card>
    )
}

export default PersonalDataManager