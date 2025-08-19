"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, FileText, List, Clock } from 'lucide-react'
import Link from 'next/link'
import { ProgramForm } from '@/components/shared/program-form'

interface ProgramData {
  hasProgram: boolean
  programText?: string
  programItems?: Array<{
    id: string
    time: string
    title: string
    description?: string
    speaker?: string
    location?: string
  }>
}

interface Event {
  id: string
  title: string
  description?: string
  program?: string
}

export default function AdminEventProgramPage() {
  const params = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [programData, setProgramData] = useState<ProgramData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchEventAndProgram = async () => {
      try {
        // Fetch event details
        const eventResponse = await fetch(`/api/admin/events/${params.id}`)
        if (eventResponse.ok) {
          const eventData = await eventResponse.json()
          setEvent(eventData.event)
        }

        // Fetch program data
        const programResponse = await fetch(`/api/events/${params.id}/program`)
        if (programResponse.ok) {
          const programData = await programResponse.json()
          setProgramData(programData.program)
        }
      } catch (error) {
        console.error('Failed to fetch event and program:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEventAndProgram()
  }, [params.id])

  const handleSaveProgram = async (data: ProgramData) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/events/${params.id}/program`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        setProgramData(data)
      } else {
        console.error('Failed to save program')
      }
    } catch (error) {
      console.error('Error saving program:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Événement non trouvé</h1>
          <Button asChild>
            <Link href="/admin/events">Retour aux événements</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/events/${params.id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Programme de l'événement</h1>
            <p className="text-muted-foreground">
              Gérez le programme de "{event.title}"
            </p>
          </div>
        </div>
      </div>

      {/* Event Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Informations de l'événement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">{event.title}</h3>
              {event.description && (
                <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
              )}
            </div>
            <div className="space-y-2">
              {programData?.hasProgram && (
                <div className="flex items-center gap-2">
                  <Badge variant="default">
                    <List className="w-3 h-3 mr-1" />
                    Programme activé
                  </Badge>
                  {programData.programItems && programData.programItems.length > 0 && (
                    <Badge variant="secondary">
                      <Clock className="w-3 h-3 mr-1" />
                      {programData.programItems.length} activité{programData.programItems.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Program Form */}
      <ProgramForm
        initialData={programData || undefined}
        onSave={handleSaveProgram}
        loading={saving}
      />
    </div>
  )
}