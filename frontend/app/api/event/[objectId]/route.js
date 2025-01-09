import { NextResponse } from "next/server";
import Data from "@/app/models/Data";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authConfig } from '@/app/api/auth/auth.config.js'
import { parseErrorResponse } from "@/lib/utils";

export async function GET(request, { params }) {
    const objectId = (await params).objectId
     try {
        const session = await getServerSession(authConfig)
        if (!session?.accessToken) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        await connectToDatabase()
        const objectEvent = await Data.findOne({ object_id: objectId })
        if (objectEvent.length === 0) {
            throw new Error(`Object with id ${objectId} does not exist`)
        }

        // Grab Sleep Document related to Event
        const res = await fetch(`https://api.ouraring.com/v2/usercollection/sleep/${String(objectEvent.object_id)}`, {
            headers: {
                'Authorization': `Bearer ${session.accessToken}`,
                'x-client-id': process.env.OAUTH_CLIENT_ID,
                'x-client-secret': process.env.OAUTH_CLIENT_SECRET
            }
        })

        if (!res.ok) {
            const errorDetails = await parseErrorResponse(res)
            console.error('Error listing webhooks:', errorDetails)
            return NextResponse.json({
                error: errorDetails.error,
                status: errorDetails.status,
                type: errorDetails.type
            }, { status: errorDetails.status })
        }
        
        const body = await res.json() 

        return NextResponse.json({ data: body })
    } catch(err) {
        console.error(err)
        return NextResponse.json({ error: err.message }, { status: 400 })
    }
}
