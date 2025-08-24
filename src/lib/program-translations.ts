export type Language = 'fr' | 'en' | 'pt' | 'es' | 'ar';

export interface TranslatedProgramItem {
  id: string
  time: string
  title: Record<Language, string>
  description?: Record<Language, string | undefined>
  speaker?: Record<Language, string | undefined>
  location?: Record<Language, string | undefined>
  type?: 'conference' | 'workshop' | 'networking' | 'break' | 'ceremony'
  isSession?: boolean
}

export interface ProgramData {
  hasProgram: boolean
  programItems?: TranslatedProgramItem[]
  updatedAt?: string
}

// Fonction pour obtenir la traduction d'un champ selon la langue
export function getTranslatedField<T extends Record<Language, string | undefined>>(
  field: T | undefined,
  language: Language,
  fallback: string = ''
): string {
  if (!field) return fallback;
  return field[language] || field.fr || fallback; // Fallback sur français si la traduction n'existe pas
}

// Fonction pour convertir l'ancien format au nouveau format multilingue
export function convertToMultilingualProgram(
  oldProgramItems: Array<{
    id: string
    time: string
    title: string
    description?: string
    speaker?: string
    location?: string
  }>,
  defaultLanguage: Language = 'fr'
): TranslatedProgramItem[] {
  return oldProgramItems.map(item => ({
    id: item.id,
    time: item.time,
    title: {
      fr: item.title,
      en: item.title, // Conserver la même valeur par défaut
      pt: item.title,
      es: item.title,
      ar: item.title
    },
    description: item.description ? {
      fr: item.description,
      en: item.description,
      pt: item.description,
      es: item.description,
      ar: item.description
    } : undefined,
    speaker: item.speaker ? {
      fr: item.speaker,
      en: item.speaker,
      pt: item.speaker,
      es: item.speaker,
      ar: item.speaker
    } : undefined,
    location: item.location ? {
      fr: item.location,
      en: item.location,
      pt: item.location,
      es: item.location,
      ar: item.location
    } : undefined
  }));
}

// Fonction pour obtenir un programme dans une langue spécifique (format compatible avec l'ancien système)
export function getProgramForLanguage(
  programData: ProgramData | null,
  language: Language
): {
  hasProgram: boolean
  programItems?: Array<{
    id: string
    time: string
    title: string
    description?: string
    speaker?: string
    location?: string
    type?: 'conference' | 'workshop' | 'networking' | 'break' | 'ceremony'
  }>
  updatedAt?: string
} {
  if (!programData || !programData.hasProgram || !programData.programItems) {
    return { hasProgram: false };
  }

  return {
    hasProgram: true,
    programItems: programData.programItems.map(item => ({
      id: item.id,
      time: item.time,
      title: getTranslatedField(item.title, language),
      description: getTranslatedField(item.description, language),
      speaker: getTranslatedField(item.speaker, language),
      location: getTranslatedField(item.location, language),
      type: item.type
    })),
    updatedAt: programData.updatedAt
  };
}