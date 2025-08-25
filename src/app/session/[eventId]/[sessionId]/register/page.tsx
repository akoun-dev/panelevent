import { supabase } from '@/lib/supabase';
import { SessionRegistrationForm } from '@/components/shared/session-registration-form';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PageProps {
  params: Promise<{ eventId: string; sessionId: string }>;
}

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

interface PageProps {
  params: Promise<{ eventId: string; sessionId: string }>;
  searchParams: Promise<SearchParams>;
}

export default async function SessionRegistrationPage({ params, searchParams }: PageProps) {
  const { eventId, sessionId } = await params;
  const resolvedSearchParams = await searchParams;
  const email = resolvedSearchParams.email as string | undefined;
  const firstName = resolvedSearchParams.firstName as string | undefined;
  const lastName = resolvedSearchParams.lastName as string | undefined;
  const userFunction = resolvedSearchParams.function as string | undefined;
  const organization = resolvedSearchParams.organization as string | undefined;
  const language = resolvedSearchParams.language as string | undefined;
  
  console.log('Session registration page called with:', {
    eventId,
    sessionId,
    email,
    firstName,
    lastName,
    userFunction,
    organization,
    language
  });

  // Récupérer tous les événements pour trouver celui qui contient la session
  console.log('Fetching events from Supabase...');
  const { data: events, error } = await supabase
    .from('events')
    .select('id, title, program')
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Supabase error:', error);
    notFound();
  }

  console.log('Supabase response:', { events, error });

  if (!events || events.length === 0) {
    console.log('No events found');
    notFound();
  }

  console.log(`Found ${events.length} events`);

  // Chercher la session dans tous les événements
  let session: any = null;
  let event: any = null;

  for (const evt of events) {
    console.log(`Checking event: ${evt.id}, title: ${evt.title}`);
    if (evt.program) {
      try {
        const program = typeof evt.program === 'string' ? JSON.parse(evt.program) : evt.program;
        console.log(`Event ${evt.id} has program with ${program.programItems?.length || 0} items`);
        
        const foundSession = program.programItems?.find((item: any) => {
          console.log(`Checking item: ${item.id} (isSession: ${item.isSession}), looking for: ${sessionId}`);
          return item.id === sessionId && item.isSession;
        });
        
        if (foundSession) {
          console.log('Found session:', foundSession);
          session = foundSession;
          event = evt;
          break;
        }
      } catch (error) {
        console.error('Error parsing program for event:', evt.id, error);
      }
    } else {
      console.log(`Event ${evt.id} has no program`);
    }
  }

  if (!session || !event) {
    console.log('Session not found in any event');
    notFound();
  }

  console.log('Session found, rendering registration form');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full">
          <CardContent>
            <SessionRegistrationForm
              sessionId={sessionId}
              eventId={eventId}
              sessionTitle={session.title?.fr || session.title?.en || 'Session'}
              prefillData={{
                email: email || '',
                firstName: firstName || '',
                lastName: lastName || '',
                function: userFunction || '',
                organization: organization || '',
                language: language || 'fr'
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}