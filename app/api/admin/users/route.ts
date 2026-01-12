import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      include: {
        subscription: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user)

    return NextResponse.json({
      success: true,
      users: usersWithoutPasswords,
    })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    )
  }
}
