"use client"

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Palette, Monitor, Sun, Moon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export type Theme = 'system' | 'light' | 'dark' | 'fern' | 'luxor' | 'gold'

const getThemeLabel = (themeValue: string) => {
  switch (themeValue) {
    case 'system':
      return 'Système'
    case 'light':
      return 'Clair'
    case 'dark':
      return 'Sombre'
    case 'fern':
      return 'Vert Forêt'
    case 'luxor':
      return 'Or Luxueux'
    case 'gold':
      return 'Doré Classique'
    default:
      return themeValue
  }
}

export function ThemeSelector() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const getThemeIcon = (themeValue: string) => {
    switch (themeValue) {
      case 'system':
        return <Monitor className="h-4 w-4" />
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'fern':
      case 'luxor':
      case 'gold':
        return <Palette className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }


  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-auto gap-2 border-none bg-transparent shadow-none hover:bg-muted">
              <SelectValue>
                <div className="flex items-center gap-2">
                  {getThemeIcon(theme || 'system')}
                  <span className="hidden sm:inline">
                    {getThemeLabel(theme || 'system')}
                  </span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Système
                </div>
              </SelectItem>
              <SelectItem value="light">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Clair
                </div>
              </SelectItem>
              <SelectItem value="dark">
                <div className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Sombre
                </div>
              </SelectItem>
              <SelectItem value="fern">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Vert Forêt
                </div>
              </SelectItem>
              <SelectItem value="luxor">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Or Luxueux
                </div>
              </SelectItem>
              <SelectItem value="gold">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Doré Classique
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </TooltipTrigger>
        <TooltipContent>
          Changer le thème
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Version compacte pour les sidebars réduites
export function ThemeSelectorCompact() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const getThemeIcon = (themeValue: string) => {
    switch (themeValue) {
      case 'system':
        return <Monitor className="h-4 w-4" />
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'fern':
      case 'luxor':
      case 'gold':
        return <Palette className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const handleThemeChange = () => {
    const themes: Theme[] = ['system', 'light', 'dark', 'fern', 'luxor', 'gold']
    const currentIndex = themes.indexOf(theme as Theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeChange}
            className="h-8 w-8"
          >
            {getThemeIcon(theme || 'system')}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          Changer le thème ({getThemeLabel(theme || 'system')})
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}