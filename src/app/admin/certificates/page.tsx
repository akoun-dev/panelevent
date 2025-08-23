"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AdminCertificatesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Certificats</h1>
        <p className="text-muted-foreground">
          Gérer les certificats et attestations de participation
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificats générés</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">📜</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">189</div>
            <p className="text-xs text-muted-foreground">
              Ce mois-ci
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">⏳</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              En attente de validation
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Téléchargements</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">📥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,456</div>
            <p className="text-xs text-muted-foreground">
              Téléchargements ce mois
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modèles</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">🎨</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Modèles disponibles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Actions courantes sur les certificats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button className="h-auto p-4 flex flex-col items-center gap-2">
              <span className="text-2xl">📝</span>
              <span>Générer des certificats</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <span className="text-2xl">📋</span>
              <span>Exporter la liste</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <span className="text-2xl">🎨</span>
              <span>Gérer les modèles</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Certificats récents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Certificats récents</CardTitle>
              <CardDescription>
                Certificats générés récemment
              </CardDescription>
            </div>
            <Button variant="outline">🔍 Rechercher</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📜</span>
                </div>
                <div>
                  <h3 className="font-semibold">Certificat de participation - Conférence Tech 2024</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Jean Dupont</span>
                    <span>•</span>
                    <span>jean.dupont@email.com</span>
                    <span>•</span>
                    <span>Généré il y a 2 heures</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">✅ Généré</Badge>
                <Button size="sm" variant="outline">👁️ Voir</Button>
                <Button size="sm" variant="outline">📥 Télécharger</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🏆</span>
                </div>
                <div>
                  <h3 className="font-semibold">Certificat de réussite - Atelier Développement Web</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Marie Curie</span>
                    <span>•</span>
                    <span>marie.curie@email.com</span>
                    <span>•</span>
                    <span>Généré il y a 5 heures</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">✅ Généré</Badge>
                <Button size="sm" variant="outline">👁️ Voir</Button>
                <Button size="sm" variant="outline">📥 Télécharger</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📜</span>
                </div>
                <div>
                  <h3 className="font-semibold">Attestation de présence - Webinaire Marketing</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Paul Martin</span>
                    <span>•</span>
                    <span>paul.martin@email.com</span>
                    <span>•</span>
                    <span>Généré il y a 1 jour</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">✅ Généré</Badge>
                <Button size="sm" variant="outline">👁️ Voir</Button>
                <Button size="sm" variant="outline">📥 Télécharger</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* En attente de validation */}
      <Card>
        <CardHeader>
          <CardTitle>En attente de validation</CardTitle>
          <CardDescription>
            Certificats qui nécessitent une validation manuelle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">⏳</span>
                </div>
                <div>
                  <h3 className="font-semibold">Certificat de participation - Conférence Annuelle</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Sophie Bernard</span>
                    <span>•</span>
                    <span>sophie.bernard@email.com</span>
                    <span>•</span>
                    <span>En attente depuis 2 jours</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">⏳ En attente</Badge>
                <Button size="sm">✅ Valider</Button>
                <Button size="sm" variant="outline">❌ Refuser</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}