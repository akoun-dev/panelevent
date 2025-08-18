import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
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
        console.log('Authorize function called with:', credentials?.email)

        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        const user = demoUsers.find(u => u.email === credentials.email)
        if (user && await bcrypt.compare(credentials.password, user.passwordHash)) {
          console.log(`${user.role} authentication successful`)
          const { passwordHash, ...userWithoutPassword } = user
          return userWithoutPassword
        }

        console.log('Authentication failed')
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback called, user:', user)
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      console.log('Session callback called, token:', token)
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
  useSecureCookies: false,
  debug: true // Enable debug mode
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST, authOptions }