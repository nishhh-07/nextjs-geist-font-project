import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo purposes (in production, use a database)
let registeredUsers: Array<{
  id: number
  fullName: string
  email: string
  phone: string
  registeredAt: string
}> = []

let nextUserId = 1000

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password, phone } = await request.json()

    // Validate input
    if (!fullName || !email || !password || !phone) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = registeredUsers.find(user => user.email === email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      )
    }

    // Create new user
    const newUser = {
      id: nextUserId++,
      fullName,
      email,
      phone,
      registeredAt: new Date().toISOString()
    }

    registeredUsers.push(newUser)

    // Log registration for demo purposes
    console.log('New user registered:', { ...newUser, password: '[HIDDEN]' })

    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'Registration successful'
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Return registered users (for admin purposes)
  return NextResponse.json({
    users: registeredUsers,
    total: registeredUsers.length
  })
}
