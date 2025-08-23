"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AdminFeedbacksPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Feedbacks</h1>
        <p className="text-muted-foreground">
          Analyser les retours et avis des participants
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total feedbacks</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">📝</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">
              Reçus ce mois
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">⭐</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6</div>
            <p className="text-xs text-muted-foreground">
              Sur 5 étoiles
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">😊</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              Taux de satisfaction
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réponses</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">💬</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              Taux de réponse
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribution des notes */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution des notes</CardTitle>
          <CardDescription>
            Répartition des évaluations des participants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium w-16">5 ⭐</span>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div className="bg-green-600 h-3 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <span className="text-sm text-muted-foreground w-12">65%</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium w-16">4 ⭐</span>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full" style={{ width: '25%' }}></div>
              </div>
              <span className="text-sm text-muted-foreground w-12">25%</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium w-16">3 ⭐</span>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '7%' }}></div>
              </div>
              <span className="text-sm text-muted-foreground w-12">7%</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium w-16">2 ⭐</span>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div className="bg-orange-500 h-3 rounded-full" style={{ width: '2%' }}></div>
              </div>
              <span className="text-sm text-muted-foreground w-12">2%</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium w-16">1 ⭐</span>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div className="bg-red-500 h-3 rounded-full" style={{ width: '1%' }}></div>
              </div>
              <span className="text-sm text-muted-foreground w-12">1%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedbacks récents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Feedbacks récents</CardTitle>
              <CardDescription>
                Derniers avis reçus des participants
              </CardDescription>
            </div>
            <Button variant="outline">🔍 Filtrer</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-500">⭐</span>
                  </div>
                  <Badge variant="secondary">Conférence Tech 2024</Badge>
                </div>
                <span className="text-sm text-muted-foreground">Il y a 2 heures</span>
              </div>
              
              <h4 className="font-semibold mb-2">Excellent événement !</h4>
              <p className="text-sm text-muted-foreground mb-3">
                La conférence était très bien organisée avec des intervenants de qualité. 
                Les sujets étaient pertinents et j'ai beaucoup appris. 
                Je recommande vivement cet événement.
              </p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>👤 Jean Dupont</span>
                <span>•</span>
                <span>📧 jean.dupont@email.com</span>
                <span>•</span>
                <span>🏢 Entreprise ABC</span>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-gray-300">⭐</span>
                  </div>
                  <Badge variant="secondary">Webinaire Marketing</Badge>
                </div>
                <span className="text-sm text-muted-foreground">Il y a 5 heures</span>
              </div>
              
              <h4 className="font-semibold mb-2">Très bon contenu</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Le webinaire était intéressant et bien présenté. 
                J'aurais aimé avoir plus de temps pour les questions. 
                Dans l'ensemble, c'était une bonne expérience.
              </p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>👤 Marie Curie</span>
                <span>•</span>
                <span>📧 marie.curie@email.com</span>
                <span>•</span>
                <span>🏢 Marketing Pro</span>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-red-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-gray-300">⭐</span>
                    <span className="text-gray-300">⭐</span>
                    <span className="text-gray-300">⭐</span>
                  </div>
                  <Badge variant="secondary">Atelier Dev Web</Badge>
                  <Badge variant="destructive">À traiter</Badge>
                </div>
                <span className="text-sm text-muted-foreground">Il y a 1 jour</span>
              </div>
              
              <h4 className="font-semibold mb-2">Décevant</h4>
              <p className="text-sm text-muted-foreground mb-3">
                L'atelier ne correspondait pas à la description. 
                Le niveau était trop bas et le formateur n'était pas préparé. 
                J'attendais beaucoup plus de contenu technique.
              </p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span>👤 Paul Martin</span>
                <span>•</span>
                <span>📧 paul.martin@email.com</span>
                <span>•</span>
                <span>🏢 Tech Solutions</span>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm">💬 Répondre</Button>
                <Button size="sm" variant="outline">📞 Contacter</Button>
                <Button size="sm" variant="outline">✅ Marquer comme traité</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedbacks par catégorie */}
      <Card>
        <CardHeader>
          <CardTitle>Feedbacks par catégorie</CardTitle>
          <CardDescription>
            Analyse des retours par type d'événement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">🎤 Conférences</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Note moyenne:</span>
                  <span className="font-medium">4.7/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Feedbacks:</span>
                  <span className="font-medium">234</span>
                </div>
                <div className="flex justify-between">
                  <span>Satisfaction:</span>
                  <span className="font-medium text-green-600">95%</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">💻 Webinaires</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Note moyenne:</span>
                  <span className="font-medium">4.5/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Feedbacks:</span>
                  <span className="font-medium">189</span>
                </div>
                <div className="flex justify-between">
                  <span>Satisfaction:</span>
                  <span className="font-medium text-green-600">91%</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">🛠️ Ateliers</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Note moyenne:</span>
                  <span className="font-medium">4.3/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Feedbacks:</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span>Satisfaction:</span>
                  <span className="font-medium text-green-600">88%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}