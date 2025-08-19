import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'


// In-memory user store for demo with hashed passwords
const users = [
  {
    id: 'admin-id',
    email: 'admin@panelevent.com',
    name: 'Administrateur',
    role: 'ADMIN',
    passwordHash: bcrypt.hashSync('admin123', 10)
  },
  {
    id: 'organizer-id',
    email: 'organizer@example.com',
    name: 'Organisateur Demo',
    role: 'ORGANIZER',
    passwordHash: bcrypt.hashSync('demo123', 10)
  },
  {
    id: 'attendee-id',
    email: 'attendee@example.com',
    name: 'Participant Demo',
    role: 'ATTENDEE',
    passwordHash: bcrypt.hashSync('demo123', 10)
  }
]

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = users.find(u => u.email === email)

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied. Admin only.' }, { status: 403 })
    }

    // Return user info without password hash
    const { passwordHash, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Admin login successful',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}