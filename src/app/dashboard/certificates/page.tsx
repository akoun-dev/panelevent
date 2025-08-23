"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Star, Search, Calendar, Users, Download, Eye, Plus } from 'lucide-react'
import Link from 'next/link'

interface Certificate {
  id: string
  title: string
  event: {
    id: string
    title: string
    slug: string
  }
  template: {
    id: string
    name: string
  }
  isActive: boolean
  createdAt: string
  _count?: {
    issued: number
  }
}

export default function CertificatesPage() {
  const { data: _session } = useSession()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/events/my-events/certificates')
      if (response.ok) {
        const data = await response.json()
        setCertificates(data.certificates || [])
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredCertificates = certificates.filter(certificate => 
    certificate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    certificate.event.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Certificats</h1>
          <p className="text-muted-foreground">
            Gérez les certificats de participation pour vos événements
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/events/new-certificate">
            <Plus className="w-4 h-4 mr-2" />
            Créer un certificat
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un certificat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredCertificates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Star className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'Aucun résultat trouvé' : 'Aucun certificat'}
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm 
                ? 'Aucun certificat ne correspond à votre recherche.'
                : 'Vous n\'avez pas encore créé de certificat pour vos événements.'
              }
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link href="/dashboard/events/new-certificate">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer votre premier certificat
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredCertificates.map((certificate) => (
            <Card key={certificate.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{certificate.title}</CardTitle>
                    <CardDescription>
                      {certificate.event.title} • Modèle: {certificate.template.name}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={certificate.isActive ? 'default' : 'secondary'}>
                      {certificate.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Créé le {formatDate(certificate.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{certificate._count?.issued || 0} délivrés</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/e/${certificate.event.slug}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      Voir l'événement
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/events/${certificate.event.id}/certificates`}>
                      <Star className="w-4 h-4 mr-2" />
                      Gérer les certificats
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/api/certificates/export/${certificate.id}`}>
                      <Download className="w-4 h-4 mr-2" />
                      Exporter
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}