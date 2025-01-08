import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import crypto from 'crypto'
import { authConfig } from '@/app/api/auth/auth.config.js'

// Helper function to safely parse response
async function parseErrorResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  try {
    if (contentType.includes('application/json')) {
      const jsonError = await response.json()
      return {
        status: response.status,
        error: jsonError.detail || JSON.stringify(jsonError),
        type: 'json'
      }
    } else {
      const textError = await response.text()
      return {
        status: response.status,
        error: textError,
        type: 'text'
      }
    }
  } catch (e) {
    return {
      status: response.status,
      error: `Failed to parse error response: ${e.message}`,
      type: 'unknown'
    }
  }
}

// List webhook subscriptions
export async function GET(request) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.accessToken) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const response = await fetch('https://api.ouraring.com/v2/webhook/subscription', {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'x-client-id': process.env.OAUTH_CLIENT_ID,
        'x-client-secret': process.env.OAUTH_CLIENT_SECRET
      }
    })

    if (!response.ok) {
      const errorDetails = await parseErrorResponse(response)
      console.error('Error listing webhooks:', errorDetails)
      return NextResponse.json({
        error: errorDetails.error,
        status: errorDetails.status,
        type: errorDetails.type
      }, { status: errorDetails.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error listing webhooks:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// Create webhook subscription
export async function POST(request) {
  try {
    const params = await request.json()
    console.log(params)
    const session = await getServerSession(authConfig)
    if (!session?.accessToken) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const verificationToken = crypto
      .createHmac('sha256', process.env.OURA_WEBHOOK_SECRET)
      .update(`${process.env.OURA_WEBHOOK_KEY}`)
      .digest('hex')

    const response = await fetch('https://api.ouraring.com/v2/webhook/subscription', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
        'x-client-id': process.env.OAUTH_CLIENT_ID,
        'x-client-secret': process.env.OAUTH_CLIENT_SECRET,
      },
      body: JSON.stringify({
        callback_url: `${process.env.NEXTAUTH_URL}/api/webhook/oura/events`,
        verification_token: verificationToken,
        event_type: params.event_type,
        data_type: params.data_type,
      })
    })

    if (!response.ok) {
      const errorDetails = await parseErrorResponse(response)
      console.error('Error creating webhook:', errorDetails)
      return NextResponse.json({
        error: errorDetails.error,
        status: errorDetails.status,
        type: errorDetails.type
      }, { status: errorDetails.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating webhook:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// Delete webhook subscription
export async function DELETE(request) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.accessToken) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const subscriptionId = searchParams.get('id')
    
    if (!subscriptionId) {
      return new NextResponse('Subscription ID is required', { status: 400 })
    }

    const response = await fetch(`https://api.ouraring.com/v2/webhook/subscription/${subscriptionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'x-client-id': process.env.OAUTH_CLIENT_ID,
        'x-client-secret': process.env.OAUTH_CLIENT_SECRET,
      }
    })

    if (!response.ok) {
      const errorDetails = await parseErrorResponse(response)
      console.error('Error deleting webhook:', errorDetails)
      return NextResponse.json({
        error: errorDetails.error,
        status: errorDetails.status,
        type: errorDetails.type
      }, { status: errorDetails.status })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting webhook:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
