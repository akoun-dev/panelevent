"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, User, Coffee, Network, Trophy, ArrowLeft, LogOut } from 'lucide-react'
import Link from 'next/link'
import { translations, Language } from '@/lib/translations'
import { getProgramForLanguage, getTranslatedField } from '@/lib/program-translations'

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
  const [language, setLanguage] = useState<Language>('fr')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Récupérer la langue depuis le localStorage (uniquement côté client)
    const savedLanguage = localStorage.getItem('selectedLanguage') as Language
    console.log('Langue récupérée depuis localStorage:', savedLanguage)
    console.log('Toutes les clés localStorage:', Object.keys(localStorage))
    
    if (savedLanguage && ['fr', 'en', 'pt', 'es', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
      console.log('Langue définie:', savedLanguage)
    } else {
      console.log('Aucune langue valide trouvée, utilisation du français par défaut')
      setLanguage('fr')
    }

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
            console.log('Données du programme récupérées:', programData)
            
            // Convertir le programme dans la langue sélectionnée
            const translatedProgram = getProgramForLanguage(programData, language)
            
            if (translatedProgram && translatedProgram.hasProgram && Array.isArray(translatedProgram.programItems)) {
              console.log('Programme valide trouvé, nombre d\'items:', translatedProgram.programItems.length)
              setProgramItems(translatedProgram.programItems)
            } else {
              console.log('Aucun programme valide trouvé ou programme vide')
            }
          } catch (e) {
            console.error('Erreur lors du parsing du programme:', e)
          }
        } else {
          console.log('Aucun programme trouvé dans l\'événement')
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
      setCurrentTime(now.toLocaleTimeString(language === 'ar' ? 'ar-SA' : `${language}-${language.toUpperCase()}`, {
        hour: '2-digit',
        minute: '2-digit'
      }))
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [language])

  // Forcer le re-rendu lorsque la langue change pour mettre à jour les traductions et le programme
  useEffect(() => {
    console.log('Langue changée, mise à jour des traductions:', language)
    
    // Recharger le programme avec la nouvelle langue
    const registrationId = localStorage.getItem('registrationId')
    if (registrationId && registration) {
      const fetchProgramWithLanguage = async () => {
        try {
          const response = await fetch(`/api/registrations/${registrationId}`)
          if (response.ok) {
            const data = await response.json()
            
            if (data.registration.event?.program) {
              try {
                const programData = JSON.parse(data.registration.event.program)
                const translatedProgram = getProgramForLanguage(programData, language)
                
                if (translatedProgram && translatedProgram.hasProgram && Array.isArray(translatedProgram.programItems)) {
                  console.log('Programme retraduit pour la langue:', language)
                  setProgramItems(translatedProgram.programItems)
                }
              } catch (e) {
                console.error('Erreur lors du parsing du programme:', e)
              }
            }
          }
        } catch (error) {
          console.error('Erreur lors de la récupération du programme traduit:', error)
        }
      }
      
      fetchProgramWithLanguage()
    }
  }, [language, registration])

  const handleLogout = () => {
    localStorage.removeItem('registrationId')
    localStorage.removeItem('selectedLanguage')
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
    const t = translations[language].program
    switch (type) {
      case 'conference':
        return t.conference
      case 'workshop':
        return t.workshop
      case 'networking':
        return t.networking
      case 'break':
        return t.break
      case 'ceremony':
        return t.ceremony
      default:
        return t.other
    }
  }

  const getItemType = (item: ProgramItem): ProgramItem['type'] => {
    const title = item.title.toLowerCase()
    const description = item.description?.toLowerCase() || ''
    
    // Récupérer les traductions pour toutes les langues
    const allTranslations = {
      conference: ['conférence', 'conference', 'présentation', 'presentation', 'keynote', 'talk'],
      workshop: ['atelier', 'workshop', 'session pratique', 'practical session'],
      break: ['pause', 'break', 'café', 'coffee', 'déjeuner', 'lunch', 'repas', 'meal', 'restaurant'],
      networking: ['réseautage', 'networking', 'rencontre', 'meeting', 'échanges', 'exchanges'],
      ceremony: ['cérémonie', 'ceremony', 'clôture', 'closing', 'ouverture', 'opening', 'inauguration']
    }
    
    // Vérifier chaque type avec les mots-clés dans toutes les langues
    for (const keyword of allTranslations.conference) {
      if (title.includes(keyword) || description.includes(keyword)) {
        return 'conference'
      }
    }
    for (const keyword of allTranslations.workshop) {
      if (title.includes(keyword) || description.includes(keyword)) {
        return 'workshop'
      }
    }
    for (const keyword of allTranslations.break) {
      if (title.includes(keyword) || description.includes(keyword)) {
        return 'break'
      }
    }
    for (const keyword of allTranslations.networking) {
      if (title.includes(keyword) || description.includes(keyword)) {
        return 'networking'
      }
    }
    for (const keyword of allTranslations.ceremony) {
      if (title.includes(keyword) || description.includes(keyword)) {
        return 'ceremony'
      }
    }
    
    return 'conference' // Par défaut
  }

  if (!isClient || !registration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fern-frond/5 to-luxor-gold/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fern-frond"></div>
      </div>
    )
  }

  const t = translations[language].program
  console.log('Langue actuelle:', language, 'Traductions:', t)

  return (
    <div className="min-h-screen bg-gradient-to-br from-fern-frond/5 to-luxor-gold/10">
      {/* Hero Section */}
      <section className="py-8 px-4 bg-gradient-to-r from-fern-frond/20 to-luxor-gold/20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
           <span className="text-fern-frond">{registration.eventTitle}</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-4">
            {t.welcome} {registration.firstName} ! {t.title}
          </p>
          
          
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : `${language}-${language.toUpperCase()}`, {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{t.currentTime}: {currentTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Program Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-4">
            {programItems.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-border bg-card">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:space-x-4">
                    {/* Time */}
                    <div className="flex-shrink-0 mb-4 md:mb-0 md:w-24">
                      <div className="bg-fern-frond/20 rounded-lg p-3 text-center border border-fern-frond/30">
                        <Clock className="w-6 h-6 mx-auto mb-1 text-fern-frond" />
                        <p className="font-semibold text-fern-frond">{item.time}</p>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
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
                        
                        <Badge className={`ml-4 border-border ${getTypeColor(getItemType(item))}`}>
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
      <footer className="border-t border-border py-8 px-4 bg-card/50">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            {t.copyright}
          </p>
        </div>
      </footer>
    </div>
  )
}