"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
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
  Download, 
  Settings,
  LogOut 
} from 'lucide-react'

const adminNavItems = [
  {
    title: 'Tableau de bord',
    href: '/admin',
    description: 'Vue d\'ensemble et statistiques'
  },
  {
    title: 'Gestion des utilisateurs',
    href: '/admin/users',
    description: 'Gérer les comptes utilisateurs'
  },
  {
    title: 'Gestion des événements',
    href: '/admin/events',
    description: 'Administrer tous les événements'
  },
  {
    title: 'Questions & Réponses',
    href: '/admin/qa',
    description: 'Modérer les Q&A'
  },
  {
    title: 'Sondages',
    href: '/admin/polls',
    description: 'Gérer les sondages'
  },
  {
    title: 'Certificats',
    href: '/admin/certificates',
    description: 'Gérer les certificats'
  },
  {
    title: 'Enregistrements',
    href: '/admin/recordings',
    description: 'Gérer les enregistrements audio'
  },
  {
    title: 'Feedbacks',
    href: '/admin/feedbacks',
    description: 'Analyser les feedbacks'
  },
  {
    title: 'Exports',
    href: '/admin/export',
    description: 'Exporter des données et rapports'
  },
  {
    title: 'Paramètres',
    href: '/admin/settings',
    description: 'Configuration du système'
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      // Manually delete NextAuth cookies
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.trim().split('=')
        if (name.includes('next-auth')) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
        }
      })
      
      // Call NextAuth sign out
      await signOut({ callbackUrl: '/' })
      
      // Force page reload
      window.location.href = '/'
    } catch (error) {
      console.error('Error during sign out:', error)
      // Fallback: force redirect to home page
      window.location.href = '/'
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
                  <p className="text-xs text-muted-foreground">Admin</p>
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
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href

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
                      {item.title === 'Gestion des utilisateurs' && <Users className="h-4 w-4" />}
                      {item.title === 'Gestion des événements' && <Calendar className="h-4 w-4" />}
                      {item.title === 'Questions & Réponses' && <MessageSquare className="h-4 w-4" />}
                      {item.title === 'Sondages' && <BarChart className="h-4 w-4" />}
                      {item.title === 'Certificats' && <Star className="h-4 w-4" />}
                      {item.title === 'Enregistrements' && <Mic className="h-4 w-4" />}
                      {item.title === 'Feedbacks' && <FileText className="h-4 w-4" />}
                      {item.title === 'Exports' && <Download className="h-4 w-4" />}
                      {item.title === 'Paramètres' && <Settings className="h-4 w-4" />}
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
                  A
                </span>
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    Admin
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session?.user?.email}
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