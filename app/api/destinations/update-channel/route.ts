import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, destinationId, channel } = body

    if (!userId || !destinationId || !channel) {
      return NextResponse.json(
        { error: 'userId, destinationId, and channel are required' },
        { status: 400 }
      )
    }

    if (channel !== 'email' && channel !== 'sms') {
      return NextResponse.json(
        { error: 'channel must be "email" or "sms"' },
        { status: 400 }
      )
    }

    // Check if user is premium for SMS
    if (channel === 'sms') {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { subscription: true }
      })

      // Admin emails get premium access
      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map((e: string) => e.trim().toLowerCase())
      const isAdmin = user?.email ? adminEmails.includes(user.email.toLowerCase()) : false

      if (!isAdmin && (!user || !user.subscription || (user.subscription.plan !== 'premium' && user.subscription.plan !== 'sms'))) {
        return NextResponse.json(
          { error: 'SMS notifications require a premium subscription' },
          { status: 403 }
        )
      }
    }

    const destination = await prisma.destination.update({
      where: { id: destinationId },
      data: { notifyChannel: channel }
    })

    return NextResponse.json({
      success: true,
      destination
    })
  } catch (error: any) {
    console.error('Update channel error:', error)
    return NextResponse.json(
      { error: 'Error updating notification channel' },
      { status: 500 }
    )
  }
}
