import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    console.log('Testing NextAuth configuration...')
    console.log('Auth options providers:', authOptions.providers?.length)
    
    const session = await getServerSession(authOptions)
    console.log('Server session:', session)
    
    return NextResponse.json({ 
      message: 'NextAuth test endpoint',
      session: session,
      authOptionsConfigured: !!authOptions,
      providersCount: authOptions.providers?.length || 0
    })
  } catch (error: unknown) {
    console.error('NextAuth test error:', error)
    return NextResponse.json(
      {
        error: 'NextAuth test failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}