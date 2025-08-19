'use client'

import type { Database } from '@/types/supabase'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import { useState } from 'react'
import EditEventForm from '@/components/organizer/EditEventForm'

export default function EditEventDialog({
  event,
  onSuccess,
}: {
  event: Database['public']['Tables']['events']['Row']
  onSuccess: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        <Edit className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Modifier l'événement</DialogTitle>
          </DialogHeader>
          <EditEventForm 
            event={event}
            onSuccess={() => {
              setIsOpen(false)
              onSuccess()
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}