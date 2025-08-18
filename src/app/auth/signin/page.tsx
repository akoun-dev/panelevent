"use client"

import { useState, useEffect } from 'react'
import { signIn, getCsrfToken } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [csrfToken, setCsrfToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const token = await getCsrfToken()
      setCsrfToken(token ?? '')
    }
    fetchCsrfToken()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('Attempting sign in with:', { email, password })
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      console.log('Sign in result:', result)

      if (result?.error) {
        console.error('Sign in error:', result.error)
        setError('Identifiants invalides')
      } else {
        console.log('Sign in successful, checking session...')
        
        // Récupérer la session pour déterminer le rôle
        setTimeout(async () => {
          try {
            const sessionResponse = await fetch('/api/auth/session')
            const sessionData = await sessionResponse.json()
            
            console.log('Session data after login:', sessionData)
            
            if (sessionData.user) {
              // Redirection basée sur le rôle
              switch (sessionData.user.role) {
                case 'ADMIN':
                  console.log('Redirecting admin to /admin')
                  window.location.href = '/admin'
                  break
                case 'ORGANIZER':
                  console.log('Redirecting organizer to /dashboard')
                  window.location.href = '/dashboard'
                  break
                case 'ATTENDEE':
                default:
                  console.log('Redirecting attendee to /')
                  window.location.href = '/'
                  break
              }
            } else {
              console.error('No user in session after login')
              setError('Erreur lors de la connexion')
            }
          } catch (error) {
            console.error('Error fetching session:', error)
            setError('Erreur lors de la connexion')
          }
        }, 500) // Petit délai pour s'assurer que la session est bien établie
      }
    } catch (error) {
      console.error('Sign in exception:', error)
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (role: 'ORGANIZER' | 'ATTENDEE') => {
    const demoUsers = {
      ORGANIZER: { email: 'organizer@example.com', password: 'demo123' },
      ATTENDEE: { email: 'attendee@example.com', password: 'demo123' }
    }

    const user = demoUsers[role]
    setEmail(user.email)
    setPassword(user.password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Connexion</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte PanelEvent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-3">Comptes de démonstration :</p>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleDemoLogin('ORGANIZER')}
              >
                Organisateur - organizer@example.com
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => handleDemoLogin('ATTENDEE')}
              >
                Participant - attendee@example.com
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Note: Seul l'administrateur peut créer de nouveaux comptes organisateurs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}