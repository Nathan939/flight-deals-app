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

// PATCH - Update search request status
export async function PATCH(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, status } = data

    if (!id || !status) {
      return NextResponse.json(
        { error: 'id and status are required' },
        { status: 400 }
      )
    }

    if (!['pending', 'processed', 'sent'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const updated = await prisma.searchRequest.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json({ success: true, searchRequest: updated })
  } catch (error: any) {
    console.error('Error updating search request:', error)
    return NextResponse.json(
      { error: 'Error updating search request', details: error.message },
      { status: 500 }
    )
  }
}
