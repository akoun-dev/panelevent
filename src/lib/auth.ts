import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { db } from '@/lib/db'

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is not set')
}
import { logger } from './logger'

import bcrypt from 'bcryptjs'

// Demo users with hashed passwords
const demoUsers = [
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


const authOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          return null
        }

        const rolePasswords: Record<string, string | undefined> = {
          ADMIN: process.env.ADMIN_PASSWORD,
          ORGANIZER: process.env.ORGANIZER_PASSWORD,
          ATTENDEE: process.env.ATTENDEE_PASSWORD
        }

        const expectedPassword =
          rolePasswords[user.role] ?? process.env.DEMO_PASSWORD

        if (!expectedPassword || credentials.password !== expectedPassword) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role
        }

        logger.info('Authorize function called', { email: credentials?.email })
        console.log('Authorize function called with:', credentials?.email)
        if (!credentials?.email || !credentials?.password) {
          logger.error('Missing credentials')
          return null
        }

        // Simple validation for demo

        if (credentials?.email === 'admin@panelevent.com' && credentials?.password === 'admin123') {
          logger.info('Admin authentication successful')

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD
        if (
          adminEmail &&
          adminPassword &&
          credentials?.email === adminEmail &&
          credentials?.password === adminPassword
        ) {
          console.log('Admin authentication successful')
          return {
            id: 'admin-id',
            email: adminEmail,
            name: 'Administrateur',
            role: 'ADMIN'
          }

        const user = demoUsers.find(u => u.email === credentials.email)
        if (user && await bcrypt.compare(credentials.password, user.passwordHash)) {
          console.log(`${user.role} authentication successful`)
          const { passwordHash, ...userWithoutPassword } = user
          return userWithoutPassword
        }
        
        if (credentials?.email === 'organizer@example.com' && credentials?.password === 'demo123') {
          logger.info('Organizer authentication successful')
          return {
            id: 'organizer-id',
            email: 'organizer@example.com',
            name: 'Organisateur Demo',
            role: 'ORGANIZER'
          }
        }
        
        if (credentials?.email === 'attendee@example.com' && credentials?.password === 'demo123') {
          logger.info('Attendee authentication successful')
          return {
            id: 'attendee-id',
            email: 'attendee@example.com',
            name: 'Participant Demo',
            role: 'ATTENDEE'
          }
        }
        logger.error('Authentication failed')
        console.log('Authentication failed')
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      logger.info('JWT callback called', { user })
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      logger.info('Session callback called', { tokenPresent: !!token })
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/'
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,

  useSecureCookies: true,
  debug: process.env.NODE_ENV !== 'production'

  useSecureCookies: process.env.NODE_ENV === 'production',
  debug: false

}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST, authOptions }
