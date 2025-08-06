import { NextRequest, NextResponse } from 'next/server'

// Demo users for authentication
const DEMO_USERS = [
  {
    id: 1,
    email: 'admin@fabfit.com',
    password: 'admin123',
    type: 'admin',
    name: 'Admin User'
  },
  {
    id: 2,
    email: 'user@fabfit.com',
    password: 'user123',
    type: 'user',
    name: 'John Doe'
  }
]

export async function POST(request: NextRequest) {
  try {
    const { email, password, userType } = await request.json()

    // Validate input
    if (!email || !password || !userType) {
      return NextResponse.json(
        { error: 'Email, password, and user type are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = DEMO_USERS.find(
      u => u.email === email && u.password === password && u.type === userType
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials or user type' },
        { status: 401 }
      )
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
