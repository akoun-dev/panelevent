'use client'

import { Button } from '@/components/ui/button'
import { Trash, QrCode } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { QRCodeGenerator } from '@/components/QRCodeGenerator'
import EditEventDialog from '@/components/organizer/EditEventDialog'
import { DeleteEventModal } from '@/components/organizer/DeleteEventModal'
import { useState } from 'react'
import { Event } from '@prisma/client'

interface EventActionsProps {
  event: Event
  onRefresh: () => void
}

export function EventActions({ event, onRefresh }: EventActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <div className="flex space-x-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" title="Générer QR Code">
            <QrCode className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>QR Code d'inscription</DialogTitle>
            <DialogDescription>
              Scannez ce code pour accéder à la page d'inscription
            </DialogDescription>
          </DialogHeader>
          <QRCodeGenerator
            url={`${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL}/register/${event.id}`}
            eventName={event.title}
          />
        </DialogContent>
      </Dialog>
      <EditEventDialog event={event} onSuccess={onRefresh} />
      <Button
        variant="destructive"
        size="icon"
        onClick={() => setDeleteOpen(true)}
      >
        <Trash className="h-4 w-4" />
      </Button>
      <DeleteEventModal
        eventId={event.id}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={onRefresh}
      />
    </div>
  )
}