'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
  firstName: string;
  lastName: string;
  position?: string;
  company?: string;
  language: string;
}

interface EventData {
  id: string;
  title: string;
}

export default function CheckEmailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [email, setEmail] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [isReRegistering, setIsReRegistering] = useState(false);
  const router = useRouter();

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Veuillez entrer votre email');
      return;
    }

    setIsChecking(true);
    try {
      // D'abord, récupérer l'événement à partir du slug
      const eventResponse = await fetch(`/api/events/by-slug/${slug}`);
      if (!eventResponse.ok) {
        throw new Error('Événement non trouvé');
      }

      const event = await eventResponse.json();
      
      // Vérifier si l'email existe déjà pour cet événement
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          email,
          checkOnly: true,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('API Response:', result);
        
        if (result.exists) {
          // Utilisateur existe dans la base - afficher le consentement pour réinscription
          setUserData(result.userData);
          setEventData(event);
        } else {
          // Utilisateur non inscrit, rediriger vers l'inscription complète
          console.log('User not registered, redirecting with email only');
          const queryParams = new URLSearchParams({
            email: encodeURIComponent(email)
          });
          router.push(`/register/${slug}?${queryParams}`);
        }
      } else {
        const errorResult = await response.json();
        console.error('Erreur API:', errorResult);
        toast.error(errorResult.error || 'Erreur lors de la vérification');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion');
    } finally {
      setIsChecking(false);
    }
  };

  const handleReRegister = async () => {
    if (!eventData || !userData) return;
    
    setIsReRegistering(true);
    try {
      // Réinscrire automatiquement l'utilisateur à l'événement en cours
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: eventData.id,
          email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          position: userData.position,
          company: userData.company,
          language: userData.language,
          consent: true,
          checkOnly: false
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success('Réinscription réussie !');
        
        // Rediriger vers la page de confirmation
        const queryParams = new URLSearchParams({
          success: 'true',
          registrationId: result.registrationId
        });
        router.push(`/register/${slug}/success?${queryParams}`);
      } else {
        const errorResult = await response.json();
        toast.error(errorResult.error || 'Erreur lors de la réinscription');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion');
    } finally {
      setIsReRegistering(false);
    }
  };

  const handleNewRegistration = () => {
    if (!userData) return;
    
    // Rediriger vers l'inscription normale avec les données pré-remplies
    const queryParams = new URLSearchParams({
      prefill: 'true',
      email: encodeURIComponent(email),
      firstName: encodeURIComponent(userData.firstName || ''),
      lastName: encodeURIComponent(userData.lastName || ''),
      position: encodeURIComponent(userData.position || ''),
      company: encodeURIComponent(userData.company || ''),
      language: encodeURIComponent(userData.language || 'fr')
    });
    router.push(`/register/${slug}?${queryParams}`);
  };

  if (userData && eventData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fern-frond/5 to-luxor-gold/10 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center">Confirmation de réinscription</CardTitle>
              <p className="text-sm text-muted-foreground text-center">
                Nous avons trouvé vos informations dans notre système
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Nom:</strong> {userData.firstName} {userData.lastName}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {email}
                </p>
                <p className="text-sm">
                  <strong>Entreprise:</strong> {userData.company || 'Non spécifié'}
                </p>
                <p className="text-sm">
                  <strong>Poste:</strong> {userData.position || 'Non spécifié'}
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Consentement:</strong> En cliquant sur "Me réinscrire", vous confirmez votre participation à l'événement "{eventData?.title}" et acceptez le traitement de vos données.
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <Button
                  onClick={handleReRegister}
                  disabled={isReRegistering}
                  className="w-full"
                >
                  {isReRegistering && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Me réinscrire automatiquement
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleNewRegistration}
                  className="w-full"
                >
                  Modifier mes informations d'abord
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fern-frond/5 to-luxor-gold/10 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">Vérification d'email</CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Entrez votre email pour vérifier votre inscription à l'événement
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheckEmail} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isChecking}>
                {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Vérifier
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}