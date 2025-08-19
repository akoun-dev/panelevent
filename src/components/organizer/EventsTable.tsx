'use client'

import { Event } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Edit, Trash } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import EditEventDialog from '@/components/organizer/EditEventDialog'

interface EventsTableProps {
  events: Event[]
  onRefresh: () => void
}

const columns: ColumnDef<Event>[] = [
  {
    accessorKey: 'title',
    header: 'Titre',
  },
  {
    accessorKey: 'startDate',
    header: 'Date de début',
    cell: ({ row }) => format(new Date(row.getValue('startDate')), 'PPp', { locale: fr }),
  },
  {
    accessorKey: 'location',
    header: 'Lieu',
  },
  {
    accessorKey: 'isPublic',
    header: 'Public',
    cell: ({ row }) => (row.getValue('isPublic') ? 'Oui' : 'Non'),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const event = row.original
      function onRefresh() {
        throw new Error('Function not implemented.')
      }

      return (
        <div className="flex space-x-2">
          <EditEventDialog event={event} onSuccess={() => {}} />
          <Button
            variant="destructive"
            size="icon"
            onClick={async () => {
              if (confirm('Voulez-vous vraiment supprimer cet événement ?')) {
                try {
                  await fetch(`/api/organizer/events/${event.id}`, {
                    method: 'DELETE',
                  })
                  toast({
                    title: "Événement supprimé",
                    description: "L'événement a été supprimé avec succès"
                  })
                  onRefresh()
                } catch (error) {
                  toast({
                    title: "Erreur",
                    description: "Une erreur est survenue lors de la suppression",
                    variant: "destructive"
                  })
                }
              }
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]

export function EventsTable({ events, onRefresh }: EventsTableProps) {
  return <DataTable columns={columns} data={events} />
}