"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users, Download, FileText, FileSpreadsheet } from 'lucide-react'
import { toast } from 'sonner'

interface Registration {
  id: string
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  company?: string
  position?: string
  attended: boolean
  createdAt: string
}

interface Event {
  id: string
  title: string
  slug: string
}

export default function ParticipantsPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [eventId, setEventId] = useState<string>('')

  useEffect(() => {
    const fetchData = async (eventId: string) => {
      try {
        const [eventResponse, registrationsResponse] = await Promise.all([
          fetch(`/api/organizer/events/${eventId}`),
          fetch(`/api/organizer/events/${eventId}/registrations`)
        ])

        if (eventResponse.ok) {
          const eventData = await eventResponse.json()
          setEvent(eventData)
        }

        if (registrationsResponse.ok) {
          const registrationsData = await registrationsResponse.json()
          setRegistrations(registrationsData.registrations || [])
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast.error('Erreur lors du chargement des données')
      } finally {
        setLoading(false)
      }
    }

    const init = async () => {
      const { id } = await params
      setEventId(id)
      
      if (status === 'unauthenticated') {
        router.push('/auth/signin')
        return
      }

      if (status === 'authenticated' && session.user?.role !== 'ORGANIZER' && session.user?.role !== 'ADMIN') {
        router.push('/')
        return
      }

      fetchData(id)
    }

    init()
  }, [status, session, router, params])

  const exportToCSV = () => {
    const headers = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Entreprise', 'Poste', 'Inscrit le', 'Présent']
    const csvData = registrations.map(reg => [
      reg.lastName || '',
      reg.firstName || '',
      reg.email || '',
      reg.phone || '',
      reg.company || '',
      reg.position || '',
      new Date(reg.createdAt).toLocaleDateString('fr-FR'),
      reg.attended ? 'Oui' : 'Non'
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `participants-${event?.slug || eventId}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToExcel = () => {
    // Pour Excel, nous utilisons le même format que CSV mais avec extension .xlsx
    // Dans une implémentation réelle, on utiliserait une bibliothèque comme xlsx
    const headers = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Entreprise', 'Poste', 'Inscrit le', 'Présent']
    const csvData = registrations.map(reg => [
      reg.lastName || '',
      reg.firstName || '',
      reg.email || '',
      reg.phone || '',
      reg.company || '',
      reg.position || '',
      new Date(reg.createdAt).toLocaleDateString('fr-FR'),
      reg.attended ? 'Oui' : 'Non'
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `participants-${event?.slug || eventId}.xlsx`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPDF = () => {
    // Génération simple de PDF en utilisant window.print()
    // Dans une implémentation réelle, on utiliserait une bibliothèque comme jsPDF
    const printContent = `
      <html>
        <head>
          <title>Participants - ${event?.title || 'Événement'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .header { text-align: center; margin-bottom: 30px; }
            .date { text-align: right; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Liste des participants</h1>
            <h2>${event?.title || 'Événement'}</h2>
          </div>
          <div class="date">
            Généré le ${new Date().toLocaleDateString('fr-FR')}
          </div>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Entreprise</th>
                <th>Poste</th>
                <th>Inscrit le</th>
                <th>Présent</th>
              </tr>
            </thead>
            <tbody>
              ${registrations.map(reg => `
                <tr>
                  <td>${reg.lastName || ''}</td>
                  <td>${reg.firstName || ''}</td>
                  <td>${reg.email || ''}</td>
                  <td>${reg.phone || ''}</td>
                  <td>${reg.company || ''}</td>
                  <td>${reg.position || ''}</td>
                  <td>${new Date(reg.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td>${reg.attended ? 'Oui' : 'Non'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div style="margin-top: 30px; text-align: center;">
            <p>Total participants: ${registrations.length}</p>
            <p>Présents: ${registrations.filter(r => r.attended).length}</p>
          </div>
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session || (session.user?.role !== 'ORGANIZER' && session.user?.role !== 'ADMIN')) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/dashboard/events/${eventId}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour à l'événement
          </Link>
          <h2 className="text-3xl font-bold">Participants</h2>
          <p className="text-muted-foreground">
            Gestion des inscriptions pour {event?.title || 'l\'événement'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToPDF}>
            <FileText className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={exportToExcel}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total inscrits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Présents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {registrations.filter(r => r.attended).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de présence</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {registrations.length > 0 
                ? Math.round((registrations.filter(r => r.attended).length / registrations.length) * 100) 
                : 0
              }%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Participants List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des participants</CardTitle>
          <CardDescription>
            {registrations.length} participant(s) inscrit(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {registrations.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun participant</h3>
              <p className="text-muted-foreground">
                Aucune inscription n'a encore été enregistrée pour cet événement
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Nom</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Entreprise</th>
                    <th className="text-left py-3 px-4">Inscrit le</th>
                    <th className="text-left py-3 px-4">Présent</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration) => (
                    <tr key={registration.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        {registration.firstName} {registration.lastName}
                      </td>
                      <td className="py-3 px-4">{registration.email}</td>
                      <td className="py-3 px-4">{registration.company}</td>
                      <td className="py-3 px-4">
                        {new Date(registration.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-4">
                        {registration.attended ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Oui
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Non
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}