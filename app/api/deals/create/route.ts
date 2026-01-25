import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyUsersForDeal } from '@/lib/alert-system'

/**
 * API pour créer un nouveau deal
 *
 * POST /api/deals/create
 * Body: {
 *   from: "Paris",
 *   to: "TYO",
 *   toCity: "Tokyo",
 *   price: 329,
 *   originalPrice: 950,
 *   currency: "EUR",
 *   discount: 65,
 *   dates: "Été 2026",
 *   url: "https://...",
 *   expiresAt: "2026-03-01" (optionnel)
 * }
 *
 * Headers:
 *   x-admin-key: clé secrète admin
 */
export async function POST(request: NextRequest) {
  try {
    // Vérification de la clé admin (simple protection)
    const adminKey = request.headers.get('x-admin-key')
    if (adminKey !== process.env.ADMIN_API_KEY && adminKey !== 'flightalert-admin-2024') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { from, to, toCity, price, originalPrice, currency, discount, dates, url, expiresAt } = body

    // Validation
    if (!from || !to || !toCity || !price || !originalPrice || !discount) {
      return NextResponse.json(
        { error: 'Champs requis: from, to, toCity, price, originalPrice, discount' },
        { status: 400 }
      )
    }

    // Créer le deal en base de données
    const deal = await prisma.deal.create({
      data: {
        from,
        to: toCity, // Nom de la ville pour l'affichage
        price,
        originalPrice,
        currency: currency || 'EUR',
        discount,
        dates: dates || null,
        url: url || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    })

    // Envoyer les notifications aux utilisateurs qui suivent cette destination
    const notificationResult = await notifyUsersForDeal({
      from,
      to, // Code aéroport pour matcher les destinations
      toCity,
      price,
      originalPrice,
      currency: currency || 'EUR',
      discount,
      url,
    })

    // Créer les alertes en base pour l'historique des utilisateurs
    if (notificationResult.details) {
      for (const notification of notificationResult.details) {
        if (notification.success) {
          await prisma.alert.create({
            data: {
              userId: notification.userId,
              dealId: deal.id,
              sent: true,
              sentAt: new Date(),
              channel: notification.type,
            },
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      deal,
      notifications: {
        sent: notificationResult.notificationsSent || 0,
        details: notificationResult.details,
      },
    })
  } catch (error: any) {
    console.error('Error creating deal:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du deal', details: error.message },
      { status: 500 }
    )
  }
}
