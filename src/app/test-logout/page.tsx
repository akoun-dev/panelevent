"use client"

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, User, CheckCircle, XCircle } from 'lucide-react'

export default function TestLogout() {
  const { data: session, status } = useSession()
  const isDisabled = (!session) || ((status as string) === 'loading')

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
      const result = await signOut({ callbackUrl: '/' })
      console.log('Sign out result:', result)
      
      // Forcer le rechargement de la page
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
      // En cas d'erreur, forcer le rechargement quand même
      window.location.href = '/'
    }
  }

  const handleSignOutWithRedirect = async () => {
    try {
      console.log('Attempting to sign out with redirect...')
      
      // Supprimer les cookies NextAuth manuellement
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=')
        if (name.includes('next-auth')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        }
      })
      
      await signOut({ redirect: true, callbackUrl: '/' })
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out with redirect error:', error)
      window.location.href = '/'
    }
  }

  const handleSignOutWithoutRedirect = async () => {
    try {
      console.log('Attempting to sign out without redirect...')
      
      // Supprimer les cookies NextAuth manuellement
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=')
        if (name.includes('next-auth')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        }
      })
      
      const result = await signOut({ redirect: false })
      console.log('Sign out without redirect result:', result)
      
      // Forcer le rechargement de la page
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out without redirect error:', error)
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Test de déconnexion
            </CardTitle>
            <CardDescription>
              Page de test pour vérifier le fonctionnement de la déconnexion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Statut de la session */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Statut de l'authentification
                </h3>
                <div className="flex items-center gap-2">
                  {status === 'loading' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  ) : session ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">
                    {status === 'loading' ? 'Chargement...' : 
                     session ? 'Connecté' : 'Non connecté'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Session</h3>
                <div className="flex items-center gap-2">
                  {session ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Session active</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Aucune session</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Informations de la session */}
            {session && (
              <div className="space-y-2">
                <h3 className="font-semibold">Informations de la session</h3>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="text-sm">
                    <strong>Nom:</strong> {session.user?.name}
                  </div>
                  <div className="text-sm">
                    <strong>Email:</strong> {session.user?.email}
                  </div>
                  <div className="text-sm">
                    <strong>Rôle:</strong> {session.user?.role}
                  </div>
                  <div className="text-sm">
                    <strong>ID:</strong> {session.user?.id}
                  </div>
                </div>
              </div>
            )}

            {/* Boutons de test */}
            <div className="space-y-4">
              <h3 className="font-semibold">Options de déconnexion</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={handleSignOut}
                  disabled={isDisabled}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion standard
                </Button>
                
                <Button
                  onClick={handleSignOutWithRedirect}
                  disabled={isDisabled}
                  variant="outline"
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion avec redirect
                </Button>
                
                <Button
                  onClick={handleSignOutWithoutRedirect}
                  disabled={isDisabled}
                  variant="outline"
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion manuelle
                </Button>
              </div>
            </div>

            {/* Liens utiles */}
            <div className="space-y-2">
              <h3 className="font-semibold">Liens utiles</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" asChild>
                  <a href="/">Accueil</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/auth/signin">Page de connexion</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/dashboard">Tableau de bord</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/admin">Administration</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/test-auth-debug">Debug Auth</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions de test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>1. Connectez-vous d'abord avec un compte (admin@panelevent.com / admin123)</p>
              <p>2. Revenez sur cette page pour voir les informations de session</p>
              <p>3. Testez les différentes méthodes de déconnexion</p>
              <p>4. Vérifiez que vous êtes bien déconnecté et redirigé vers l'accueil</p>
              <p>5. Consultez la console du navigateur pour les messages de debug</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}