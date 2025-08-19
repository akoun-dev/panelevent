'use client'

import { Event } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/ui/data-table'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { EventActions } from '@/components/organizer/EventActions'

interface EventsTableProps {
  events: Event[]
  onRefresh: () => void
}


export function EventsTable({ events, onRefresh }: EventsTableProps) {
  const columnsWithRefresh: ColumnDef<Event>[] = [
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
      cell: ({ row }) => <EventActions event={row.original} onRefresh={onRefresh} />,
    },
  ]

  return <DataTable columns={columnsWithRefresh} data={events} />
}