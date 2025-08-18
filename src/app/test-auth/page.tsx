"use client"

import { useSession, signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestAuthPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test d'authentification</CardTitle>
            <CardDescription>
              Vérification de l'état de l'authentification NextAuth
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Statut de la session:</h3>
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Session:</strong> {session ? 'Active' : 'Inactive'}</p>
              {session && (
                <div className="mt-2 space-y-1">
                  <p><strong>ID:</strong> {session.user?.id}</p>
                  <p><strong>Nom:</strong> {session.user?.name}</p>
                  <p><strong>Email:</strong> {session.user?.email}</p>
                  <p><strong>Rôle:</strong> {session.user?.role}</p>
                </div>
              )}
            </div>
            
            {!session && (
              <div className="space-y-2">
                <h3 className="font-semibold">Comptes de démonstration:</h3>
                <div className="grid gap-2">
                  <Button
                    onClick={() => {
                      signIn('credentials', {
                        email: 'organizer@example.com',
                        password: 'demo123',
                        callbackUrl: '/dashboard'
                      })
                    }}
                    variant="outline"
                    className="justify-start"
                  >
                    <div className="text-left">
                      <div>Organizer: organizer@example.com / demo123</div>
                    </div>
                  </Button>
                  <Button 
                    onClick={() => {
                      signIn('credentials', { 
                        email: 'attendee@example.com', 
                        password: 'demo123',
                        callbackUrl: '/'
                      })
                    }}
                    variant="outline"
                    className="justify-start"
                  >
                    <div className="text-left">
                      <div>Attendee: attendee@example.com / demo123</div>
                    </div>
                  </Button>
                </div>
              </div>
            )}
            
            {session && (
              <div className="space-y-2">
                <h3 className="font-semibold">Liens de test:</h3>
                <div className="grid gap-2">
                  {session.user?.role === 'ADMIN' && (
                    <Button asChild variant="outline">
                      <a href="/admin" target="_blank">
                        Page d'administration
                      </a>
                    </Button>
                  )}
                  {session.user?.role === 'ORGANIZER' && (
                    <Button asChild variant="outline">
                      <a href="/dashboard" target="_blank">
                        Tableau de bord organisateur
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}