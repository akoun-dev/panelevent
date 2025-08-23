"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Language, getLanguageName, translations } from '@/lib/translations'

interface LanguageSelectorProps {
  onLanguageSelect: (language: Language) => void
}

const languages: Language[] = ['fr', 'en', 'pt', 'es', 'ar']

export function LanguageSelector({ onLanguageSelect }: LanguageSelectorProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">🌐</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {translations.fr.language.select} / {translations.en.language.select} / {translations.es.language.select} / {translations.pt.language.select} / {translations.ar.language.select}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {languages.map((language) => (
            <Button
              key={language}
              variant="outline"
              className="w-full h-16 justify-start text-lg"
              onClick={() => onLanguageSelect(language)}
            >
              <span className="mr-3 text-2xl">
                {language === 'fr' && '🇫🇷'}
                {language === 'en' && '🇬🇧'}
                {language === 'pt' && '🇵🇹'}
                {language === 'es' && '🇪🇸'}
                {language === 'ar' && '🇸🇦'}
              </span>
              {getLanguageName(language)}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}