import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, code } = body

    if (!userId || !code) {
      return NextResponse.json(
        { error: 'User ID et code requis' },
        { status: 400 }
      )
    }

    // Supprimer la destination
    const deleted = await prisma.destination.deleteMany({
      where: {
        userId,
        code
      }
    })

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: 'Destination non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur suppression destination:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
