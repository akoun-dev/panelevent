// Script pour vérifier si un email existe dans la base de données
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.log('Variables d\'environnement manquantes');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.log('SUPABASE_SERVICE_ROLE_KEY:', !!serviceRoleKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkEmail(email) {
  console.log(`\n🔍 Recherche de l'email: ${email}`);
  
  // Vérifier dans event_registrations
  const { data: registrations, error } = await supabase
    .from('event_registrations')
    .select('id, email, firstName, lastName, company, position, "eventId", "createdAt"')
    .eq('email', email)
    .order('createdAt', { ascending: false })
    .limit(5);

  if (error) {
    console.error('❌ Erreur:', error);
    return;
  }

  console.log('📊 Résultats dans event_registrations:');
  if (registrations && registrations.length > 0) {
    registrations.forEach((reg, index) => {
      console.log(`\n--- Inscription ${index + 1} ---`);
      console.log('ID:', reg.id);
      console.log('Email:', reg.email);
      console.log('Nom:', reg.firstName, reg.lastName);
      console.log('Entreprise:', reg.company || 'Non spécifié');
      console.log('Poste:', reg.position || 'Non spécifié');
      console.log('Event ID:', reg.eventId);
      console.log('Date:', reg.createdAt);
    });
  } else {
    console.log('❌ Aucune inscription trouvée pour cet email');
  }
  console.log('\nNombre total de résultats:', registrations?.length || 0);
}

// Vérifier l'email spécifique
checkEmail('aboa.akoun40@gmail.com');

// Vérifier aussi avec différentes casse pour être sûr
setTimeout(() => {
  console.log('\n\n🔍 Vérification avec différentes casse:');
  checkEmail('ABOA.AKOUN40@GMAIL.COM');
}, 1000);

setTimeout(() => {
  console.log('\n\n🔍 Vérification avec espace:');
  checkEmail(' aboa.akoun40@gmail.com ');
}, 2000);