import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const deal = await prisma.deal.findUnique({
      where: { id }
    })

    if (!deal) {
      return NextResponse.json(
        { success: false, error: 'Deal introuvable' },
        { status: 404 }
      )
    }

    let parsedActivities: string[] = []
    if (deal.activities) {
      try {
        parsedActivities = JSON.parse(deal.activities)
      } catch {
        parsedActivities = []
      }
    }

    let parsedDates = null
    if (deal.dates) {
      try {
        const parsed = JSON.parse(deal.dates)
        if (typeof parsed === 'object' && !Array.isArray(parsed)) {
          parsedDates = parsed
        } else {
          parsedDates = deal.dates
        }
      } catch {
        parsedDates = deal.dates
      }
    }

    return NextResponse.json({
      success: true,
      deal: {
        ...deal,
        activities: parsedActivities,
        dates: parsedDates,
      }
    })
  } catch (error) {
    console.error('Error fetching deal:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération du deal' },
      { status: 500 }
    )
  }
}
