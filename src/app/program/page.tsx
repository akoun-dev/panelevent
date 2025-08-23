"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, User, Coffee, Network, Trophy, ArrowLeft, LogOut } from 'lucide-react'
import Link from 'next/link'

interface ProgramItem {
  id: string
  time: string
  title: string
  description?: string
  speaker?: string
  location?: string
  // Le champ 'type' n'est pas stocké en base, on le déduit du contenu
  type?: 'conference' | 'workshop' | 'networking' | 'break' | 'ceremony'
}

interface RegistrationData {
  firstName: string
  lastName: string
  email: string
  registeredAt: string
  eventId: string
  eventTitle: string
  company?: string
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
          eventId: data.registration.event.id,
          eventTitle: data.registration.event.title
        })

        // Récupérer le programme de l'événement si disponible
        if (data.registration.event?.program) {
          try {
            const programData = JSON.parse(data.registration.event.program)
            // Le programme est stocké comme {hasProgram: boolean, programItems: [...]}
            if (programData && programData.hasProgram && Array.isArray(programData.programItems)) {
              setProgramItems(programData.programItems)
            }
          } catch (e) {
            console.error('Erreur lors du parsing du programme:', e)
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'inscription:', error)
        // Rediriger vers la page d'inscription en cas de problème
        window.location.href = '/'
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

  const getItemType = (item: ProgramItem): ProgramItem['type'] => {
    const title = item.title.toLowerCase()
    const description = item.description?.toLowerCase() || ''
    
    if (title.includes('conférence') || title.includes('présentation') ||
        description.includes('conférence') || description.includes('présentation')) {
      return 'conference'
    }
    if (title.includes('atelier') || title.includes('workshop') ||
        description.includes('atelier') || description.includes('workshop')) {
      return 'workshop'
    }
    if (title.includes('pause') || title.includes('café') || title.includes('déjeuner') ||
        description.includes('pause') || description.includes('café') || description.includes('déjeuner')) {
      return 'break'
    }
    if (title.includes('réseautage') || title.includes('networking') ||
        description.includes('réseautage') || description.includes('networking')) {
      return 'networking'
    }
    if (title.includes('cérémonie') || title.includes('clôture') || title.includes('ouverture') ||
        description.includes('cérémonie') || description.includes('clôture') || description.includes('ouverture')) {
      return 'ceremony'
    }
    
    return 'conference' // Par défaut
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
      {/* Hero Section */}
      <section className="py-8 px-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
           <span className="text-primary">{registration.eventTitle}</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            Bienvenue {registration.firstName} ! Voici le programme complet de la journée
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}</span>
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
            {programItems.map((item, index) => (
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
                        
                        <Badge className={`ml-4 ${getTypeColor(getItemType(item))}`}>
                          <div className="flex items-center space-x-1">
                            {getTypeIcon(getItemType(item))}
                            <span>{getTypeLabel(getItemType(item))}</span>
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