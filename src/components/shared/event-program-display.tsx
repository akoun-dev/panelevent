"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, User, FileText, List } from 'lucide-react'

interface ProgramItem {
  id: string
  time: string
  title: string
  description?: string
  speaker?: string
  location?: string
}

interface ProgramData {
  hasProgram: boolean
  programText?: string
  programItems?: ProgramItem[]
}

interface EventProgramDisplayProps {
  program: string | null
}

export function EventProgramDisplay({ program }: EventProgramDisplayProps) {
  if (!program) {
    return null
  }

  let programData: ProgramData

  try {
    programData = JSON.parse(program)
  } catch {
    // Si ce n'est pas du JSON, traiter comme texte simple
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Programme de l'événement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm">{program}</pre>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!programData.hasProgram) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Programme de l'événement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {programData.programText && (
          <div>
            <h4 className="font-semibold mb-3">Description du programme</h4>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm">{programData.programText}</div>
            </div>
          </div>
        )}

        {programData.programItems && programData.programItems.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <List className="w-4 h-4" />
              Déroulement détaillé
            </h4>
            <div className="space-y-4">
              {programData.programItems
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((item) => (
                  <div key={item.id} className="border-l-2 border-primary/20 pl-4 py-2">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.time}
                        </Badge>
                        <h5 className="font-semibold">{item.title}</h5>
                      </div>
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      {item.speaker && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="font-medium">Intervenant:</span>
                          {item.speaker}
                        </div>
                      )}
                      {item.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="font-medium">Lieu:</span>
                          {item.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}