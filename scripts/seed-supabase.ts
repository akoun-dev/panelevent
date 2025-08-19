import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  // Insert demo users
  const { data: users, error: userError } = await supabase
    .from('users')
    .insert([
      { email: 'admin@panelevent.com', name: 'Administrateur', role: 'ADMIN' },
      { email: 'organizer@example.com', name: 'Organisateur Demo', role: 'ORGANIZER' },
      { email: 'attendee@example.com', name: 'Participant Demo', role: 'ATTENDEE' },
      { email: 'attendee2@example.com', name: 'Sophie Bernard', role: 'ATTENDEE' }
    ])
    .select();
  if (userError) throw userError;

  const organizer = users.find(u => u.role === 'ORGANIZER');
  const attendee1 = users.find(u => u.email === 'attendee@example.com');
  const attendee2 = users.find(u => u.email === 'attendee2@example.com');

  // Create demo event
  const { data: eventData, error: eventError } = await supabase
    .from('events')
    .insert({
      title: 'Conférence Tech 2024',
      description: 'La plus grande conférence technologique de l\'année',
      slug: 'conference-tech-2024',
      startDate: '2024-06-15T09:00:00.000Z',
      endDate: '2024-06-15T18:00:00.000Z',
      location: 'Paris Expo Porte de Versailles',
      isPublic: true,
      isActive: true,
      maxAttendees: 500,
      organizerId: organizer?.id
    })
    .select()
    .single();
  if (eventError) throw eventError;
  const event = eventData;

  // Create panels
  const { data: panels, error: panelError } = await supabase
    .from('panels')
    .insert([
      {
        title: 'Keynote: L\'avenir de l\'IA',
        description: 'Présentation sur les dernières avancées en intelligence artificielle',
        startTime: '2024-06-15T10:00:00.000Z',
        endTime: '2024-06-15T11:00:00.000Z',
        speaker: 'Dr. Sarah Johnson',
        location: 'Amphithéâtre Principal',
        order: 1,
        isActive: true,
        eventId: event.id
      },
      {
        title: 'Atelier: Développement Web Moderne',
        description: 'Techniques et meilleures pratiques pour le développement web moderne',
        startTime: '2024-06-15T11:00:00.000Z',
        endTime: '2024-06-15T12:30:00.000Z',
        speaker: 'Thomas Dubois',
        location: 'Salle B',
        order: 2,
        isActive: true,
        eventId: event.id
      }
    ])
    .select();
  if (panelError) throw panelError;

  // Create poll for first panel
  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert({
      question: 'Quel framework préférez-vous ?',
      description: 'Votez pour votre framework de développement web préféré',
      isActive: true,
      isAnonymous: false,
      allowMultipleVotes: false,
      eventId: event.id,
      panelId: panels[0].id
    })
    .select()
    .single();
  if (pollError) throw pollError;

  // Create poll options
  const { error: optionsError } = await supabase
    .from('poll_options')
    .insert([
      { pollId: poll.id, text: 'React', order: 1 },
      { pollId: poll.id, text: 'Vue.js', order: 2 },
      { pollId: poll.id, text: 'Angular', order: 3 }
    ]);
  if (optionsError) throw optionsError;

  // Create certificate template
  const { data: template, error: templateError } = await supabase
    .from('certificate_templates')
    .insert({
      title: 'Certificat de Participation',
      description: 'Certificat standard pour les participants',
      content: '<h1>Certificat de Participation</h1><p>Félicitations pour votre participation !</p>',
      autoGenerate: true,
      eventId: event.id,
      userId: organizer?.id
    })
    .select()
    .single();
  if (templateError) throw templateError;

  // Create certificates for attendees
  const cert1 = 'CERT-001-CONF-TECH-2024';
  const cert2 = 'CERT-002-CONF-TECH-2024';
  const qr1 = await QRCode.toDataURL(cert1);
  const qr2 = await QRCode.toDataURL(cert2);

  const { error: certError } = await supabase
    .from('certificates')
    .insert([
      {
        content: template.content,
        certificateUrl: `https://example.com/certificates/${cert1}`,
        qrCodeUrl: qr1,
        userId: attendee1?.id,
        eventId: event.id,
        templateId: template.id
      },
      {
        content: template.content,
        certificateUrl: `https://example.com/certificates/${cert2}`,
        qrCodeUrl: qr2,
        userId: attendee2?.id,
        eventId: event.id,
        templateId: template.id
      }
    ]);
  if (certError) throw certError;

  console.log('🌱 Données de démonstration insérées avec succès');
}

main().catch((err) => {
  console.error('Erreur lors de la création des données de démonstration:', err);
  process.exit(1);
});
