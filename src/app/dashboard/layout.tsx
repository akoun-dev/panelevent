"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Users, 
  Calendar, 
  MessageSquare, 
  BarChart, 
  Star, 
  Mic, 
  FileText, 
  LogOut 
} from 'lucide-react'

const organizerNavItems = [
  {
    title: 'Tableau de bord',
    href: '/dashboard',
    description: 'Vue d\'ensemble et statistiques'
  },
  {
    title: 'Créer un événement',
    href: '/events/create',
    description: 'Créer un nouvel événement'
  },
  {
    title: 'Mes événements',
    href: '/dashboard/events',
    description: 'Gérer tous mes événements'
  },
  {
    title: 'Participants',
    href: '/dashboard/participants',
    description: 'Gérer les participants'
  },
  {
    title: 'Questions & Réponses',
    href: '/dashboard/qa',
    description: 'Modérer les Q&A'
  },
  {
    title: 'Sondages',
    href: '/dashboard/polls',
    description: 'Gérer les sondages'
  },
  {
    title: 'Certificats',
    href: '/dashboard/certificates',
    description: 'Gérer les certificats'
  },
  {
    title: 'Enregistrements',
    href: '/dashboard/recordings',
    description: 'Gérer les enregistrements audio'
  },
  {
    title: 'Feedbacks',
    href: '/dashboard/feedbacks',
    description: 'Analyser les feedbacks'
  }
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const pathname = usePathname()

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (status === 'unauthenticated' || !session) {
    // Redirect to signin page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/signin'
    }
    return null
  }

  if (session.user?.role !== 'ORGANIZER' && session.user?.role !== 'ADMIN') {
    // Redirect to home page
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
    return null
  }

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Error during sign out:', error)
      toast({
        title: 'Erreur lors de la déconnexion',
        description: 'Veuillez réessayer.',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={cn(
        "border-r bg-gray-50/40 transition-all duration-300",
        isSidebarCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center border-b px-4">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">P</span>
                </div>
                <div>
                  <h1 className="font-semibold text-lg">PanelEvent</h1>
                  <p className="text-xs text-muted-foreground">Organisateur</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={cn(
                "ml-auto p-2 hover:bg-muted rounded-md",
                isSidebarCollapsed && "mx-auto"
              )}
            >
              {isSidebarCollapsed ? (
                <span>›</span>
              ) : (
                <span>‹</span>
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {organizerNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      "hover:bg-muted hover:text-foreground",
                      isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
                      isSidebarCollapsed && "justify-center px-2"
                    )}
                    title={isSidebarCollapsed ? item.title : undefined}
                  >
                    <span className="h-4 w-4">
                      {item.title === 'Tableau de bord' && <Home className="h-4 w-4" />}
                      {item.title === 'Créer un événement' && <Calendar className="h-4 w-4" />}
                      {item.title === 'Mes événements' && <Calendar className="h-4 w-4" />}
                      {item.title === 'Participants' && <Users className="h-4 w-4" />}
                      {item.title === 'Questions & Réponses' && <MessageSquare className="h-4 w-4" />}
                      {item.title === 'Sondages' && <BarChart className="h-4 w-4" />}
                      {item.title === 'Certificats' && <Star className="h-4 w-4" />}
                      {item.title === 'Enregistrements' && <Mic className="h-4 w-4" />}
                      {item.title === 'Feedbacks' && <FileText className="h-4 w-4" />}
                    </span>
                    {!isSidebarCollapsed && (
                      <div className="flex flex-col items-start">
                        <span>{item.title}</span>
                        <span className="text-xs text-muted-foreground font-normal">
                          {item.description}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="border-t p-4">
            <div className={cn(
              "flex items-center gap-3",
              isSidebarCollapsed && "flex-col gap-2"
            )}>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium">
                  {session.user?.name?.charAt(0).toUpperCase() || 'O'}
                </span>
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {session.user?.name || 'Organisateur'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session.user?.email || 'organisateur@example.com'}
                  </p>
                </div>
              )}
              <button
                onClick={handleSignOut}
                title="Déconnexion"
                className={cn(
                  "p-2 hover:bg-muted rounded-md",
                  isSidebarCollapsed && "w-full"
                )}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <main className={cn(
        "flex-1 overflow-auto",
        isSidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  )
}