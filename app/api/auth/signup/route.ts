import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone, plan, destinations } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Validate phone for premium plan
    if (plan === 'premium' && !phone) {
      return NextResponse.json(
        { error: 'Numéro de téléphone requis pour le plan Premium' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cet email' },
        { status: 400 }
      )
    }

    // Create user
    const user = await createUser(email, password, name, phone)

    // Update subscription plan if premium
    if (plan === 'premium') {
      await prisma.subscription.update({
        where: { userId: user.id },
        data: { plan: 'premium' },
      })
    }

    // Add destinations
    if (destinations && destinations.length > 0) {
      const destData = destinations.slice(0, 5).map((code: string) => {
        const dest = require('@/lib/utils').DESTINATIONS.find(
          (d: any) => d.code === code
        )
        return {
          userId: user.id,
          city: dest?.city || '',
          country: dest?.country || '',
          code: code,
        }
      })

      await prisma.destination.createMany({
        data: destData,
      })
    }

    // Send welcome email
    await sendWelcomeEmail(email, name)

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      {
        success: true,
        user: userWithoutPassword,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Signup error:', error)
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
    })
    return NextResponse.json(
      {
        error: 'Erreur lors de l\'inscription',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}
