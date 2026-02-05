import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase())

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { adminEmail, targetEmail } = body

    // Verify the requester is an admin
    if (!adminEmail || !ADMIN_EMAILS.includes(adminEmail.toLowerCase())) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      )
    }

    // Find target user
    const targetUser = await prisma.user.findUnique({
      where: { email: targetEmail },
      include: { subscription: true }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Upsert subscription to premium
    const subscription = await prisma.subscription.upsert({
      where: { userId: targetUser.id },
      update: {
        plan: 'sms',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
      create: {
        userId: targetUser.id,
        plan: 'sms',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      }
    })

    return NextResponse.json({
      success: true,
      message: `Premium accordé à ${targetEmail}`,
      subscription
    })
  } catch (error: any) {
    console.error('Grant premium error:', error)
    return NextResponse.json(
      { error: `Erreur: ${error.message}` },
      { status: 500 }
    )
  }
}
