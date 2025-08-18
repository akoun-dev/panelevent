"use client"

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function TestAuthSimple() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const handleLogin = async (email: string, password: string) => {
    setLoading(true)
    setResult('')
    
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false
      })
      
      setResult(JSON.stringify(res, null, 2))
    } catch (error) {
      setResult('Error: ' + error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Test d'authentification simple</h1>
      
      <div className="space-y-4">
        <button
          onClick={() => handleLogin('admin@panelevent.com', 'admin123')}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Chargement...' : 'Se connecter en tant qu\'admin'}
        </button>
        
        <button
          onClick={() => handleLogin('organizer@example.com', 'demo123')}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Chargement...' : 'Se connecter en tant qu\'organisateur'}
        </button>
        
        <div className="mt-4">
          <h3 className="font-bold">Résultat :</h3>
          <pre className="bg-gray-100 p-4 rounded mt-2">{result}</pre>
        </div>
      </div>
    </div>
  )
}