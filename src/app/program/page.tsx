"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, User, Coffee, Network, Trophy, ArrowLeft, LogOut } from 'lucide-react'
import Link from 'next/link'

interface ProgramItem {
  time: string
  title: string
  description: string
  speaker?: string
  location: string
  type: 'conference' | 'workshop' | 'networking' | 'break' | 'ceremony'
}

interface RegistrationData {
  firstName: string
  lastName: string
  email: string
  registeredAt: string
  eventId: string
}

export default function ProgramPage() {
  const [registration, setRegistration] = useState<RegistrationData | null>(null)
  const [currentTime, setCurrentTime] = useState('')
  const [programItems, setProgramItems] = useState<ProgramItem[]>([])

  useEffect(() => {
    const registrationId = localStorage.getItem('registrationId')
    if (!registrationId) {
      // Rediriger vers la page d'accueil si non inscrit
      window.location.href = '/'
      return
    }

    const fetchRegistration = async () => {
      try {
        const response = await fetch(`/api/registrations/${registrationId}`)
        if (!response.ok) {
          throw new Error('Inscription non trouvée')
        }
        const data = await response.json()

        setRegistration({
          firstName: data.registration.firstName,
          lastName: data.registration.lastName,
          email: data.registration.email,
          registeredAt: data.registration.registeredAt,
          eventId: data.registration.event.id
        })

        // Récupérer le programme de l'événement si disponible
        if (data.registration.event?.program) {
          try {
            const programData = JSON.parse(data.registration.event.program)
            if (Array.isArray(programData)) {
              setProgramItems(programData)
            }
          } catch (e) {
            console.error('Erreur lors du parsing du programme:', e)
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'inscription:', error)
        // Rediriger vers la page d'inscription en cas de problème
        window.location.href = '/register'
      }
    }

    fetchRegistration()

    // Mettre à jour l'heure actuelle
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }))
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('registrationId')
    window.location.href = '/'
  }

  const programData: ProgramItem[] = [
    {
      time: '08:30',
      title: 'Accueil et café',
      description: 'Bienvenue ! Prenez votre café et faites des connaissances avant le début des conférences.',
      location: 'Hall d\'entrée',
      type: 'break'
    },
    {
      time: '09:00',
      title: 'Ouverture officielle',
      description: 'Discours d\'ouverture et présentation du programme de la journée.',
      speaker: 'Marie Dubois - Directrice',
      location: 'Amphithéâtre principal',
      type: 'ceremony'
    },
    {
      time: '09:30',
      title: 'L\'avenir de l\'intelligence artificielle',
      description: 'Découvrez les dernières avancées en IA et leur impact sur notre quotidien.',
      speaker: 'Dr. Jean Martin - Expert IA',
      location: 'Amphithéâtre principal',
      type: 'conference'
    },
    {
      time: '10:30',
      title: 'Atelier : Introduction au Machine Learning',
      description: 'Atelier pratique pour comprendre les bases du Machine Learning.',
      speaker: 'Sophie Bernard - Data Scientist',
      location: 'Salle A',
      type: 'workshop'
    },
    {
      time: '10:30',
      title: 'Panel : Transformation digitale',
      description: 'Discussion sur les défis et opportunités de la transformation digitale.',
      speaker: 'Plusieurs intervenants',
      location: 'Salle B',
      type: 'conference'
    },
    {
      time: '11:30',
      title: 'Pause café et networking',
      description: 'Moment d\'échange et de networking entre les participants.',
      location: 'Espace détente',
      type: 'networking'
    },
    {
      time: '12:00',
      title: 'Déjeuner',
      description: 'Buffet déjeuner et continuation des échanges informels.',
      location: 'Restaurant',
      type: 'break'
    },
    {
      time: '14:00',
      title: 'Cybersécurité : Enjeux actuels',
      description: 'Comprendre les menaces actuelles et comment s\'en protéger.',
      speaker: 'Pierre Durand - Expert Cybersécurité',
      location: 'Amphithéâtre principal',
      type: 'conference'
    },
    {
      time: '15:00',
      title: 'Atelier : Sécurité des applications web',
      description: 'Apprenez à sécuriser vos applications web contre les attaques courantes.',
      speaker: 'Claire Lefebvre - Développeuse Senior',
      location: 'Salle A',
      type: 'workshop'
    },
    {
      time: '16:00',
      title: 'Pause café',
      description: 'Petite pause pour recharger les batteries.',
      location: 'Espace détente',
      type: 'break'
    },
    {
      time: '16:30',
      title: 'Table ronde : L\'avenir du travail',
      description: 'Discussion sur le futur du travail à l\'ère du numérique.',
      speaker: 'Plusieurs experts',
      location: 'Amphithéâtre principal',
      type: 'conference'
    },
    {
      time: '17:30',
      title: 'Cérémonie de clôture et remise des prix',
      description: 'Clôture de l\'événement et remise des prix aux meilleurs projets.',
      speaker: 'Organisateurs',
      location: 'Amphithéâtre principal',
      type: 'ceremony'
    }
  ]

  const getTypeIcon = (type: ProgramItem['type']) => {
    switch (type) {
      case 'conference':
        return <User className="w-4 h-4" />
      case 'workshop':
        return <Network className="w-4 h-4" />
      case 'networking':
        return <Network className="w-4 h-4" />
      case 'break':
        return <Coffee className="w-4 h-4" />
      case 'ceremony':
        return <Trophy className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: ProgramItem['type']) => {
    switch (type) {
      case 'conference':
        return 'bg-blue-100 text-blue-800'
      case 'workshop':
        return 'bg-green-100 text-green-800'
      case 'networking':
        return 'bg-purple-100 text-purple-800'
      case 'break':
        return 'bg-orange-100 text-orange-800'
      case 'ceremony':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: ProgramItem['type']) => {
    switch (type) {
      case 'conference':
        return 'Conférence'
      case 'workshop':
        return 'Atelier'
      case 'networking':
        return 'Networking'
      case 'break':
        return 'Pause'
      case 'ceremony':
        return 'Cérémonie'
      default:
        return 'Autre'
    }
  }

  if (!registration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
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
              <Link href="/" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Retour</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">E</span>
              </div>
              <h1 className="text-2xl font-bold">Programme de l'événement</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">
                  {registration.firstName} {registration.lastName}
                </p>
                {registration.company && (
                  <p className="text-xs text-muted-foreground">
                    {registration.company}
                  </p>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-8 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Programme de l'<span className="text-primary">Événement 2024</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            Bienvenue {registration.firstName} ! Voici le programme complet de la journée
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>15 Décembre 2024</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Heure actuelle: {currentTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Program Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-4">
            {(programItems.length > 0 ? programItems : programData).map((item, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:space-x-4">
                    {/* Time */}
                    <div className="flex-shrink-0 mb-4 md:mb-0 md:w-24">
                      <div className="bg-primary/10 rounded-lg p-3 text-center">
                        <Clock className="w-6 h-6 mx-auto mb-1 text-primary" />
                        <p className="font-semibold text-primary">{item.time}</p>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                          <p className="text-muted-foreground mb-3">{item.description}</p>
                          
                          {item.speaker && (
                            <div className="flex items-center space-x-2 mb-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{item.speaker}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{item.location}</span>
                          </div>
                        </div>
                        
                        <Badge className={`ml-4 ${getTypeColor(item.type)}`}>
                          <div className="flex items-center space-x-1">
                            {getTypeIcon(item.type)}
                            <span>{getTypeLabel(item.type)}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-8 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Informations importantes</CardTitle>
              <CardDescription>
                Quelques informations pour profiter au mieux de l'événement
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Accessibilité</h4>
                <p className="text-sm text-muted-foreground">
                  L'ensemble des lieux est accessible aux personnes à mobilité réduite. 
                  N'hésitez pas à nous contacter pour toute demande spécifique.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Restauration</h4>
                <p className="text-sm text-muted-foreground">
                  Un buffet déjeuner sera servi à 12h00. 
                  Des options végétariennes et sans gluten sont disponibles.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Wi-Fi</h4>
                <p className="text-sm text-muted-foreground">
                  Réseau : Event_2024<br />
                  Mot de passe : Welcome2024
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Contact</h4>
                <p className="text-sm text-muted-foreground">
                  Pour toute question, notre équipe d'accueil est à votre disposition 
                  dans le hall d'entrée.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Événement. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}