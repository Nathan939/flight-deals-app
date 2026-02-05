import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Admin emails always get premium access
    const isAdmin = ADMIN_EMAILS.includes(user.email.toLowerCase())
    if (isAdmin) {
      return NextResponse.json({
        subscription: {
          ...user.subscription,
          plan: 'sms',
          status: 'active',
        }
      })
    }

    return NextResponse.json({
      subscription: user.subscription
    })
  } catch (error: any) {
    console.error('Get subscription error:', error)
    return NextResponse.json(
      { error: 'Error fetching subscription' },
      { status: 500 }
    )
  }
}
