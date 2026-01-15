import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Récupère l'historique des deals envoyés à un utilisateur
 * GET /api/deals/history?userId=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID requis' },
        { status: 400 }
      )
    }

    // Get user's alerts with associated deals
    const alerts = await prisma.alert.findMany({
      where: {
        userId,
        sent: true,
      },
      include: {
        deal: true,
      },
      orderBy: {
        sentAt: 'desc',
      },
    })

    // Format response
    const dealsHistory = alerts.map((alert) => ({
      id: alert.deal.id,
      from: alert.deal.from,
      to: alert.deal.to,
      price: alert.deal.price,
      originalPrice: alert.deal.originalPrice,
      currency: alert.deal.currency,
      discount: alert.deal.discount,
      dates: alert.deal.dates ? JSON.parse(alert.deal.dates) : null,
      url: alert.deal.url,
      sentAt: alert.sentAt,
      channel: alert.channel,
      expiresAt: alert.deal.expiresAt,
      isExpired: alert.deal.expiresAt ? new Date(alert.deal.expiresAt) < new Date() : false,
    }))

    return NextResponse.json({
      success: true,
      deals: dealsHistory,
      count: dealsHistory.length,
    })
  } catch (error: any) {
    console.error('Error fetching deals history:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'historique' },
      { status: 500 }
    )
  }
}
