import { NextRequest, NextResponse } from 'next/server'
import { sendDealEmail } from '@/lib/email'
import { DealData } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      )
    }

    // Create a test deal
    const testDeal: DealData = {
      id: 'test',
      from: 'Paris',
      to: 'Tokyo',
      price: 439,
      originalPrice: 800,
      currency: 'EUR',
      dates: 'Avril - Juin 2026',
      url: 'https://example.com/booking',
      discount: 45,
      createdAt: new Date(),
    }

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY non configurée' },
        { status: 500 }
      )
    }

    // Send test email
    const result = await sendDealEmail(email, testDeal)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Erreur inconnue' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Email de test envoyé avec succès',
    })
  } catch (error: any) {
    console.error('Send test email error:', error)
    return NextResponse.json(
      { error: `Erreur: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}
