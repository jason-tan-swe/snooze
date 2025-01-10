import { NextResponse } from "next/server";
import Data from "@/app/models/Data";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/auth.config.js";

export async function GET(request) {
    try {
        const session = await getServerSession(authConfig)
        if (!session?.accessToken) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        await connectToDatabase()
        const allEvents = await Data.find({ user_id: session.user.id })
        return NextResponse.json({ data: allEvents })
    } catch(err) {
        console.error(err)
        return NextResponse.json({ error: err }).status(400)
    }
}
