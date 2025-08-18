import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  let token
  try {
    token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: false
    })
  } catch (error) {
    console.log('JWT decryption error, clearing session and redirecting to login')
    // Clear the session cookie and redirect to login
    const response = NextResponse.redirect(new URL('/auth/signin', request.url))
    response.cookies.delete('next-auth.session-token')
    response.cookies.delete('next-auth.csrf-token')
    return response
  }
  
  const { pathname } = request.nextUrl

  console.log('Middleware - Path:', pathname)
  console.log('Middleware - Token:', token)

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page protégée
  if (!token && (
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/admin') || 
    pathname.startsWith('/events/create') ||
    pathname.startsWith('/admin-simple')
  )) {
    console.log('Redirecting to signin - no token')
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Si l'utilisateur est connecté
  if (token) {
    const userRole = token.role as string
    console.log('User role:', userRole)

    // Redirection selon le rôle après connexion (uniquement depuis la page de connexion)
    if (pathname === '/auth/signin') {
      console.log('Redirecting from signin based on role:', userRole)
      if (userRole === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else if (userRole === 'ORGANIZER') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } else {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // Protection des routes admin
    if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
      console.log('Access denied to admin route for role:', userRole)
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Protection des routes admin-simple
    if (pathname.startsWith('/admin-simple') && userRole !== 'ADMIN') {
      console.log('Access denied to admin-simple route for role:', userRole)
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Protection des routes dashboard
    if (pathname.startsWith('/dashboard') && userRole !== 'ORGANIZER' && userRole !== 'ADMIN') {
      console.log('Access denied to dashboard route for role:', userRole)
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Protection des routes de création d'événements
    if (pathname.startsWith('/events/create') && userRole !== 'ORGANIZER' && userRole !== 'ADMIN') {
      console.log('Access denied to events/create route for role:', userRole)
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/admin-simple/:path*',
    '/events/create/:path*',
    '/auth/signin',
  ],
}