'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Traductions
const translations = {
  fr: {
    title: "Vérification d'email",
    subtitle: "Entrez votre email pour vérifier votre inscription à l'événement",
    emailLabel: "Email",
    checkButton: "Vérifier",
    confirmationTitle: "Confirmation de réinscription",
    confirmationSubtitle: "Nous avons trouvé vos informations dans notre système",
    nameLabel: "Nom",
    emailLabelDisplay: "Email",
    companyLabel: "Entreprise",
    positionLabel: "Poste",
    notSpecified: "Non spécifié",
    consentTitle: "Consentement",
    consentText: (eventTitle: string) => `En cliquant sur "Me réinscrire", vous confirmez votre participation à l'événement "${eventTitle}" et acceptez le traitement de vos données.`,
    reRegisterButton: "Me réinscrire automatiquement",
    modifyButton: "Modifier mes informations d'abord",
    errorEmailRequired: "Veuillez entrer votre email",
    errorEventNotFound: "Événement non trouvé",
    errorCheck: "Erreur lors de la vérification",
    errorConnection: "Erreur de connexion",
    successReRegister: "Réinscription réussie !",
    errorReRegister: "Erreur lors de la réinscription"
  },
  en: {
    title: "Email Verification",
    subtitle: "Enter your email to check your registration for the event",
    emailLabel: "Email",
    checkButton: "Check",
    confirmationTitle: "Re-registration Confirmation",
    confirmationSubtitle: "We found your information in our system",
    nameLabel: "Name",
    emailLabelDisplay: "Email",
    companyLabel: "Company",
    positionLabel: "Position",
    notSpecified: "Not specified",
    consentTitle: "Consent",
    consentText: (eventTitle: string) => `By clicking "Re-register me", you confirm your participation in the event "${eventTitle}" and accept the processing of your data.`,
    reRegisterButton: "Re-register me automatically",
    modifyButton: "Modify my information first",
    errorEmailRequired: "Please enter your email",
    errorEventNotFound: "Event not found",
    errorCheck: "Error during verification",
    errorConnection: "Connection error",
    successReRegister: "Re-registration successful!",
    errorReRegister: "Error during re-registration"
  },
  pt: {
    title: "Verificação de Email",
    subtitle: "Digite seu email para verificar sua inscrição no evento",
    emailLabel: "Email",
    checkButton: "Verificar",
    confirmationTitle: "Confirmação de Reinscrição",
    confirmationSubtitle: "Encontramos suas informações em nosso sistema",
    nameLabel: "Nome",
    emailLabelDisplay: "Email",
    companyLabel: "Empresa",
    positionLabel: "Cargo",
    notSpecified: "Não especificado",
    consentTitle: "Consentimento",
    consentText: (eventTitle: string) => `Ao clicar em "Reinscrever-me", você confirma sua participação no evento "${eventTitle}" e aceita o processamento de seus dados.`,
    reRegisterButton: "Reinscrever-me automaticamente",
    modifyButton: "Modificar minhas informações primeiro",
    errorEmailRequired: "Por favor, digite seu email",
    errorEventNotFound: "Evento não encontrado",
    errorCheck: "Erro durante a verificação",
    errorConnection: "Erro de conexão",
    successReRegister: "Reinscrição bem-sucedida!",
    errorReRegister: "Erro durante a reinscrição"
  },
  es: {
    title: "Verificación de Email",
    subtitle: "Ingrese su email para verificar su inscripción al evento",
    emailLabel: "Email",
    checkButton: "Verificar",
    confirmationTitle: "Confirmación de Reinscripción",
    confirmationSubtitle: "Encontramos su información en nuestro sistema",
    nameLabel: "Nombre",
    emailLabelDisplay: "Email",
    companyLabel: "Empresa",
    positionLabel: "Cargo",
    notSpecified: "No especificado",
    consentTitle: "Consentimiento",
    consentText: (eventTitle: string) => `Al hacer clic en "Reinscribirme", confirma su participación en el evento "${eventTitle}" y acepta el procesamiento de sus datos.`,
    reRegisterButton: "Reinscribirme automáticamente",
    modifyButton: "Modificar mi información primero",
    errorEmailRequired: "Por favor, ingrese su email",
    errorEventNotFound: "Evento no encontrado",
    errorCheck: "Error durante la verificación",
    errorConnection: "Error de conexión",
    successReRegister: "¡Reinscripción exitosa!",
    errorReRegister: "Error durante la reinscripción"
  },
  ar: {
    title: "التحقق من البريد الإلكتروني",
    subtitle: "أدخل بريدك الإلكتروني للتحقق من تسجيلك في الحدث",
    emailLabel: "البريد الإلكتروني",
    checkButton: "تحقق",
    confirmationTitle: "تأكيد إعادة التسجيل",
    confirmationSubtitle: "وجدنا معلوماتك في نظامنا",
    nameLabel: "الاسم",
    emailLabelDisplay: "البريد الإلكتروني",
    companyLabel: "الشركة",
    positionLabel: "المنصب",
    notSpecified: "غير محدد",
    consentTitle: "الموافقة",
    consentText: (eventTitle: string) => `بالنقر على "أعد تسجيلي"، تؤكد مشاركتك في الحدث "${eventTitle}" وتوافق على معالجة بياناتك.`,
    reRegisterButton: "أعد تسجيلي تلقائياً",
    modifyButton: "عدّل معلوماتي أولاً",
    errorEmailRequired: "يرجى إدخال بريدك الإلكتروني",
    errorEventNotFound: "الحدث غير موجود",
    errorCheck: "خطأ أثناء التحقق",
    errorConnection: "خطأ في الاتصال",
    successReRegister: "تمت إعادة التسجيل بنجاح!",
    errorReRegister: "خطأ أثناء إعادة التسجيل"
  }
};

