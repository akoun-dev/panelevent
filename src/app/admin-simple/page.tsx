"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SimpleAdminPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de l'activité sur la plateforme PanelEvent
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +12% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total événements</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">📅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              2 événements actifs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscriptions</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">📈</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +8% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d'activité</CardTitle>
            <span className="h-4 w-4 text-muted-foreground">⚡</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              Utilisateurs actifs ce mois
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accédez rapidement aux fonctionnalités principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="flex items-center gap-3">
                  <span className="h-5 w-5">👥</span>
                  <div className="text-left">
                    <div className="font-medium">Gérer les utilisateurs</div>
                    <div className="text-xs text-muted-foreground">
                      Créer et modifier des comptes
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
            
            <Link href="/admin/events">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="flex items-center gap-3">
                  <span className="h-5 w-5">📅</span>
                  <div className="text-left">
                    <div className="font-medium">Gérer les événements</div>
                    <div className="text-xs text-muted-foreground">
                      Administrer tous les événements
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
            
            <Link href="/admin/export">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="flex items-center gap-3">
                  <span className="h-5 w-5">📊</span>
                  <div className="text-left">
                    <div className="font-medium">Exporter des données</div>
                    <div className="text-xs text-muted-foreground">
                      Rapports et statistiques
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
            
            <Link href="/admin/settings">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <div className="flex items-center gap-3">
                  <span className="h-5 w-5">💬</span>
                  <div className="text-left">
                    <div className="font-medium">Modération Q&A</div>
                    <div className="text-xs text-muted-foreground">
                      Gérer les questions
                    </div>
                  </div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Top Events */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>
              Dernières actions sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-muted text-blue-600">
                  <span className="h-4 w-4">👤</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    Nouvel utilisateur inscrit
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Il y a 5 minutes
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-muted text-green-600">
                  <span className="h-4 w-4">📅</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    Événement "Conférence Tech" créé
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Il y a 15 minutes
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-muted text-purple-600">
                  <span className="h-4 w-4">👥</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    Nouvelle inscription à "Webinaire Marketing"
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Il y a 30 minutes
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Events */}
        <Card>
          <CardHeader>
            <CardTitle>Événements populaires</CardTitle>
            <CardDescription>
              Les événements avec le plus d'inscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    Conférence Annuelle 2024
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>📅</span>
                    <span>15/03/2024</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    45 inscrits
                  </Badge>
                  <span className="h-4 w-4 text-muted-foreground">→</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    Atelier Développement Web
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>📅</span>
                    <span>20/03/2024</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    32 inscrits
                  </Badge>
                  <span className="h-4 w-4 text-muted-foreground">→</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    Séminaire Marketing Digital
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>📅</span>
                    <span>25/03/2024</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    28 inscrits
                  </Badge>
                  <span className="h-4 w-4 text-muted-foreground">→</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Vue d'ensemble des fonctionnalités</CardTitle>
          <CardDescription>
            Statistiques d'utilisation des différentes fonctionnalités
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <span className="h-8 w-8 mx-auto mb-2 text-blue-600">💬</span>
              <div className="text-2xl font-bold">234</div>
              <div className="text-sm text-muted-foreground">Questions posées</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <span className="h-8 w-8 mx-auto mb-2 text-green-600">📊</span>
              <div className="text-2xl font-bold">45</div>
              <div className="text-sm text-muted-foreground">Sondages créés</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <span className="h-8 w-8 mx-auto mb-2 text-purple-600">📜</span>
              <div className="text-2xl font-bold">189</div>
              <div className="text-sm text-muted-foreground">Certificats générés</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <span className="h-8 w-8 mx-auto mb-2 text-orange-600">🎤</span>
              <div className="text-2xl font-bold">67</div>
              <div className="text-sm text-muted-foreground">Enregistrements audio</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}