"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AdminPollsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sondages</h1>
        <p className="text-muted-foreground">
          Gérer les sondages et les votes des événements
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total sondages</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">📊</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              Créés ce mois
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sondages actifs</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">✅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              En cours actuellement
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total votes</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">🗳️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              Votes ce mois
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de participation</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">📈</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              Participation moyenne
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sondages actifs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sondages actifs</CardTitle>
              <CardDescription>
                Sondages actuellement en cours
              </CardDescription>
            </div>
            <Button>➕ Créer un sondage</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold mb-1">Quel sujet vous intéresse le plus pour la prochaine conférence ?</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">Conférence Tech 2024</Badge>
                    <span>•</span>
                    <span>Créé il y a 2 jours</span>
                    <span>•</span>
                    <span>245 votes</span>
                  </div>
                </div>
                <Badge variant="outline">🟢 Actif</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Intelligence Artificielle</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cybersécurité</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cloud Computing</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold mb-1">Comment évalueriez-vous la qualité de cet événement ?</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">Webinaire Marketing</Badge>
                    <span>•</span>
                    <span>Créé il y a 1 jour</span>
                    <span>•</span>
                    <span>189 votes</span>
                  </div>
                </div>
                <Badge variant="outline">🟢 Actif</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">⭐⭐⭐⭐⭐ Excellent</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">⭐⭐⭐⭐ Bon</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">⭐⭐⭐ Moyen</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sondages terminés */}
      <Card>
        <CardHeader>
          <CardTitle>Sondages terminés</CardTitle>
          <CardDescription>
            Sondages qui ont été clos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold mb-1">Quel format préférez-vous pour les prochains événements ?</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">Atelier Dev Web</Badge>
                  <span>•</span>
                  <span>Terminé il y a 3 jours</span>
                  <span>•</span>
                  <span>156 votes</span>
                </div>
              </div>
              <Badge variant="secondary">✅ Terminé</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold mb-1">Quels outils de collaboration utilisez-vous ?</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">Conférence Annuelle</Badge>
                  <span>•</span>
                  <span>Terminé il y a 1 semaine</span>
                  <span>•</span>
                  <span>423 votes</span>
                </div>
              </div>
              <Badge variant="secondary">✅ Terminé</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}