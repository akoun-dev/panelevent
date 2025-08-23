"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AdminQAPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Questions & Réponses</h1>
        <p className="text-muted-foreground">
          Modérer les questions et réponses des événements
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions en attente</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">⏳</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              En attente de modération
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions approuvées</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">✅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">
              Publiées ce mois
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions rejetées</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">❌</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Non conformes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Questions en attente */}
      <Card>
        <CardHeader>
          <CardTitle>Questions en attente de modération</CardTitle>
          <CardDescription>
            Questions qui nécessitent votre approbation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">Conférence Tech</Badge>
                  <span className="text-sm text-muted-foreground">Il y a 5 minutes</span>
                </div>
                <p className="font-medium mb-1">Quelles sont les meilleures pratiques pour la sécurité cloud ?</p>
                <p className="text-sm text-muted-foreground">Par: jean.dupont@email.com</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">✅ Approuver</Button>
                <Button size="sm" variant="outline">❌ Rejeter</Button>
              </div>
            </div>
            
            <div className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">Webinaire Marketing</Badge>
                  <span className="text-sm text-muted-foreground">Il y a 12 minutes</span>
                </div>
                <p className="font-medium mb-1">Comment mesurer le ROI des campagnes social media ?</p>
                <p className="text-sm text-muted-foreground">Par: marie.curie@email.com</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">✅ Approuver</Button>
                <Button size="sm" variant="outline">❌ Rejeter</Button>
              </div>
            </div>
            
            <div className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">Atelier Dev Web</Badge>
                  <span className="text-sm text-muted-foreground">Il y a 18 minutes</span>
                </div>
                <p className="font-medium mb-1">Quels frameworks recommandez-vous pour 2024 ?</p>
                <p className="text-sm text-muted-foreground">Par: paul.martin@email.com</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">✅ Approuver</Button>
                <Button size="sm" variant="outline">❌ Rejeter</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Questions récentes</CardTitle>
          <CardDescription>
            Historique des questions modérées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">✅ Approuvée</Badge>
                  <Badge variant="secondary">Conférence Tech</Badge>
                  <span className="text-sm text-muted-foreground">Il y a 1 heure</span>
                </div>
                <p className="font-medium mb-1">Comment optimiser les performances d'une application React ?</p>
                <p className="text-sm text-muted-foreground">Par: sophie.bernard@email.com</p>
              </div>
            </div>
            
            <div className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="destructive">❌ Rejetée</Badge>
                  <Badge variant="secondary">Webinaire Marketing</Badge>
                  <span className="text-sm text-muted-foreground">Il y a 2 heures</span>
                </div>
                <p className="font-medium mb-1">Pouvez-vous donner votre numéro de téléphone ?</p>
                <p className="text-sm text-muted-foreground">Par: utilisateur.spam@email.com</p>
                <p className="text-sm text-red-600">Raison: Demande d'informations personnelles</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}