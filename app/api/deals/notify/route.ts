import { NextRequest, NextResponse } from 'next/server'
import { notifyUsersForDeal } from '@/lib/alert-system'

/**
 * API endpoint pour notifier les utilisateurs d'un nouveau deal
 *
 * Cette API doit être appelée après la création d'un deal pour
 * envoyer automatiquement les alertes (SMS/email) aux utilisateurs
 * qui ont "liké" la destination.
 *
 * POST /api/deals/notify
 * Body: {
 *   from: "Paris",
 *   to: "TYO",
 *   toCity: "Tokyo",
 *   price: 329,
 *   originalPrice: 950,
 *   currency: "EUR",
 *   discount: 65,
 *   url: "https://..."
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { from, to, toCity, price, originalPrice, currency, discount, url } = body

    // Validation
    if (!from || !to || !toCity || !price || !originalPrice || !currency || !discount) {
      return NextResponse.json(
        { error: 'Tous les champs requis: from, to, toCity, price, originalPrice, currency, discount' },
        { status: 400 }
      )
    }

    // Envoyer les notifications
    const result = await notifyUsersForDeal({
      from,
      to,
      toCity,
      price,
      originalPrice,
      currency,
      discount,
      url
    })

    if (!result.success) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi des notifications', details: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `${result.notificationsSent} notification(s) envoyée(s)`,
      details: result.details
    })
  } catch (error: any) {
    console.error('Notify deals error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'envoi des notifications' },
      { status: 500 }
    )
  }
}
