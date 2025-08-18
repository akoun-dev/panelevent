"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AdminRecordingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Enregistrements</h1>
        <p className="text-muted-foreground">
          Gérer les enregistrements audio et vidéo des événements
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total enregistrements</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">🎤</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">
              Ce mois-ci
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durée totale</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">⏱️</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124h</div>
            <p className="text-xs text-muted-foreground">
              D'écoute ce mois
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Espace utilisé</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">💾</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 GB</div>
            <p className="text-xs text-muted-foreground">
              Sur 10 GB disponibles
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">🔴</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Enregistrements actifs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Actions courantes sur les enregistrements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button className="h-auto p-4 flex flex-col items-center gap-2">
              <span className="text-2xl">🎙️</span>
              <span>Démarrer un enregistrement</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <span className="text-2xl">📁</span>
              <span>Gérer les dossiers</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <span className="text-2xl">⬆️</span>
              <span>Importer des fichiers</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enregistrements récents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Enregistrements récents</CardTitle>
              <CardDescription>
                Enregistrements audio et vidéo récents
              </CardDescription>
            </div>
            <Button variant="outline">🔍 Rechercher</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🔴</span>
                </div>
                <div>
                  <h3 className="font-semibold">Conférence Tech 2024 - Session Principale</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Audio</span>
                    <span>•</span>
                    <span>2h 34min</span>
                    <span>•</span>
                    <span>156 MB</span>
                    <span>•</span>
                    <span>En cours d'enregistrement</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">🔴 En direct</Badge>
                <Button size="sm" variant="outline">⏹️ Arrêter</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🎵</span>
                </div>
                <div>
                  <h3 className="font-semibold">Webinaire Marketing - Stratégies 2024</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Audio</span>
                    <span>•</span>
                    <span>1h 45min</span>
                    <span>•</span>
                    <span>98 MB</span>
                    <span>•</span>
                    <span>Terminé il y a 2 heures</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">✅ Terminé</Badge>
                <Button size="sm" variant="outline">▶️ Écouter</Button>
                <Button size="sm" variant="outline">📥 Télécharger</Button>
                <Button size="sm" variant="outline">✏️ Éditer</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🎥</span>
                </div>
                <div>
                  <h3 className="font-semibold">Atelier Développement Web - Tutoriel React</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Vidéo</span>
                    <span>•</span>
                    <span>3h 12min</span>
                    <span>•</span>
                    <span>456 MB</span>
                    <span>•</span>
                    <span>Terminé il y a 1 jour</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">✅ Terminé</Badge>
                <Button size="sm" variant="outline">▶️ Regarder</Button>
                <Button size="sm" variant="outline">📥 Télécharger</Button>
                <Button size="sm" variant="outline">✏️ Éditer</Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">🎙️</span>
                </div>
                <div>
                  <h3 className="font-semibold">Session Q&A - Conférence Annuelle</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Audio</span>
                    <span>•</span>
                    <span>45min</span>
                    <span>•</span>
                    <span>34 MB</span>
                    <span>•</span>
                    <span>Terminé il y a 3 jours</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">✅ Terminé</Badge>
                <Button size="sm" variant="outline">▶️ Écouter</Button>
                <Button size="sm" variant="outline">📥 Télécharger</Button>
                <Button size="sm" variant="outline">✏️ Éditer</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stockage */}
      <Card>
        <CardHeader>
          <CardTitle>Stockage</CardTitle>
          <CardDescription>
            Utilisation de l'espace de stockage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Audio</span>
                <span>1.2 GB / 5 GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Vidéo</span>
                <span>1.2 GB / 5 GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between">
                <span className="font-medium">Total utilisé</span>
                <span className="font-medium">2.4 GB / 10 GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">24% de l'espace utilisé</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}