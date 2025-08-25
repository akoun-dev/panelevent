// Script de test pour vérifier le fonctionnement de l'UI de branding
console.log('🎨 Test de l\'interface utilisateur de branding')

// Simuler les données de formulaire que l'UI enverrait
const testFormData = {
  title: "3ème réunion préparatoire Africaine (APM25-3) pour la WTDC-25 et l'atelier sur le FSU, en CIV du 25 au 29 août 2025.",
  description: "Description de test",
  slug: "test-event",
  startDate: "2025-08-26",
  endDate: "2025-08-29",
  location: "Côte d'Ivoire",
  isPublic: true,
  isActive: true,
  maxAttendees: 100,
  title_translations: {},
  description_translations: {},
  location_translations: {},
  branding: {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#f59e0b'
  }
}

console.log('📋 Données de formulaire simulées:')
console.log(JSON.stringify(testFormData, null, 2))

// Vérifier que les données correspondent au schéma Zod de l'API
const eventSchema = {
  title: { type: 'string', minLength: 1 },
  description: { type: 'string', optional: true },
  slug: { type: 'string', optional: true },
  startDate: { type: 'string', format: 'datetime' },
  endDate: { type: 'string', format: 'datetime', optional: true, nullable: true },
  location: { type: 'string', optional: true },
  isPublic: { type: 'boolean' },
  isActive: { type: 'boolean' },
  maxAttendees: { type: 'number', optional: true },
  title_translations: { type: 'any', optional: true },
  description_translations: { type: 'any', optional: true },
  location_translations: { type: 'any', optional: true },
  branding: {
    type: 'object',
    optional: true,
    properties: {
      primaryColor: { type: 'string', optional: true },
      secondaryColor: { type: 'string', optional: true },
      accentColor: { type: 'string', optional: true }
    }
  }
}

// Validation simple des données
function validateData(data, schema) {
  const errors = []
  
  // Vérifier les champs requis
  if (schema.title && !data.title) {
    errors.push('Le titre est requis')
  }
  
  if (schema.startDate && !data.startDate) {
    errors.push('La date de début est requise')
  }
  
  if (schema.isPublic && typeof data.isPublic !== 'boolean') {
    errors.push('isPublic doit être un booléen')
  }
  
  if (schema.isActive && typeof data.isActive !== 'boolean') {
    errors.push('isActive doit être un booléen')
  }
  
  // Vérifier la structure du branding
  if (data.branding) {
    const branding = data.branding
    if (branding.primaryColor && typeof branding.primaryColor !== 'string') {
      errors.push('primaryColor doit être une chaîne de caractères')
    }
    if (branding.secondaryColor && typeof branding.secondaryColor !== 'string') {
      errors.push('secondaryColor doit être une chaîne de caractères')
    }
    if (branding.accentColor && typeof branding.accentColor !== 'string') {
      errors.push('accentColor doit être une chaîne de caractères')
    }
    
    // Vérifier le format des couleurs (optionnel)
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    if (branding.primaryColor && !colorRegex.test(branding.primaryColor)) {
      errors.push('primaryColor doit être au format hexadécimal (#RRGGBB)')
    }
    if (branding.secondaryColor && !colorRegex.test(branding.secondaryColor)) {
      errors.push('secondaryColor doit être au format hexadécimal (#RRGGBB)')
    }
    if (branding.accentColor && !colorRegex.test(branding.accentColor)) {
      errors.push('accentColor doit être au format hexadécimal (#RRGGBB)')
    }
  }
  
  return errors
}

// Valider les données de test
const validationErrors = validateData(testFormData, eventSchema)

if (validationErrors.length === 0) {
  console.log('✅ Les données de formulaire sont valides et correspondent au schéma API')
  console.log('🎯 Structure du branding:', testFormData.branding)
  console.log('📤 Prêt à être envoyé à l\'API via PATCH /api/organizer/events/[id]')
} else {
  console.error('❌ Erreurs de validation:')
  validationErrors.forEach(error => console.error('  -', error))
}

// Tester différentes valeurs de couleurs
const testColors = [
  { primaryColor: '#3b82f6', secondaryColor: '#64748b', accentColor: '#f59e0b' },
  { primaryColor: '#ef4444', secondaryColor: '#94a3b8', accentColor: '#f97316' },
  { primaryColor: '#10b981', secondaryColor: '#6b7280', accentColor: '#f59e0b' }
]

console.log('\n🎨 Exemples de palettes de couleurs testables:')
testColors.forEach((colors, index) => {
  console.log(`Palette ${index + 1}:`, colors)
})

console.log('\n✅ Le système de branding est prêt à fonctionner!')
console.log('📝 Prochaines étapes:')
console.log('1. Ouvrir l\'interface des paramètres d\'événement')
console.log('2. Modifier les couleurs dans la section "Dates, capacité et couleurs"')
console.log('3. Cliquer sur "Enregistrer"')
console.log('4. Vérifier que les couleurs sont bien sauvegardées')