import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { connectToDatabase } from '@/lib/mongodb'
import Data from '@/app/models/Data'

// Health-Check
export async function PATCH(request) {
  try {
    return NextResponse.json({ message: 'OK' })
  } catch (err) {
    return NextResponse.json({ message: 'Error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectToDatabase()
    const body = await request.json()
    console.log('Webhook event received:', body)
    
    // Verify webhook signature
    const signature = request.headers.get('x-oura-signature')
    const webhookSecret = process.env.OURA_WEBHOOK_SECRET

    if (!verifySignature(signature, JSON.stringify(body), webhookSecret)) {
      return new NextResponse('Invalid signature', { status: 401 })
    }

    // Handle different event types
    switch (body.data_type) {
      case 'sleep':
      case 'session':
      case 'tag':
      case 'workout':
      default:
        handleEvent(body)
        console.log('Unhandled event type:', body)
    }

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook event error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// Verify webhook subscription
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const challenge = searchParams.get('challenge')
    const verificationToken = searchParams.get('verification_token')
    if (!searchParams.size) {
      return new NextResponse('No parameters received', { status: 400 })
    }

    // Verify Webhook Token
    if (challenge) {
      // The Verification Token should match our original verification token
      const expectedToken = crypto
        .createHmac('sha256', process.env.OURA_WEBHOOK_SECRET)
        .update(`${process.env.OURA_WEBHOOK_KEY}`)
        .digest('hex')
        
      if (verificationToken === expectedToken) {
        return NextResponse.json({ challenge })
      }
      
      return new NextResponse('Invalid challenge', { status: 401 })
    }

    return NextResponse.json(Object.fromEntries(searchParams))
  } catch (error) {
    console.error('Error verifying webhook or receiving data:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

function verifySignature(signature, body, secret) {
  if (!signature || !secret) return false
  
  const hmac = crypto.createHmac('sha256', secret)
  const computedSignature = hmac.update(body).digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSignature)
  )
}

async function handleEvent(data) {
  console.log("Event Received of type", data.data_type)
  const newEvent = new Data(data)
  await newEvent.save()
  console.log("Saved!")
}

async function handleSleepEvent(data) {
  // TODO: Implement sleep event handling
  console.log('Sleep event received:', data)
}

async function handleSessionEvent(data) {
  // TODO: Implement session event handling
  console.log('Session event received:', data)
}

async function handleTagEvent(data) {
  // TODO: Implement tag event handling
  console.log('Tag event received:', data)
}

async function handleWorkoutEvent(data) {
  // TODO: Implement workout event handling
  console.log('Workout event received:', data)
}
