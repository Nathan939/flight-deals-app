import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Récupérer toutes les destinations avec les informations utilisateur
    const destinations = await prisma.destination.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            subscription: {
              select: {
                plan: true,
                status: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      destinations,
      count: destinations.length
    })
  } catch (error: any) {
    console.error('Get admin destinations error:', error)
    return NextResponse.json(
      { error: 'Error fetching destinations' },
      { status: 500 }
    )
  }
}
