import { NextResponse } from "next/server";
import Data from "@/app/models/Data";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request) {
    try {
        await connectToDatabase()
        const allEvents = await Data.find({})
        return NextResponse.json({ data: allEvents })
    } catch(err) {
        console.error(err)
        return NextResponse.json({ error: err }).status(400)
    }
}
