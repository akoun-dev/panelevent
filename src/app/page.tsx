"use client"

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, Clock, User, LogOut } from 'lucide-react'

export default function Home() {
  const { data: session, status } = useSession()
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrateur'
      case 'ORGANIZER': return 'Organisateur'
      case 'ATTENDEE': return 'Participant'
      default: return role
    }
  }

  const handleSignOut = async () => {
    try {
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

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">P</span>
              </div>
              <h1 className="text-2xl font-bold">PanelEvent</h1>
            </div>
            <nav className="flex items-center space-x-4">
              {session ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">
                      {session.user?.name} ({getRoleLabel(session.user?.role as string)})
                    </span>
                  </div>
                  {session.user?.role === 'ORGANIZER' && (
                    <Button variant="outline" asChild>
                      <a href="/dashboard">Tableau de bord</a>
                    </Button>
                  )}
                  {session.user?.role === 'ADMIN' && (
                    <Button variant="outline" asChild>
                      <a href="/admin">Administration</a>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={() => signIn()}>
                    Connexion
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Bienvenue sur <span className="text-primary">PanelEvent</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            La plateforme unifiée pour la gestion d'événements, sessions interactives, 
            questions en direct, sondages et attestations.
          </p>
          <div className="flex justify-center">
            {session?.user?.role === 'ORGANIZER' && (
              <Button size="lg" className="text-lg px-8" asChild>
                <a href="/dashboard">Créer un événement</a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Fonctionnalités</h3>
            <p className="text-muted-foreground">
              Tout ce dont vous avez besoin pour gérer vos événements
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Gestion d'événements</h4>
              <p className="text-muted-foreground">
                Créez et gérez facilement vos événements avec un planning en temps réel
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Questions en direct</h4>
              <p className="text-muted-foreground">
                Interagissez avec votre audience grâce au système de Q&A en temps réel
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Sondages interactifs</h4>
              <p className="text-muted-foreground">
                Créez des sondages et visualisez les résultats en direct
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 PanelEvent. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}