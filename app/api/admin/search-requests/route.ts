import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// POST - Create a new search request
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const searchRequest = await prisma.searchRequest.create({
      data: {
        userId: data.userId,
        userEmail: data.userEmail,
        userName: data.userName || null,
        from: data.from,
        fromCity: data.fromCity,
        to: data.to,
        toCity: data.toCity,
        departureMonth: data.departureMonth || null,
        returnMonth: data.returnMonth || null,
        tripType: data.tripType || 'return',
        maxPrice: data.maxPrice || null,
        status: 'pending'
      }
    })

    return NextResponse.json({
      success: true,
      searchRequest
    })
  } catch (error: any) {
    console.error('Error creating search request:', error)
    return NextResponse.json(
      { error: 'Error creating search request', details: error.message },
      { status: 500 }
    )
  }
}

// GET - Get all search requests (for admin)
export async function GET() {
  try {
    const searchRequests = await prisma.searchRequest.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      searchRequests
    })
  } catch (error: any) {
    console.error('Error fetching search requests:', error)
    return NextResponse.json(
      { error: 'Error fetching search requests', details: error.message },
      { status: 500 }
    )
  }
}
