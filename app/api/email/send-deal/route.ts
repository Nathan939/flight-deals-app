import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendDealEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, dealId } = body

    if (!userId || !dealId) {
      return NextResponse.json(
        { error: 'userId et dealId requis' },
        { status: 400 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Get deal
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
    })

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal non trouvé' },
        { status: 404 }
      )
    }

    // Send email
    const dealData = {
      id: deal.id,
      from: deal.from,
      to: deal.to,
      toCity: deal.toCity || undefined,
      price: deal.price,
      originalPrice: deal.originalPrice,
      currency: deal.currency,
      discount: deal.discount,
      dates: deal.dates || undefined,
      url: deal.url || undefined,
      createdAt: deal.createdAt,
    }
    const success = await sendDealEmail(user.email, dealData, user.name || undefined)

    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      )
    }

    // Create alert record
    await prisma.alert.create({
      data: {
        userId: user.id,
        dealId: deal.id,
        channel: 'email',
        sent: true,
        sentAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Email envoyé avec succès',
    })
  } catch (error: any) {
    console.error('Send email error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi' },
      { status: 500 }
    )
  }
}
