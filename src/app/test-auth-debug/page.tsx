"use client"

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestAuthDebug() {
  const { data: session, status } = useSession()

  const handleSignIn = async () => {
    try {
      await signIn()
    } catch (error) {
      console.error('Sign in error:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      console.log('Attempting to sign out...')
      
      // Supprimer les cookies NextAuth manuellement
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=')
        if (name.includes('next-auth')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        }
      })
      
      // Appeler la fonction signOut de NextAuth
      await signOut({ callbackUrl: '/' })
      
      // Forcer le rechargement de la page
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
      // En cas d'erreur, forcer le rechargement quand même
      window.location.href = '/'
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
                Se connecter
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