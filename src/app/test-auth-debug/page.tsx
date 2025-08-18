"use client"

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

export default function TestAuthDebug() {
  const { data: session, status } = useSession()

  const handleSignIn = async () => {
    try {
      const result = await signIn('credentials', {
        email: 'admin@panelevent.com',
        password: 'admin123',
        redirect: false
      })
      console.log('Sign in result:', result)
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      console.log('Attempting to sign out...')
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Sign out error:', error)
      toast({
        title: 'Erreur lors de la déconnexion',
        description: 'Veuillez réessayer.',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Debug Authentification</CardTitle>
            <CardDescription>
              Page de test pour diagnostiquer les problèmes d'authentification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Status:</h3>
                <p className="text-sm bg-muted p-2 rounded">
                  {status === 'loading' ? 'Chargement...' : status}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Session:</h3>
                <p className="text-sm bg-muted p-2 rounded">
                  {session ? 'Connecté' : 'Non connecté'}
                </p>
              </div>
            </div>

            {session && (
              <div>
                <h3 className="font-semibold mb-2">Données de session:</h3>
                <pre className="text-sm bg-muted p-4 rounded overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex gap-4">
              <Button onClick={handleSignIn} disabled={status === 'loading'}>
                Se connecter en tant qu'admin
              </Button>
              <Button onClick={handleSignOut} disabled={status === 'loading'} variant="outline">
                Se déconnecter
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liens de test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <a href="/auth/signin">Page de connexion</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/admin">Administration</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/dashboard">Tableau de bord</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/">Accueil</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}