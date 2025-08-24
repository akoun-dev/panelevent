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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">🌐</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Sélectionnez votre langue / Select your language / Seleccione su idioma / Selecione seu idioma / اختر لغتك
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {languages.map((language) => (
            <Button
              key={language}
              variant="outline"
              className="w-full h-16 justify-start text-lg border-border text-foreground hover:bg-secondary/20 hover:text-foreground"
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