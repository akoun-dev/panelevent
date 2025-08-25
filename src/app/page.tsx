"use client"

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Users, Clock, User, LogOut, QrCode } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import QRCodeComponent from '@/components/qr-code'

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

  const [currentEvent, setCurrentEvent] = useState<any>(null)
  const [eventType, setEventType] = useState<'current' | 'next' | 'none'>('none')
  const [loadingEvent, setLoadingEvent] = useState(true)

  useEffect(() => {
    const fetchCurrentEvent = async () => {
      try {
        setLoadingEvent(true)
        const response = await fetch('/api/events/current')
        if (response.ok) {
          const data = await response.json()
          setCurrentEvent(data.event)
          setEventType(data.type)
        }
      } catch (error) {
        console.error('Error fetching current event:', error)
      } finally {
        setLoadingEvent(false)
      }
    }

    fetchCurrentEvent()
  }, [])

  const handleSignOut = async () => {
    try {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fern-frond"></div>
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
              <div className="w-8 h-8 bg-fern-frond rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
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

      {/* Hero Section with New Design */}
      <section className="relative bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-700 text-white py-20 overflow-hidden">
        {/* Cercle décoratif */}
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-emerald-600/30 blur-3xl" aria-hidden />

        <div className="relative z-10 container mx-auto px-4 lg:flex lg:items-center lg:gap-16">
          {/* Texte */}
          <div className="flex-1">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl animate-fade-in-up">
              Bienvenue sur <span className="text-emerald-300">PanelEvent</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-7 text-emerald-100 animate-fade-in-up delay-100">
              La solution moderne pour gérer vos événements, participants et attestations en toute simplicité.
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: "Événements créés", value: "50+", delay: "delay-200" },
                { label: "Participants", value: "1000+", delay: "delay-300" },
                { label: "Satisfaction", value: "99%", delay: "delay-400" },
                { label: "Support", value: "24/7", delay: "delay-500" },
              ].map((s, index) => (
                <div
                  key={s.label}
                  className={`rounded-xl bg-emerald-800/40 p-4 text-center shadow-inner animate-fade-in-up ${s.delay}`}
                >
                  <div className="text-sm text-emerald-200">{s.label}</div>
                  <div className="mt-1 text-2xl font-bold">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* QR Card */}
          {!loadingEvent && currentEvent && (
            <div className="mt-12 lg:mt-0 lg:flex-1 animate-slide-in-right">
              <div className="rounded-2xl bg-white p-6 text-center shadow-2xl max-w-sm mx-auto">
                <h3 className="text-lg font-semibold text-emerald-900 mb-2">{currentEvent.title}</h3>
                <p className="text-sm text-emerald-700 mb-2">
                 {formatDate(currentEvent.startDate)}
                  {currentEvent.endDate && ` - ${formatDate(currentEvent.endDate)}`}
                </p>
                {currentEvent.location && (
                  <p className="text-sm text-emerald-700 mb-4">{currentEvent.location}</p>
                )}

                <div className="flex justify-center mb-4">
                  <QRCodeComponent
                    eventId={currentEvent.id}
                    size={240}
                    className="border-4 border-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300"
                  />
                </div>


                <p className="mt-3 text-xs text-emerald-700 break-all">
                  {window.location.origin}/event/{currentEvent.id}
                </p>
              </div>
            </div>
          )}

          {/* No Event State */}
          {!loadingEvent && !currentEvent && (
            <div className="mt-12 lg:mt-0 lg:flex-1">
              <div className="rounded-2xl bg-white p-6 text-center shadow-2xl max-w-sm mx-auto">
                <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl p-8">
                  <Calendar className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                    Aucun événement programmé
                  </h3>
                  <p className="text-sm text-emerald-700">
                    Revenez plus tard pour découvrir nos prochains événements
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Loading State */}
      {loadingEvent && (
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <div className="animate-pulse bg-muted rounded-2xl p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-fern-frond/20 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-fern-frond/20 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-fern-frond/20 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-fern-frond/5 to-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2 animate-fade-in-up delay-100">
              <div className="text-3xl md:text-4xl font-bold text-fern-frond">50+</div>
              <div className="text-sm text-muted-foreground font-medium">Événements créés</div>
            </div>
            <div className="space-y-2 animate-fade-in-up delay-200">
              <div className="text-3xl md:text-4xl font-bold text-fern-frond">1000+</div>
              <div className="text-sm text-muted-foreground font-medium">Participants</div>
            </div>
            <div className="space-y-2 animate-fade-in-up delay-300">
              <div className="text-3xl md:text-4xl font-bold text-fern-frond">99%</div>
              <div className="text-sm text-muted-foreground font-medium">Satisfaction</div>
            </div>
            <div className="space-y-2 animate-fade-in-up delay-400">
              <div className="text-3xl md:text-4xl font-bold text-fern-frond">24/7</div>
              <div className="text-sm text-muted-foreground font-medium">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Fonctionnalités Premium</h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Découvrez toutes les fonctionnalités qui font de PanelEvent la solution ultime pour vos événements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow animate-fade-in-up delay-100">
              <div className="w-14 h-14 bg-fern-frond/10 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-7 h-7 text-fern-frond" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Gestion Complète</h4>
              <p className="text-muted-foreground">
                Créez, planifiez et gérez vos événements avec un interface intuitive et des outils puissants
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow animate-fade-in-up delay-200">
              <div className="w-14 h-14 bg-fern-frond/10 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-fern-frond" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Engagement Participatif</h4>
              <p className="text-muted-foreground">
                Questions en direct, sondages interactifs et système de votes pour une audience engagée
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow animate-fade-in-up delay-300">
              <div className="w-14 h-14 bg-fern-frond/10 rounded-xl flex items-center justify-center mb-4">
                <QrCode className="w-7 h-7 text-fern-frond" />
              </div>
              <h4 className="text-xl font-semibold mb-3">QR Codes Intelligents</h4>
              <p className="text-muted-foreground">
                Génération automatique de QR codes avec intégration du logo et téléchargement instantané
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow animate-fade-in-up delay-400">
              <div className="w-14 h-14 bg-fern-frond/10 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-7 h-7 text-fern-frond" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Temps Réel</h4>
              <p className="text-muted-foreground">
                Mises à jour en temps réel, notifications push et synchronisation multi-appareils
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow animate-fade-in-up delay-500">
              <div className="w-14 h-14 bg-fern-frond/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-fern-frond" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">Sécurité Avancée</h4>
              <p className="text-muted-foreground">
                Données chiffrées, authentification sécurisée et conformité RGPD garanties
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow animate-fade-in-up delay-600">
              <div className="w-14 h-14 bg-fern-frond/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-fern-frond" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">Analytics Complets</h4>
              <p className="text-muted-foreground">
                Tableaux de bord détaillés, statistiques d'engagement et rapports personnalisables
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-fern-frond to-fern-frond/80 animate-fade-in">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-emerald-800/40 mb-6">
            Prêt à révolutionner vos événements ?
          </h3>
          <p className="text-xl  text-emerald-800/40 mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines d'organisateurs qui font confiance à PanelEvent pour des événements mémorables
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-fern-frond rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <span className="text-lg font-bold">PanelEvent</span>
              </div>
              <p className="text-muted-foreground text-sm">
                La plateforme tout-en-un pour des événements exceptionnels et des expériences engageantes.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-fern-frond transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-fern-frond transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-fern-frond transition-colors">Cas d'usage</a></li>
                <li><a href="#" className="hover:text-fern-frond transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Ressources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-fern-frond transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-fern-frond transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-fern-frond transition-colors">Tutoriels</a></li>
                <li><a href="#" className="hover:text-fern-frond transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-fern-frond transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-fern-frond transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-fern-frond transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-fern-frond transition-colors">Mentions légales</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              © 2025 PanelEvent. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-fern-frond transition-colors text-sm">Confidentialité</a>
              <a href="#" className="text-muted-foreground hover:text-fern-frond transition-colors text-sm">Conditions</a>
              <a href="#" className="text-muted-foreground hover:text-fern-frond transition-colors text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