type Language = keyof typeof translations;

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
  const [currentLanguage, setCurrentLanguage] = useState<Language>('fr');

  // Fonction pour obtenir les traductions
  const t = translations[currentLanguage];

  useEffect(() => {
    // Si on a déjà des données utilisateur, utiliser sa langue
    if (userData?.language) {
      setCurrentLanguage(userData.language as Language || 'fr');
    }
  }, [userData]);

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(t.errorEmailRequired);
      return;
    }

    setIsChecking(true);
    try {
      // D'abord, récupérer l'événement à partir du slug
      const eventResponse = await fetch(`/api/events/by-slug/${slug}`);
      if (!eventResponse.ok) {
        throw new Error(t.errorEventNotFound);
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
        toast.error(errorResult.error || t.errorCheck);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(t.errorConnection);
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
        toast.success(t.successReRegister);
        
        // Stocker l'ID d'inscription et rediriger vers le programme
        if (result.registrationId) {
          localStorage.setItem('registrationId', result.registrationId);
        }
        if (userData.language) {
          localStorage.setItem('selectedLanguage', userData.language);
        }
        router.push('/program');
      } else {
        const errorResult = await response.json();
        toast.error(errorResult.error || t.errorReRegister);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(t.errorConnection);
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
              <CardTitle className="text-center">{t.confirmationTitle}</CardTitle>
              <p className="text-sm text-muted-foreground text-center">
                {t.confirmationSubtitle}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">
                  <strong>{t.nameLabel}:</strong> {userData.firstName} {userData.lastName}
                </p>
                <p className="text-sm">
                  <strong>{t.emailLabelDisplay}:</strong> {email}
                </p>
                <p className="text-sm">
                  <strong>{t.companyLabel}:</strong> {userData.company || t.notSpecified}
                </p>
                <p className="text-sm">
                  <strong>{t.positionLabel}:</strong> {userData.position || t.notSpecified}
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>{t.consentTitle}:</strong> {t.consentText(eventData?.title || '')}
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <Button
                  onClick={handleReRegister}
                  disabled={isReRegistering}
                  className="w-full"
                >
                  {isReRegistering && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t.reRegisterButton}
               </Button>
               
               <Button
                 variant="outline"
                 onClick={handleNewRegistration}
                 className="w-full"
               >
                 {t.modifyButton}
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
            <CardTitle className="text-center">{t.title}</CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              {t.subtitle}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheckEmail} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  {t.emailLabel}
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
                {t.checkButton}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}