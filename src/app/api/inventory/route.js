import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    // Log to server console for debugging
    console.log('Received inventory submission:', JSON.stringify(body))
    return NextResponse.json({ ok: true, received: body })
  } catch (err) {
    console.error('Error in inventory route:', err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
