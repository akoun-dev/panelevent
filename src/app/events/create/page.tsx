"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { EventForm } from '@/components/shared/event-form'

export default function CreateEvent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated' && session.user?.role !== 'ORGANIZER' && session.user?.role !== 'ADMIN') {
      router.push('/')
      return
    }
  }, [status, session, router])

  const handleSubmit = async (formData: any, slug: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          slug,
          organizerId: session.user?.id
        })
      })

      if (response.ok) {
        router.push('/dashboard/events')
      } else {
        const error = await response.json()
        console.error('Failed to create event:', error.error)
        alert(error.error || 'Erreur lors de la création de l\'événement')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Erreur lors de la création de l\'événement')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard')
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session || (session.user?.role !== 'ORGANIZER' && session.user?.role !== 'ADMIN')) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Créer un événement</h1>
            <p className="text-muted-foreground">
              Remplissez les informations pour créer votre événement
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <EventForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        submitText="Créer l'événement"
        showSlug={true}
      />
    </div>
  )
}