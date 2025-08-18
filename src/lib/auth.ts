import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { logger } from './logger'

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
        logger.info('Authorize function called', { email: credentials?.email })
        
        if (!credentials?.email || !credentials?.password) {
          logger.error('Missing credentials')
          return null
        }

        // Simple validation for demo
        if (credentials?.email === 'admin@panelevent.com' && credentials?.password === 'admin123') {
          logger.info('Admin authentication successful')
          return {
            id: 'admin-id',
            email: 'admin@panelevent.com',
            name: 'Administrateur',
            role: 'ADMIN'
          }
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
  useSecureCookies: process.env.NODE_ENV === 'production',
  debug: false
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST, authOptions }
