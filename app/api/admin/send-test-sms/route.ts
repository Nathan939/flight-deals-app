import { NextRequest, NextResponse } from 'next/server'
import { sendDealSMS } from '@/lib/sms'
import { DealData } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phoneNumber } = body

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Numéro de téléphone requis' },
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
      discount: 45,
      createdAt: new Date(),
    }

    // Send test SMS
    const success = await sendDealSMS(phoneNumber, testDeal)

    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi du SMS' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'SMS de test envoyé avec succès',
    })
  } catch (error: any) {
    console.error('Send test SMS error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi' },
      { status: 500 }
    )
  }
}
