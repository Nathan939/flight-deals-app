import { NextRequest, NextResponse } from 'next/server'
import { searchDestinations } from '@/lib/location-search'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        results: [],
        message: 'Query must be at least 2 characters'
      })
    }

    const results = await searchDestinations(query, limit)

    return NextResponse.json({
      results,
      count: results.length
    })
  } catch (error: any) {
    console.error('Search destinations error:', error)
    return NextResponse.json(
      { error: 'Error searching destinations', details: error.message },
      { status: 500 }
    )
  }
}
