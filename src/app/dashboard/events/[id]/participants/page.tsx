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
  branding?: {
    primaryColor?: string
    secondaryColor?: string
    accentColor?: string
    favicon?: string
  }
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
    // Récupérer les couleurs de l'événement ou utiliser des valeurs par défaut
    const primaryColor = event?.branding?.primaryColor || '#1c5320'
    const secondaryColor = event?.branding?.secondaryColor || '#a0b474'
    const accentColor = event?.branding?.accentColor || '#517324'
    
    const printContent = `
      <html>
        <head>
          <title>Liste des participants - ${event?.title || 'Événement'}</title>
          <style>
            @page {
              margin: 20mm;
              size: A4 landscape;
              orientation: landscape;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 0;
              color: #2d3748;
              line-height: 1.6;
              background: #ffffff;
            }
            
            .container {
              max-width: 100%;
              margin: 0 auto;
            }
            
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding: 25px 0;
              background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%);
              color: white;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .header h1 {
              margin: 0 0 8px 0;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: -0.5px;
            }
            
            .header h2 {
              margin: 0;
              font-size: 18px;
              font-weight: 400;
              opacity: 0.95;
            }
            
            .event-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 25px;
              padding: 20px;
              background: #f8fafc;
              border-radius: 8px;
              border-left: 4px solid ${accentColor};
            }
            
            .event-detail {
              flex: 1;
              text-align: center;
            }
            
            .event-detail strong {
              display: block;
              color: ${primaryColor};
              font-weight: 600;
              margin-bottom: 4px;
            }
            
            .event-detail span {
              color: #64748b;
              font-size: 14px;
            }
            
            .date-info {
              text-align: right;
              margin-bottom: 20px;
              color: ${secondaryColor};
              font-size: 13px;
              font-style: italic;
            }
            
            .table-container {
              overflow-x: auto;
              margin-bottom: 30px;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
              font-size: 12px;
            }
            
            th {
              background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%);
              color: white;
              font-weight: 600;
              padding: 12px 8px;
              text-align: left;
              border: none;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            td {
              padding: 10px 8px;
              border-bottom: 1px solid #e2e8f0;
              vertical-align: middle;
            }
            
            tr:nth-child(even) {
              background-color: #f8fafc;
            }
            
            tr:hover {
              background-color: #f1f5f9;
            }
            
            .status-present {
              color: ${accentColor};
              font-weight: 600;
              display: inline-flex;
              align-items: center;
              gap: 4px;
            }
            
            .status-absent {
              color: #dc2626;
              font-weight: 600;
              display: inline-flex;
              align-items: center;
              gap: 4px;
            }
            
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 16px;
              margin-top: 30px;
            }
            
            .stat-card {
              background: white;
              padding: 20px;
              border-radius: 12px;
              text-align: center;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
              border: 1px solid #e2e8f0;
            }
            
            .stat-number {
              font-size: 32px;
              font-weight: 700;
              margin-bottom: 8px;
              color: ${primaryColor};
            }
            
            .stat-label {
              color: #64748b;
              font-size: 14px;
              font-weight: 500;
            }
            
            .stat-present .stat-number {
              color: ${accentColor};
            }
            
            .stat-absent .stat-number {
              color: #dc2626;
            }
            
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid ${secondaryColor}40;
              text-align: center;
              color: #64748b;
              font-size: 12px;
            }
            
            .logo {
              margin-bottom: 10px;
              font-size: 18px;
              font-weight: 700;
              color: ${primaryColor};
            }
            
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .header {
                background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%) !important;
                -webkit-print-color-adjust: exact;
              }
              
              th {
                background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%) !important;
                -webkit-print-color-adjust: exact;
              }
              
              .stat-card {
                box-shadow: none;
                border: 1px solid #e2e8f0;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header avec branding -->
            <div class="header">
              <h1> Liste des participants</h1>
              <h2>${event?.title || 'Événement'}</h2>
            </div>
            
            <!-- Informations événement -->
            <div class="event-info">
              <div class="event-detail">
                <strong>${registrations.length}</strong>
                <span>Total participants</span>
              </div>
              <div class="event-detail">
                <strong>${registrations.filter(r => r.attended).length}</strong>
                <span>Présents</span>
              </div>
              <div class="event-detail">
                <strong>${registrations.length > 0
                  ? Math.round((registrations.filter(r => r.attended).length / registrations.length) * 100)
                  : 0
                }%</strong>
                <span>Taux de présence</span>
              </div>
            </div>
            
            <!-- Date de génération -->
            <div class="date-info">
                Document généré le ${new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} à ${new Date().toLocaleTimeString('fr-FR')}
            </div>
            
            <!-- Tableau des participants -->
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nom complet</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th>Poste</th>
                  </tr>
                </thead>
                <tbody>
                  ${registrations.map(reg => `
                    <tr>
                      <td><strong>${reg.firstName || ''} ${reg.lastName || ''}</strong></td>
                      <td>${reg.email || '-'}</td>
                      <td>${reg.company || '-'}</td>
                      <td>${reg.position || '-'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            
            <!-- Statistiques détaillées -->
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">${registrations.length}</div>
                <div class="stat-label">Total inscrits</div>
              </div>
              <div class="stat-card stat-present">
                <div class="stat-number">${registrations.filter(r => r.attended).length}</div>
                <div class="stat-label">Participants présents</div>
              </div>
              <div class="stat-card stat-absent">
                <div class="stat-number">${registrations.filter(r => !r.attended).length}</div>
                <div class="stat-label">Participants absents</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${registrations.length > 0
                  ? Math.round((registrations.filter(r => r.attended).length / registrations.length) * 100)
                  : 0
                }%</div>
                <div class="stat-label">Taux de présence</div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <div class="logo">PanelEvent</div>
              <div>Système de gestion d'événements professionnels</div>
              <div>© ${new Date().getFullYear()} - Document confidentiel</div>
            </div>
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