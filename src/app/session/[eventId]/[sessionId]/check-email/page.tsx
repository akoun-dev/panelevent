'use client';

import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CheckEmailPageProps {
  params: Promise<{ eventId: string; sessionId: string }>;
}

export default function CheckEmailPage({ params }: CheckEmailPageProps) {
  const { eventId, sessionId } = React.use(params);
  const [email, setEmail] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Veuillez entrer votre email');
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch('/api/sessions/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          eventId,
          email,
          checkOnly: true,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.exists) {
          // Utilisateur déjà inscrit à l'événement, pré-remplir le formulaire avec les données
          const queryParams = new URLSearchParams({
            email: encodeURIComponent(email),
            firstName: encodeURIComponent(result.userData?.first_name || ''),
            lastName: encodeURIComponent(result.userData?.last_name || ''),
            function: encodeURIComponent(result.userData?.function || ''),
            organization: encodeURIComponent(result.userData?.organization || ''),
            language: encodeURIComponent(result.userData?.language || 'fr')
          });
          router.push(`/session/${eventId}/${sessionId}/register?${queryParams}`);
        } else {
          // Utilisateur non inscrit, rediriger vers l'inscription complète
          router.push(`/register/${eventId}?redirectTo=/session/${eventId}/${sessionId}/register`);
        }
      } else {
        const errorResult = await response.json();
        console.error('Erreur API:', errorResult);
        toast.error(errorResult.message || 'Erreur lors de la vérification');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
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
                  placeholder="votre@email.com"
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