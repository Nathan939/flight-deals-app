import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendDealSMS } from '@/lib/sms'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, dealId, phoneNumber } = body

    if (!userId || !dealId || !phoneNumber) {
      return NextResponse.json(
        { error: 'userId, dealId et phoneNumber requis' },
        { status: 400 }
      )
    }

    // Get user and verify they have SMS plan
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    if (user.subscription?.plan !== 'sms') {
      return NextResponse.json(
        { error: 'Abonnement SMS requis' },
        { status: 403 }
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

    // Send SMS
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
    const success = await sendDealSMS(phoneNumber, dealData)

    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi du SMS' },
        { status: 500 }
      )
    }

    // Create alert record
    await prisma.alert.create({
      data: {
        userId: user.id,
        dealId: deal.id,
        channel: 'sms',
        sent: true,
        sentAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'SMS envoyé avec succès',
    })
  } catch (error: any) {
    console.error('Send SMS error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi' },
      { status: 500 }
    )
  }
}
