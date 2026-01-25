import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Fetch the 3 most recent deals
    const deals = await prisma.deal.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    })

    return NextResponse.json({
      success: true,
      deals,
    })
  } catch (error: any) {
    console.error('Error fetching recent deals:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors du chargement des deals',
      },
      { status: 500 }
    )
  }
}
