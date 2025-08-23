"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Mail,
  CheckCircle,
  Calendar,
  MapPin,
  Briefcase,
  Building
} from 'lucide-react'
import { format } from 'date-fns'
import { fr, enUS, pt, es, ar } from 'date-fns/locale'
import type { Database } from '@/types/supabase'
import { Language, translations, type Translations } from '@/lib/translations'

interface RegistrationFormProps {
  event: Database['public']['Tables']['events']['Row']
  onSubmit: (
    data: {
      firstName: string
      lastName: string
      email: string
      position: string
      company: string
      consent: boolean
    }
  ) => Promise<void>
  loading?: boolean
  isRegistered?: boolean
  error?: string | null
  selectedLanguage?: Language | null
}

export function RegistrationForm({ event, onSubmit, loading = false, isRegistered = false, error = null, selectedLanguage = null }: RegistrationFormProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [position, setPosition] = useState('')
  const [company, setCompany] = useState('')
  const [consent, setConsent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ firstName, lastName, email, position, company, consent })
  }

  const formatDate = (dateString: string) => {
    const locale = selectedLanguage === 'en' ? enUS :
                   selectedLanguage === 'pt' ? pt :
                   selectedLanguage === 'es' ? es :
                   selectedLanguage === 'ar' ? ar : fr
                   
    const formatPattern = selectedLanguage === 'en' ? 'MMM dd, yyyy \'at\' HH:mm' :
                          selectedLanguage === 'pt' ? 'dd MMM yyyy \'às\' HH:mm' :
                          selectedLanguage === 'es' ? 'dd MMM yyyy \'a las\' HH:mm' :
                          selectedLanguage === 'ar' ? 'dd MMM yyyy \'في\' HH:mm' :
                          'dd MMM yyyy \'à\' HH:mm'
    
    return format(new Date(dateString), formatPattern, { locale })
  }

  // Fonction utilitaire pour obtenir les traductions
  const getTranslation = (key: keyof Translations['registration']): string => {
    if (!selectedLanguage) {
      // Valeurs par défaut en français
      const defaults: Record<keyof Translations['registration'], string> = {
        title: 'Inscription',
        subtitle: 'Inscrivez-vous pour participer à l\'événement',
        alreadyRegistered: 'Déjà inscrit',
        alreadyRegisteredDesc: 'Vous êtes déjà inscrit à cet événement',
        accessProgram: 'Accéder au programme de l\'événement',
        inactiveEvent: 'Événement inactif',
        inactiveEventDesc: 'Cet événement n\'est pas encore actif pour les inscriptions',
        inactive: 'Inactif',
        registered: 'Inscrit',
        firstName: 'Prénom *',
        firstNamePlaceholder: 'Jean',
        lastName: 'Nom *',
        lastNamePlaceholder: 'Dupont',
        email: 'Email *',
        emailPlaceholder: 'votre@email.com',
        position: 'Fonction *',
        positionPlaceholder: 'Directeur',
        company: 'Structure *',
        companyPlaceholder: 'Entreprise',
        consentLabel: 'J\'accepte de recevoir des communications concernant cet événement *',
        consentHint: 'Vous pouvez vous désinscrire à tout moment',
        registerButton: 'S\'inscrire à l\'événement',
        registering: 'Inscription...'
      }
      return defaults[key]
    }
    return translations[selectedLanguage].registration[key]
  }

  if (isRegistered) {
    return (
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            {getTranslation('alreadyRegistered')}
          </CardTitle>
          <CardDescription>
            {getTranslation('alreadyRegisteredDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{formatDate(event.startDate)}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{event.location}</span>
              </div>
            )}
            <Badge variant="secondary" className="w-fit">
              Inscrit
            </Badge>
          </div>
          <Button asChild className="w-full">
            <a href="/program">
              {getTranslation('accessProgram')}
            </a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!event.isActive) {
    return (
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            {getTranslation('inactiveEvent')}
          </CardTitle>
          <CardDescription>
            {getTranslation('inactiveEventDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{formatDate(event.startDate)}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{event.location}</span>
              </div>
            )}
            <Badge variant="outline" className="w-fit">
              {getTranslation('inactive')}
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          {getTranslation('title')}
        </CardTitle>
        <CardDescription>
          {getTranslation('subtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="font-semibold">{event.title}</h3>
            {event.description && (
              <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
            )}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{formatDate(event.startDate)}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{getTranslation('firstName')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder={getTranslation('firstNamePlaceholder')}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{getTranslation('lastName')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder={getTranslation('lastNamePlaceholder')}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{getTranslation('email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={getTranslation('emailPlaceholder')}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">{getTranslation('position')}</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="position"
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  placeholder={getTranslation('positionPlaceholder')}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">{getTranslation('company')}</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="company"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder={getTranslation('companyPlaceholder')}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={checked => setConsent(checked as boolean)}
              required
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {getTranslation('consentLabel')}
              </Label>
              <p className="text-xs text-muted-foreground">
                {getTranslation('consentHint')}
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}
          
          <Button
            type="submit"
            disabled={
              loading ||
              !email ||
              !firstName ||
              !lastName ||
              !position ||
              !company ||
              !consent
            }
            className="w-full"
          >
            {loading ? getTranslation('registering') : getTranslation('registerButton')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}