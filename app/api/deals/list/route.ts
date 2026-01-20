import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Fetch all deals, ordered by creation date (newest first)
    const deals = await prisma.deal.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      deals,
    })
  } catch (error: any) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors du chargement des deals',
      },
      { status: 500 }
    )
  }
}
