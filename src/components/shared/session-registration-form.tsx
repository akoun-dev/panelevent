'use client';

import { useState } from 'react';
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

interface SessionRegistrationFormProps {
  sessionId: string;
  eventId: string;
  sessionTitle: string;
  onSuccess?: () => void;
}

export function SessionRegistrationForm({
  sessionId,
  eventId,
  sessionTitle,
  onSuccess,
}: SessionRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<SessionRegistrationFormValues>({
    resolver: zodResolver(sessionRegistrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      function: '',
      organization: '',
    },
  });

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