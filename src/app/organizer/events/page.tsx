'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import CreateEventDialog from '@/components/organizer/CreateEventDialog'
import { EventsTable } from '@/components/organizer/EventsTable'
import type { Database } from '@/types/supabase'

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState<Database['public']['Tables']['events']['Row'][]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const fetchEvents = async () => {
    const response = await fetch('/api/organizer/events')
    const data = await response.json()
    setEvents(data)
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false)
    fetchEvents()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes Événements</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Créer un événement
        </Button>
      </div>

      <EventsTable events={events} onRefresh={fetchEvents} />

      <CreateEventDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  )
}