"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Configuration du système et préférences
        </p>
      </div>

      {/* Paramètres généraux */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres généraux</CardTitle>
          <CardDescription>
            Configuration de base de la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-2 block">Nom de la plateforme</label>
                <div className="p-2 border rounded-md bg-muted">
                  PanelEvent
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email de contact</label>
                <div className="p-2 border rounded-md bg-muted">
                  contact@panelevent.com
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <div className="p-3 border rounded-md bg-muted">
                La plateforme unifiée pour la gestion d'événements, sessions interactives, questions en direct, sondages et attestations.
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Maintenance mode</h4>
                <p className="text-sm text-muted-foreground">
                  Désactiver temporairement la plateforme
                </p>
              </div>
              <Badge variant="outline">🟢 Actif</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paramètres des événements */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres des événements</CardTitle>
          <CardDescription>
            Configuration par défaut pour les événements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-2 block">Limite de participants</label>
                <div className="p-2 border rounded-md bg-muted">
                  1000
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Durée maximale</label>
                <div className="p-2 border rounded-md bg-muted">
                  8 heures
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Modération automatique</h4>
                <p className="text-sm text-muted-foreground">
                  Approuver automatiquement les questions
                </p>
              </div>
              <Badge variant="outline">❌ Inactif</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Enregistrement automatique</h4>
                <p className="text-sm text-muted-foreground">
                  Enregistrer toutes les sessions par défaut
                </p>
              </div>
              <Badge variant="outline">✅ Actif</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paramètres de sécurité */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de sécurité</CardTitle>
          <CardDescription>
            Configuration de la sécurité et de l'authentification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Authentification à deux facteurs</h4>
                <p className="text-sm text-muted-foreground">
                  Exiger la 2FA pour les administrateurs
                </p>
              </div>
              <Badge variant="outline">✅ Actif</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Session timeout</h4>
                <p className="text-sm text-muted-foreground">
                  Durée avant déconnexion automatique
                </p>
              </div>
              <div className="text-sm font-medium">30 minutes</div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Mot de passe fort</h4>
                <p className="text-sm text-muted-foreground">
                  Exiger des mots de passe complexes
                </p>
              </div>
              <Badge variant="outline">✅ Actif</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paramètres d'email */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres d'email</CardTitle>
          <CardDescription>
            Configuration des notifications par email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-2 block">Serveur SMTP</label>
                <div className="p-2 border rounded-md bg-muted">
                  smtp.panelevent.com
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Port SMTP</label>
                <div className="p-2 border rounded-md bg-muted">
                  587
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Emails de notification</h4>
                <p className="text-sm text-muted-foreground">
                  Envoyer des emails pour les nouveaux événements
                </p>
              </div>
              <Badge variant="outline">✅ Actif</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Emails de rappel</h4>
                <p className="text-sm text-muted-foreground">
                  Envoyer des rappels avant les événements
                </p>
              </div>
              <Badge variant="outline">✅ Actif</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paramètres de stockage */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de stockage</CardTitle>
          <CardDescription>
            Configuration du stockage des fichiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-2 block">Espace total</label>
                <div className="p-2 border rounded-md bg-muted">
                  100 GB
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Espace utilisé</label>
                <div className="p-2 border rounded-md bg-muted">
                  15.2 GB (15.2%)
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Compression automatique</h4>
                <p className="text-sm text-muted-foreground">
                  Compresser les fichiers automatiquement
                </p>
              </div>
              <Badge variant="outline">✅ Actif</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Backup automatique</h4>
                <p className="text-sm text-muted-foreground">
                  Sauvegarder les données quotidiennement
                </p>
              </div>
              <Badge variant="outline">✅ Actif</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>
            Actions de maintenance et gestion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-auto p-4 flex flex-col items-center gap-2">
              <span className="text-2xl">💾</span>
              <span>Sauvegarder</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <span className="text-2xl">🔄</span>
              <span>Mettre à jour</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <span className="text-2xl">📊</span>
              <span>Exporter les données</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <span className="text-2xl">🗑️</span>
              <span>Vider le cache</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}