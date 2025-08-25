'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const sessionRegistrationSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  function: z.string().min(1, 'La fonction est requise'),
  organization: z.string().min(1, 'L\'organisation est requise'),
});

type SessionRegistrationFormValues = z.infer<typeof sessionRegistrationSchema>;

interface PrefillData {
  email: string;
  firstName: string;
  lastName: string;
  function: string;
  organization: string;
  language: string;
}

interface SessionRegistrationFormProps {
  sessionId: string;
  eventId: string;
  sessionTitle: string;
  prefillEmail?: string;
  prefillData?: PrefillData;
  onSuccess?: () => void;
}

export function SessionRegistrationForm({
  sessionId,
  eventId,
  sessionTitle,
  prefillEmail,
  prefillData,
  onSuccess,
}: SessionRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(!!prefillEmail && !prefillData);

  const form = useForm<SessionRegistrationFormValues>({
    resolver: zodResolver(sessionRegistrationSchema),
    defaultValues: {
      firstName: prefillData?.firstName || '',
      lastName: prefillData?.lastName || '',
      email: prefillData?.email || prefillEmail || '',
      function: prefillData?.function || '',
      organization: prefillData?.organization || '',
    },
  });

  // Charger les données utilisateur si un email est fourni mais pas de données pré-remplies
  useEffect(() => {
    const loadUserData = async () => {
      if (prefillEmail && !prefillData) {
        try {
          const response = await fetch('/api/sessions/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionId,
              eventId,
              email: prefillEmail,
              checkOnly: true,
            }),
          });

          if (response.ok) {
            const result = await response.json();
            if (result.exists && result.userData) {
              form.reset({
                firstName: result.userData.first_name || '',
                lastName: result.userData.last_name || '',
                email: prefillEmail,
                function: result.userData.function || '',
                organization: result.userData.organization || '',
              });
            }
          }
        } catch (error) {
          console.error('Erreur lors du chargement des données utilisateur:', error);
        } finally {
          setIsLoadingUserData(false);
        }
      } else if (prefillData) {
        // Si des données pré-remplies sont fournies, pas besoin de charger
        setIsLoadingUserData(false);
      }
    };

    loadUserData();
  }, [prefillEmail, prefillData, sessionId, eventId, form]);

  const onSubmit = async (data: SessionRegistrationFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/sessions/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          eventId,
          ...data,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.success('Inscription réussie !');
        onSuccess?.();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Inscription réussie</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Votre inscription à la session "{sessionTitle}" a été enregistrée avec succès.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingUserData) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Chargement...</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            Chargement de vos informations...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Inscription à la session</CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          {sessionTitle}
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre prénom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="votre@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="function"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fonction</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre fonction" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Structure/Organisation</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre organisation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              S'inscrire
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}