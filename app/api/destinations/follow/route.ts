import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, code, city, country, notifyChannel } = body

    if (!userId || !code || !city) {
      return NextResponse.json(
        { error: 'userId, code et city sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si déjà suivi
    const existing = await prisma.destination.findFirst({
      where: {
        userId,
        code
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Destination déjà suivie' },
        { status: 400 }
      )
    }

    // Créer la destination
    const destination = await prisma.destination.create({
      data: {
        userId,
        code,
        city,
        country: country || '',
        notifyChannel: notifyChannel || 'email'
      }
    })

    return NextResponse.json({ destination }, { status: 201 })
  } catch (error) {
    console.error('Erreur création destination:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
