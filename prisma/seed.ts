import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Création des données de démonstration...');

  // Création des utilisateurs de démonstration
  console.log('Création des utilisateurs...');
  const demoUsers = {
    admin: {
      email: process.env.ADMIN_EMAIL ?? 'admin@panelevent.com',
      name: 'Administrateur',
      role: 'ADMIN' as const,
    },
    organizer1: {
      email: process.env.ORGANIZER_EMAIL ?? 'organizer@example.com',
      name: 'Organisateur Demo',
      role: 'ORGANIZER' as const,
    },
    organizer2: {
      email: process.env.ORGANIZER2_EMAIL ?? 'organizer2@example.com',
      name: 'Jean Martin',
      role: 'ORGANIZER' as const,
    },
    attendee1: {
      email: process.env.ATTENDEE_EMAIL ?? 'attendee@example.com',
      name: 'Participant Demo',
      role: 'ATTENDEE' as const,
    },
    attendee2: {
      email: process.env.ATTENDEE2_EMAIL ?? 'attendee2@example.com',
      name: 'Sophie Bernard',
      role: 'ATTENDEE' as const,
    },
  };

  const adminUser = await prisma.user.upsert({
    where: { email: demoUsers.admin.email },
    update: {},
    create: demoUsers.admin,
  });

  const organizer1 = await prisma.user.upsert({
    where: { email: demoUsers.organizer1.email },
    update: {},
    create: demoUsers.organizer1,
  });

  const organizer2 = await prisma.user.upsert({
    where: { email: demoUsers.organizer2.email },
    update: {},
    create: demoUsers.organizer2,
  });

  const attendee1 = await prisma.user.upsert({
    where: { email: demoUsers.attendee1.email },
    update: {},
    create: demoUsers.attendee1,
  });

  const attendee2 = await prisma.user.upsert({
    where: { email: demoUsers.attendee2.email },
    update: {},
    create: demoUsers.attendee2,
  });

  console.log('✅ Utilisateurs créés');

  // Création des événements de démonstration
  console.log('Création des événements...');
  const event1 = await prisma.event.upsert({
    where: { slug: 'conference-tech-2024' },
    update: {},
    create: {
      title: 'Conférence Tech 2024',
      description: 'La plus grande conférence technologique de l\'année',
      slug: 'conference-tech-2024',
      startDate: new Date('2024-06-15T09:00:00'),
      endDate: new Date('2024-06-15T18:00:00'),
      location: 'Paris Expo Porte de Versailles',
      isPublic: true,
      isActive: true,
      maxAttendees: 500,
      organizerId: organizer1.id,
      program: JSON.stringify([
        {
          time: '09:00',
          title: 'Accueil et café',
          description: 'Enregistrement des participants et petit-déjeuner'
        },
        {
          time: '10:00',
          title: 'Keynote: L\'avenir de l\'IA',
          description: 'Présentation par Dr. Sarah Johnson'
        },
        {
          time: '11:00',
          title: 'Atelier: Développement Web Moderne',
          description: 'Techniques et meilleures pratiques'
        },
        {
          time: '12:30',
          title: 'Déjeuner',
          description: 'Réseau et repas'
        },
        {
          time: '14:00',
          title: 'Panel: Startup et Innovation',
          description: 'Discussion avec des fondateurs de startups'
        },
        {
          time: '16:00',
          title: 'Atelier: Sécurité Web',
          description: 'Meilleures pratiques de sécurité'
        },
        {
          time: '17:00',
          title: 'Clôture et cocktail',
          description: 'Réseautage et célébration'
        }
      ]),
      branding: JSON.stringify({
        primaryColor: '#3b82f6',
        secondaryColor: '#1e40af',
        logo: '/logo-tech-2024.png'
      })
    },
  });

  const event2 = await prisma.event.upsert({
    where: { slug: 'sommet-marketing-2024' },
    update: {},
    create: {
      title: 'Sommet Marketing Digital',
      description: 'Stratégies marketing pour l\'ère numérique',
      slug: 'sommet-marketing-2024',
      startDate: new Date('2024-07-20T10:00:00'),
      endDate: new Date('2024-07-20T17:00:00'),
      location: 'Lyon Convention Center',
      isPublic: true,
      isActive: true,
      maxAttendees: 300,
      organizerId: organizer2.id,
      program: JSON.stringify([
        {
          time: '10:00',
          title: 'Bienvenue et introduction',
          description: 'Ouverture du sommet'
        },
        {
          time: '10:30',
          title: 'Tendances Marketing 2024',
          description: 'Analyse des dernières tendances'
        },
        {
          time: '11:30',
          title: 'Social Media Strategy',
          description: 'Stratégies pour les réseaux sociaux'
        },
        {
          time: '12:30',
          title: 'Déjeuner',
          description: 'Repas et networking'
        },
        {
          time: '14:00',
          title: 'Content Marketing',
          description: 'Créer du contenu engageant'
        },
        {
          time: '15:30',
          title: 'Analytics et ROI',
          description: 'Mesurer l\'efficacité marketing'
        },
        {
          time: '16:30',
          title: 'Clôture',
          description: 'Conclusion et prochaines étapes'
        }
      ]),
      branding: JSON.stringify({
        primaryColor: '#10b981',
        secondaryColor: '#059669',
        logo: '/logo-marketing.png'
      })
    },
  });

  const event3 = await prisma.event.upsert({
    where: { slug: 'workshop-design-2024' },
    update: {},
    create: {
      title: 'Workshop Design UX/UI',
      description: 'Apprenez les principes fondamentaux du design',
      slug: 'workshop-design-2024',
      startDate: new Date('2024-08-10T14:00:00'),
      endDate: new Date('2024-08-10T18:00:00'),
      location: 'Marseille Design Center',
      isPublic: true,
      isActive: false,
      maxAttendees: 50,
      organizerId: organizer1.id,
      program: JSON.stringify([
        {
          time: '14:00',
          title: 'Introduction au Design Thinking',
          description: 'Principes et méthodologie'
        },
        {
          time: '15:00',
          title: 'Atelier Pratique: Wireframing',
          description: 'Exercice de création de wireframes'
        },
        {
          time: '16:00',
          title: 'Pause café',
          description: 'Réseautage'
        },
        {
          time: '16:30',
          title: 'Prototypage',
          description: 'Création de prototypes interactifs'
        },
        {
          time: '17:30',
          title: 'Présentation des projets',
          description: 'Retour et feedback'
        }
      ]),
      branding: JSON.stringify({
        primaryColor: '#f59e0b',
        secondaryColor: '#d97706',
        logo: '/logo-design.png'
      })
    },
  });

  console.log('✅ Événements créés');

  // Suppression des données existantes liées aux événements pour éviter les conflits
  console.log('Nettoyage des données existantes...');
  await prisma.pollResponse.deleteMany({
    where: {
      poll: {
        eventId: {
          in: [event1.id, event2.id, event3.id]
        }
      }
    }
  });
  
  await prisma.pollOption.deleteMany({
    where: {
      poll: {
        eventId: {
          in: [event1.id, event2.id, event3.id]
        }
      }
    }
  });
  
  await prisma.poll.deleteMany({
    where: {
      eventId: {
        in: [event1.id, event2.id, event3.id]
      }
    }
  });
  
  await prisma.question.deleteMany({
    where: {
      eventId: {
        in: [event1.id, event2.id, event3.id]
      }
    }
  });
  
  await prisma.panel.deleteMany({
    where: {
      eventId: {
        in: [event1.id, event2.id, event3.id]
      }
    }
  });
  
  await prisma.eventRegistration.deleteMany({
    where: {
      eventId: {
        in: [event1.id, event2.id, event3.id]
      }
    }
  });
  
  await prisma.certificate.deleteMany({
    where: {
      eventId: {
        in: [event1.id, event2.id, event3.id]
      }
    }
  });
  
  await prisma.feedback.deleteMany({
    where: {
      eventId: {
        in: [event1.id, event2.id, event3.id]
      }
    }
  });

  console.log('✅ Nettoyage terminé');

  // Génération des QR codes pour les événements
  console.log('Génération des QR codes...');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  for (const event of [event1, event2, event3]) {
    const qrCodeData = `${baseUrl}/register?event=${event.slug}`;
    const qrCode = await QRCode.toDataURL(qrCodeData);
    
    await prisma.event.update({
      where: { id: event.id },
      data: { qrCode }
    });
  }

  console.log('✅ QR codes générés');

  // Création des inscriptions de démonstration
  console.log('Création des inscriptions...');
  
  // Inscriptions pour l'événement 1
  await prisma.eventRegistration.createMany({
    data: [
      {
        email: 'sophie.bernard@email.com',
        firstName: 'Sophie',
        lastName: 'Bernard',
        phone: '+33612345678',
        company: 'TechCorp',
        position: 'Développeuse Senior',
        experience: '5+ ans',
        expectations: 'Apprendre les dernières technologies',
        dietaryRestrictions: 'Végétarienne',
        consent: true,
        eventId: event1.id,
        userId: attendee1.id,
      },
      {
        email: 'pierre.laurent@email.com',
        firstName: 'Pierre',
        lastName: 'Laurent',
        phone: '+33687654321',
        company: 'InnovateLab',
        position: 'CTO',
        experience: '10+ ans',
        expectations: 'Networking et innovation',
        dietaryRestrictions: 'Aucune',
        consent: true,
        eventId: event1.id,
        userId: attendee2.id,
      },
      {
        email: 'marie.dubois@email.com',
        firstName: 'Marie',
        lastName: 'Dubois',
        phone: '+33611223344',
        company: 'StartupXYZ',
        position: 'Product Manager',
        experience: '3 ans',
        expectations: 'Découvrir de nouveaux outils',
        dietaryRestrictions: 'Sans gluten',
        consent: true,
        eventId: event1.id,
        isPublic: true,
      },
      {
        email: 'luc.martin@email.com',
        firstName: 'Luc',
        lastName: 'Martin',
        phone: '+33655443322',
        company: 'DevStudio',
        position: 'Designer UX',
        experience: '4 ans',
        expectations: 'Design et innovation',
        dietaryRestrictions: 'Aucune',
        consent: true,
        eventId: event1.id,
        isPublic: true,
      },
    ],
  });

  // Inscriptions pour l'événement 2
  await prisma.eventRegistration.createMany({
    data: [
      {
        email: 'sophie.bernard@email.com',
        firstName: 'Sophie',
        lastName: 'Bernard',
        phone: '+33612345678',
        company: 'TechCorp',
        position: 'Développeuse Senior',
        experience: '5+ ans',
        expectations: 'Marketing digital',
        dietaryRestrictions: 'Végétarienne',
        consent: true,
        eventId: event2.id,
        userId: attendee1.id,
      },
      {
        email: 'camille.petit@email.com',
        firstName: 'Camille',
        lastName: 'Petit',
        phone: '+33699887766',
        company: 'MarketPro',
        position: 'Marketing Manager',
        experience: '7 ans',
        expectations: 'Stratégies réseaux sociaux',
        dietaryRestrictions: 'Aucune',
        consent: true,
        eventId: event2.id,
        isPublic: true,
      },
    ],
  });

  // Inscription pour l'événement 3
  await prisma.eventRegistration.create({
    data: {
      email: 'pierre.laurent@email.com',
      firstName: 'Pierre',
      lastName: 'Laurent',
      phone: '+33687654321',
      company: 'InnovateLab',
      position: 'CTO',
      experience: '10+ ans',
      expectations: 'Apprendre le design',
      dietaryRestrictions: 'Aucune',
      consent: true,
      eventId: event3.id,
      userId: attendee1.id,
    },
  });

  console.log('✅ Inscriptions créées');

  // Création de panels pour l'événement 1
  console.log('Création des panels...');
  await prisma.panel.createMany({
    data: [
      {
        title: 'Keynote: L\'avenir de l\'IA',
        description: 'Présentation par Dr. Sarah Johnson sur les dernières avancées en intelligence artificielle',
        startTime: new Date('2024-06-15T10:00:00'),
        endTime: new Date('2024-06-15T11:00:00'),
        speaker: 'Dr. Sarah Johnson',
        location: 'Amphithéâtre Principal',
        order: 1,
        isActive: true,
        eventId: event1.id,
      },
      {
        title: 'Atelier: Développement Web Moderne',
        description: 'Techniques et meilleures pratiques pour le développement web moderne',
        startTime: new Date('2024-06-15T11:00:00'),
        endTime: new Date('2024-06-15T12:30:00'),
        speaker: 'Thomas Dubois',
        location: 'Salle B',
        order: 2,
        isActive: true,
        eventId: event1.id,
      },
      {
        title: 'Panel: Startup et Innovation',
        description: 'Discussion avec des fondateurs de startups sur l\'innovation et l\'entrepreneuriat',
        startTime: new Date('2024-06-15T14:00:00'),
        endTime: new Date('2024-06-15T15:30:00'),
        speaker: 'Panel de fondateurs',
        location: 'Amphithéâtre Principal',
        order: 3,
        isActive: true,
        eventId: event1.id,
      },
    ],
  });

  console.log('✅ Panels créés');

  // Création de questions de démonstration
  console.log('Création des questions...');
  await prisma.question.createMany({
    data: [
      {
        content: 'Quelles sont les limites éthiques de l\'IA générative ?',
        status: 'APPROVED',
        votes: 15,
        userId: attendee1.id,
        eventId: event1.id,
        panelId: (await prisma.panel.findFirst({ where: { eventId: event1.id, order: 1 } }))?.id,
      },
      {
        content: 'Comment choisir entre React, Vue et Angular pour un nouveau projet ?',
        status: 'APPROVED',
        votes: 8,
        userId: attendee1.id,
        eventId: event1.id,
        panelId: (await prisma.panel.findFirst({ where: { eventId: event1.id, order: 2 } }))?.id,
      },
      {
        content: 'Quels sont les financements disponibles pour les startups tech en France ?',
        status: 'PENDING',
        votes: 12,
        userId: attendee1.id,
        eventId: event1.id,
        panelId: (await prisma.panel.findFirst({ where: { eventId: event1.id, order: 3 } }))?.id,
      },
      {
        content: 'Comment mesurer le ROI d\'une campagne marketing digital ?',
        status: 'APPROVED',
        votes: 6,
        userId: attendee1.id,
        eventId: event2.id,
      },
    ],
  });

  console.log('✅ Questions créées');

  // Création de sondages pour l'événement 1
  console.log('Création des sondages...');
  const poll1 = await prisma.poll.create({
    data: {
      title: 'Quel framework préférez-vous ?',
      description: 'Votez pour votre framework de développement web préféré',
      isActive: true,
      showResults: true,
      eventId: event1.id,
      options: {
        create: [
          { text: 'React', order: 1 },
          { text: 'Vue.js', order: 2 },
          { text: 'Angular', order: 3 },
          { text: 'Svelte', order: 4 },
        ],
      },
    },
  });

  const poll2 = await prisma.poll.create({
    data: {
      title: 'Quel est votre plus grand défi en développement ?',
      description: 'Partagez vos principaux défis au quotidien',
      isActive: false,
      showResults: false,
      eventId: event1.id,
      options: {
        create: [
          { text: 'Gestion du temps', order: 1 },
          { text: 'Apprentissage continu', order: 2 },
          { text: 'Collaboration en équipe', order: 3 },
          { text: 'Maintenance du code', order: 4 },
        ],
      },
    },
  });

  console.log('✅ Sondages créés');

  // Création de réponses aux sondages
  console.log('Création des réponses aux sondages...');
  await prisma.pollResponse.createMany({
    data: [
      {
        userId: attendee1.id,
        pollId: poll1.id,
        optionId: (await prisma.pollOption.findFirst({ where: { pollId: poll1.id, order: 1 } }))?.id || '',
      },
      {
        userId: attendee2.id,
        pollId: poll1.id,
        optionId: (await prisma.pollOption.findFirst({ where: { pollId: poll1.id, order: 2 } }))?.id || '',
      },
    ],
  });

  console.log('✅ Réponses aux sondages créées');

  // Création de certificats pour les participants
  console.log('Création des certificats...');
  await prisma.certificate.createMany({
    data: [
      {
        qrCode: 'CERT-001-CONF-TECH-2024',
        userId: attendee1.id,
        eventId: event1.id,
        metadata: JSON.stringify({
          issuedDate: '2024-06-15',
          certificateType: 'Participation',
          hours: 8,
        }),
      },
      {
        qrCode: 'CERT-002-CONF-TECH-2024',
        userId: attendee2.id,
        eventId: event1.id,
        metadata: JSON.stringify({
          issuedDate: '2024-06-15',
          certificateType: 'Participation',
          hours: 8,
        }),
      },
    ],
  });

  console.log('✅ Certificats créés');

  // Création de feedbacks
  console.log('Création des feedbacks...');
  await prisma.feedback.createMany({
    data: [
      {
        rating: 5,
        comment: 'Excellente conférence ! Très bien organisée et contenu pertinent.',
        userId: attendee1.id,
        eventId: event1.id,
      },
      {
        rating: 4,
        comment: 'Très bon événement, quelques problèmes de son dans certaines salles.',
        userId: attendee2.id,
        eventId: event1.id,
      },
      {
        rating: 5,
        comment: 'Parfait ! J\'ai appris beaucoup de choses.',
        userId: attendee1.id,
        eventId: event2.id,
      },
    ],
  });

  console.log('✅ Feedbacks créés');

  console.log('🎉 Données de démonstration créées avec succès !');
  console.log('\n📊 Résumé:');
  console.log(`- Utilisateurs: 5 (1 admin, 2 organisateurs, 2 participants)`);
  console.log(`- Événements: 3`);
  console.log(`- Inscriptions: 7`);
  console.log(`- Panels: 3`);
  console.log(`- Questions: 4`);
  console.log(`- Sondages: 2`);
  console.log(`- Certificats: 2`);
  console.log(`- Feedbacks: 3`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors de la création des données de démonstration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });