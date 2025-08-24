import { supabase } from './src/lib/supabase';

async function updateSessionFlag() {
  const eventId = 'e0a1b494-a342-4fda-8627-ef82b5322f3c';
  const sessionId = '1756025898175';

  console.log('Fetching event data...');
  
  // Récupérer l'événement
  const { data: event, error } = await supabase
    .from('events')
    .select('id, program')
    .eq('id', eventId)
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    return;
  }

  if (!event.program) {
    console.log('No program found for event');
    return;
  }

  // Parser le programme
  const program = typeof event.program === 'string' ? JSON.parse(event.program) : event.program;
  
  console.log('Current program items:', program.programItems.length);
  
  // Trouver et mettre à jour la session
  const sessionIndex = program.programItems.findIndex(item => item.id === sessionId);
  
  if (sessionIndex === -1) {
    console.log('Session not found in program');
    return;
  }

  console.log('Found session:', program.programItems[sessionIndex].title.fr);
  console.log('Current isSession:', program.programItems[sessionIndex].isSession);

  // Mettre à jour le flag isSession
  program.programItems[sessionIndex].isSession = true;
  program.updatedAt = new Date().toISOString();

  console.log('Updated isSession to true');

  // Mettre à jour l'événement dans la base de données
  const { error: updateError } = await supabase
    .from('events')
    .update({ program })
    .eq('id', eventId);

  if (updateError) {
    console.error('Error updating event:', updateError);
    return;
  }

  console.log('Event updated successfully!');
  console.log('Session should now be accessible at:', `/session/${eventId}/${sessionId}/register`);
}

updateSessionFlag().catch(console.error);