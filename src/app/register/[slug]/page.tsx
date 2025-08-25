"use client"

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { RegistrationForm } from '@/components/shared/registration-form'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { LanguageSelector } from '@/components/shared/LanguageSelector'
import { Language, translations } from '@/lib/translations'

import type { Database } from '@/types/supabase'

type Event = Database['public']['Tables']['events']['Row'] & {
  branding?: { qrCode?: string } | null
  registeredCount?: number
}

export default function RegisterPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConsent, setShowConsent] = useState(false)
  const [consentAccepted, setConsentAccepted] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [showLanguageSelector, setShowLanguageSelector] = useState(true)


  const fetchEvent = useCallback(async () => {
    try {
      const response = await fetch(`/api/events/by-slug/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Failed to fetch event:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }, [slug, router])

  const handleRegistration = async (
    data: {
      firstName: string
      lastName: string
      email: string
      position: string
      company: string
      consent: boolean
    }
  ) => {
    setRegistering(true)
    setError(null)
    try {
      if (!event?.id) return
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventId: event.id,
          ...data,
          language: selectedLanguage // Ajouter la langue sélectionnée
        })
      })

      if (response.ok) {
        const result = await response.json()
        setIsRegistered(true)
        
        // Stocker l'ID d'inscription dans localStorage pour la page programme
        if (result.registrationId) {
          localStorage.setItem('registrationId', result.registrationId)
        }
        
        console.log('Registration successful, redirecting to /program')
        // Stocker la langue sélectionnée dans localStorage pour la page programme
        if (selectedLanguage) {
          localStorage.setItem('selectedLanguage', selectedLanguage)
          console.log('Langue stockée dans localStorage:', selectedLanguage)
        } else {
          console.log('Aucune langue sélectionnée à stocker')
        }
        router.push('/program')
      } else {
        // Gérer les erreurs spécifiques
        const errorData = await response.json()
        if (response.status === 409 && errorData.error?.includes('déjà inscrit')) {
          // L'utilisateur est déjà inscrit, on affiche le message approprié
          setIsRegistered(true)
          // Vérifier si l'utilisateur a déjà une inscription enregistrée
          const checkResponse = await fetch(`/api/events/${event.id}/registrations/check?email=${encodeURIComponent(data.email)}`)
          if (checkResponse.ok) {
            const checkData = await checkResponse.json()
            if (checkData.registrationId) {
              localStorage.setItem('registrationId', checkData.registrationId)
            }
          }
          // Stocker la langue sélectionnée dans localStorage pour la page programme
          if (selectedLanguage) {
            localStorage.setItem('selectedLanguage', selectedLanguage)
            console.log('Langue stockée dans localStorage (utilisateur déjà inscrit):', selectedLanguage)
          } else {
            console.log('Aucune langue sélectionnée à stocker (utilisateur déjà inscrit)')
          }
        } else {
          // Afficher un message d'erreur spécifique
          setError(errorData.error || 'Une erreur est survenue lors de l\'inscription')
        }
      }
    } catch (error) {
      console.error('Failed to register:', error)
      setError('Une erreur est survenue lors de l\'inscription')
    } finally {
      setRegistering(false)
    }
  }

  useEffect(() => {
    fetchEvent()
  }, [fetchEvent])


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-fern-frond/5 to-luxor-gold/10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fern-frond"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-fern-frond/5 to-luxor-gold/10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-fern-frond">Événement non trouvé</h1>
          <Button asChild className="bg-fern-frond hover:bg-fern-frond/90 text-white">
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Sélecteur de langue
  if (showLanguageSelector) {
    return (
      <LanguageSelector
        onLanguageSelect={(language) => {
          setSelectedLanguage(language)
          setShowLanguageSelector(false)
        }}
      />
    )
  }

  // Page de consentement RGPD
  if (!showConsent && selectedLanguage) {
    const t = translations[selectedLanguage].consent
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-fern-frond/5 to-luxor-gold/10 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-fern-frond">{t.title}</h1>
            <p className="text-muted-foreground mt-2">
              {t.subtitle}
            </p>
          </div>

          <div className="bg-white border border-fern-frond/20 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-fern-frond">{t.policyTitle}</h2>

            <div className="space-y-4 text-sm text-fern-frond">
              <p>{t.dataCollection}</p>
              <p>{t.dataUsage}</p>
              <p>{t.dataStorage}</p>

              <h3 className="font-semibold text-fern-frond">{t.detailsTitle}</h3>

              <p>
                <strong className="text-fern-frond">{selectedLanguage === 'fr' ? 'Collecte des Données' :
                         selectedLanguage === 'en' ? 'Data Collection' :
                         selectedLanguage === 'pt' ? 'Coleta de Dados' :
                         selectedLanguage === 'es' ? 'Recopilación de Datos' :
                         'جمع البيانات'}</strong><br />
                {t.collectionDetails}
              </p>

              <p>
                <strong className="text-fern-frond">{selectedLanguage === 'fr' ? 'Utilisation des Données' :
                         selectedLanguage === 'en' ? 'Data Usage' :
                         selectedLanguage === 'pt' ? 'Uso de Dados' :
                         selectedLanguage === 'es' ? 'Uso de Datos' :
                         'استخدام البيانات'}</strong><br />
                {t.usageDetails}
              </p>

              <p>
                <strong className="text-fern-frond">{selectedLanguage === 'fr' ? 'Conservation et Sécurité' :
                         selectedLanguage === 'en' ? 'Storage and Security' :
                         selectedLanguage === 'pt' ? 'Armazenamento e Segurança' :
                         selectedLanguage === 'es' ? 'Almacenamiento y Seguridad' :
                         'التخزين والأمان'}</strong><br />
                {t.securityDetails}
              </p>

              <p>
                <strong className="text-fern-frond">{selectedLanguage === 'fr' ? 'Vos Droits' :
                         selectedLanguage === 'en' ? 'Your Rights' :
                         selectedLanguage === 'pt' ? 'Seus Direitos' :
                         selectedLanguage === 'es' ? 'Sus Derechos' :
                         'حقوقك'}</strong><br />
                {t.rightsDetails}
              </p>

              <p>
                <strong className="text-fern-frond">{selectedLanguage === 'fr' ? 'Transferts de Données' :
                         selectedLanguage === 'en' ? 'Data Transfers' :
                         selectedLanguage === 'pt' ? 'Transferências de Dados' :
                         selectedLanguage === 'es' ? 'Transferencias de Datos' :
                         'نقل البيانات'}</strong><br />
                {t.transferDetails}
              </p>

              <p>
                <strong className="text-fern-frond">{selectedLanguage === 'fr' ? 'Retrait du Consentement' :
                         selectedLanguage === 'en' ? 'Withdrawal of Consent' :
                         selectedLanguage === 'pt' ? 'Retirada do Consentimento' :
                         selectedLanguage === 'es' ? 'Retiro del Consentimiento' :
                         'سحب الموافقة'}</strong><br />
                {t.withdrawalDetails}
              </p>

              <p className="text-xs text-muted-foreground">
                {t.lastUpdated} {new Date().toLocaleDateString(selectedLanguage === 'fr' ? 'fr-FR' :
                                 selectedLanguage === 'en' ? 'en-US' :
                                 selectedLanguage === 'pt' ? 'pt-PT' :
                                 selectedLanguage === 'es' ? 'es-ES' :
                                 'ar-SA')}
              </p>
            </div>

          </div>
          <div className="flex items-start space-x-2 mb-6">
            <Checkbox
              id="rgpd-consent"
              checked={consentAccepted}
              onCheckedChange={checked => setConsentAccepted(checked as boolean)}
              required
              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="rgpd-consent"
                className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {t.acceptLabel}
              </Label>
              <p className="text-xs text-muted-foreground leading-none">
                {t.acceptHint}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowLanguageSelector(true)}
              className="flex-1 border-border text-foreground hover:bg-secondary/20"
            >
              ← {selectedLanguage === 'fr' ? 'Changer de langue' :
                 selectedLanguage === 'en' ? 'Change language' :
                 selectedLanguage === 'pt' ? 'Mudar idioma' :
                 selectedLanguage === 'es' ? 'Cambiar idioma' :
                 'تغيير اللغة'}
            </Button>
            <Button
              onClick={() => setShowConsent(true)}
              disabled={!consentAccepted}
              className="flex-1 border-border text-amber-400 "
            >
              {t.continueButton}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fern-frond/5 to-luxor-gold/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header simple */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-fern-frond">
            {selectedLanguage ? translations[selectedLanguage].registration.title : 'Inscription'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {selectedLanguage ? translations[selectedLanguage].registration.subtitle : 'Inscrivez-vous pour participer à l\'événement'}
          </p>
        </div>

        {/* Formulaire d'inscription */}
        <RegistrationForm
          event={event}
          onSubmit={handleRegistration}
          loading={registering}
          isRegistered={isRegistered}
          error={error}
          selectedLanguage={selectedLanguage}
        />
      </div>
    </div>
  )
}