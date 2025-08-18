import { NextRequest, NextResponse } from 'next/server'

// In-memory user store for demo
const users = [
  {
    id: 'admin-id',
    email: 'admin@panelevent.com',
    name: 'Administrateur',
    role: 'ADMIN',
    password: 'admin123'
  },
  {
    id: 'organizer-id',
    email: 'organizer@example.com',
    name: 'Organisateur Demo',
    role: 'ORGANIZER',
    password: 'demo123'
  },
  {
    id: 'attendee-id',
    email: 'attendee@example.com',
    name: 'Participant Demo',
    role: 'ATTENDEE',
    password: 'demo123'
  }
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Return user info without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Login test error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}