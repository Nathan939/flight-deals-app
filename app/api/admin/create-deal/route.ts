import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateDiscount } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { from, to, price, originalPrice, currency, dates, url } = body

    // Validate required fields
    if (!from || !to || !price || !originalPrice) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      )
    }

    const priceNum = parseFloat(price)
    const originalPriceNum = parseFloat(originalPrice)
    const discount = calculateDiscount(originalPriceNum, priceNum)

    // Create deal
    const deal = await prisma.deal.create({
      data: {
        from,
        to,
        price: priceNum,
        originalPrice: originalPriceNum,
        currency: currency || 'EUR',
        dates: dates || null,
        url: url || null,
        discount,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    })

    return NextResponse.json({
      success: true,
      deal,
    })
  } catch (error: any) {
    console.error('Create deal error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du deal' },
      { status: 500 }
    )
  }
}
