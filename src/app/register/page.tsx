"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Mail, Phone, Building, Briefcase, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    experience: '',
    expectations: '',
    dietaryRestrictions: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // ID de l'événement (dans un cas réel, ce serait dynamique)
      const eventId = 'event-2024'
      
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          ...formData
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription')
      }

      // Stocker uniquement l'identifiant d'inscription dans le localStorage
      localStorage.setItem('registrationId', data.registrationId)
      
      setIsSubmitting(false)
      setIsSubmitted(true)
      
      // Rediriger vers la page du programme après 2 secondes
      setTimeout(() => {
        window.location.href = '/program'
      }, 2000)
      
    } catch (error) {
      console.error('Erreur:', error)
      setIsSubmitting(false)
      alert(error instanceof Error ? error.message : 'Une erreur est survenue')
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle>Inscription réussie !</CardTitle>
            <CardDescription>
              Vous allez être redirigé vers le programme de l'événement...
            </CardDescription>
          </CardHeader>
        </Card>
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
              <h1 className="text-2xl font-bold">Inscription à l'événement</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Form Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Inscrivez-vous à l'<span className="text-primary">Événement 2024</span>
            </h2>
            <p className="text-muted-foreground">
              Remplissez le formulaire ci-dessous pour vous inscrire et accéder au programme complet
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Veuillez fournir vos coordonnées pour compléter votre inscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom et Prénom */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Jean"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Dupont"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email et Téléphone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="jean.dupont@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Entreprise et Poste */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Entreprise</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="company"
                        type="text"
                        placeholder="Nom de l'entreprise"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Poste</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="position"
                        type="text"
                        placeholder="Votre poste"
                        value={formData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Expérience */}
                <div className="space-y-2">
                  <Label htmlFor="experience">Niveau d'expérience</Label>
                  <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre niveau d'expérience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Débutant</SelectItem>
                      <SelectItem value="intermediate">Intermédiaire</SelectItem>
                      <SelectItem value="advanced">Avancé</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Attentes */}
                <div className="space-y-2">
                  <Label htmlFor="expectations">Qu'attendez-vous de cet événement ?</Label>
                  <Textarea
                    id="expectations"
                    placeholder="Décrivez vos attentes et objectifs pour cet événement..."
                    value={formData.expectations}
                    onChange={(e) => handleInputChange('expectations', e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Restrictions alimentaires */}
                <div className="space-y-2">
                  <Label htmlFor="dietaryRestrictions">Restrictions alimentaires</Label>
                  <Textarea
                    id="dietaryRestrictions"
                    placeholder="Veuillez indiquer vos restrictions alimentaires (allergies, régime, etc.)"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                    rows={2}
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Inscription en cours...' : "S'inscrire à l'événement"}
                </Button>
              </form>
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