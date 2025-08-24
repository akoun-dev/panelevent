'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Vote, BarChart3, Users, Clock } from 'lucide-react'

interface PollOption {
  id: string
  text: string
  votes: number
  percentage: number
}

interface Poll {
  id: string
  question: string
  description: string | null
  isActive: boolean
  isAnonymous: boolean
  allowMultipleVotes: boolean
  totalVotes: number
  options: PollOption[]
  event: {
    id: string
    title: string
  }
  createdAt: string
  updatedAt: string
  eventId: string
}

export default function PollPage() {
  const params = useParams()
  const pollId = params.id as string
  
  const [poll, setPoll] = useState<Poll | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [voted, setVoted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/polls/${pollId}`)
        
        if (!response.ok) {
          throw new Error('Poll not found')
        }
        
        const pollData = await response.json()
        console.log('Poll data received:', pollData)
        console.log('Poll is active:', pollData.is_active)
        console.log('Poll options:', pollData.options)
        setPoll(pollData)
        
        // Vérifier si l'utilisateur a déjà voté (stocké dans localStorage)
        const hasVoted = localStorage.getItem(`poll_${pollId}_voted`)
        console.log('Has voted in localStorage:', hasVoted)
        if (hasVoted) {
          setVoted(true)
          const savedVotes = localStorage.getItem(`poll_${pollId}_votes`)
          if (savedVotes) {
            setSelectedOptions(JSON.parse(savedVotes))
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load poll')
      } finally {
        setLoading(false)
      }
    }

    fetchPoll()
  }, [pollId])

  const handleVote = async () => {
    if (selectedOptions.length === 0 || !poll) return
    
    try {
      setSubmitting(true)
      
      // Générer un ID utilisateur unique pour ce vote (anonyme ou non)
      const userId = poll.isAnonymous
        ? `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        : 'user_' + Math.random().toString(36).substr(2, 9)
      
      const response = await fetch(`/api/polls/${pollId}/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          optionIds: selectedOptions,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit vote')
      }
      
      const updatedPoll = await response.json()
      setPoll(updatedPoll)
      setVoted(true)
      
      // Stocker le vote dans localStorage
      localStorage.setItem(`poll_${pollId}_voted`, 'true')
      localStorage.setItem(`poll_${pollId}_votes`, JSON.stringify(selectedOptions))
      localStorage.setItem(`poll_${pollId}_userId`, userId)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit vote')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleOption = (optionId: string) => {
    if (voted) return
    
    if (poll?.allowMultipleVotes) {
      setSelectedOptions(prev =>
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      )
    } else {
      setSelectedOptions([optionId])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9f8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#517324] mx-auto"></div>
          <p className="mt-4 text-[#6e9556]">Chargement du sondage...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f9f8] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#d1b73a] text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-[#2f4104] mb-2">Erreur</h1>
          <p className="text-[#6e9556]">{error}</p>
        </div>
      </div>
    )
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-[#f8f9f8] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#2f4104] mb-2">Sondage non trouvé</h1>
          <p className="text-[#6e9556]">Le sondage que vous recherchez n'existe pas ou a été supprimé.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9f8] to-[#e8efe8] py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg border border-[#a8be6c]/20 p-6">
          {/* En-tête */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#2f4104] mb-3">{poll.question}</h1>
            {poll.description && (
              <p className="text-[#6e9556] mb-4">{poll.description}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-[#809c46]">
              <div className="flex items-center gap-1 bg-[#f0f5e8] px-3 py-1 rounded-full">
                <Users size={14} />
                <span>{poll.totalVotes} vote{poll.totalVotes !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-1 bg-[#f0f5e8] px-3 py-1 rounded-full">
                <Clock size={14} />
                <span>{poll.isActive ? 'Actif' : 'Fermé'}</span>
              </div>
              {poll.isAnonymous && (
                <div className="flex items-center gap-1 bg-[#f0f5e8] px-3 py-1 rounded-full">
                  <span className="text-xs">🔒 Anonyme</span>
                </div>
              )}
            </div>
          </div>

          {/* Options de vote */}
          {!voted && poll.isActive && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {poll.allowMultipleVotes ? 'Sélectionnez une ou plusieurs options' : 'Choisissez une option'}
              </h2>
              
              <div className="space-y-3">
                {poll.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleOption(option.id)}
                    disabled={submitting}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedOptions.includes(option.id)
                        ? 'border-[#517324] bg-[#f0f5e8] text-[#2f4104] shadow-md'
                        : 'border-[#a8be6c]/30 bg-white text-[#2f4104] hover:border-[#809c46] hover:shadow-sm'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.text}</span>
                      {selectedOptions.includes(option.id) && (
                        <div className="w-5 h-5 bg-[#517324] rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleVote}
                disabled={selectedOptions.length === 0 || submitting}
                className="w-full mt-4 bg-gradient-to-r from-[#517324] to-[#6e9556] text-white py-3 px-4 rounded-xl font-semibold hover:from-[#3f5a1c] hover:to-[#5a7a45] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {submitting ? 'Envoi en cours...' : 'Voter'}
              </button>
            </div>
          )}

          {/* Résultats */}
          {(voted || !poll.isActive) && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 size={20} />
                Résultats
              </h2>
              
              <div className="space-y-4">
                {poll.options.map((option) => (
                  <div key={option.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-[#2f4104]">{option.text}</span>
                      <span className="text-sm text-[#6e9556]">
                        {option.votes} vote{option.votes !== 1 ? 's' : ''} ({option.percentage}%)
                      </span>
                    </div>
                    
                    <div className="w-full bg-[#e8efe8] rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-[#517324] to-[#809c46] h-3 rounded-full transition-all duration-500 shadow-inner"
                        style={{ width: `${option.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-[#f0f5e8] to-[#e8efe8] rounded-xl border border-[#a8be6c]/30">
                <div className="flex items-center gap-2 text-[#517324]">
                  <Vote size={20} />
                  <span className="font-medium">
                    {voted ? 'Merci pour votre vote !' : 'Ce sondage est maintenant fermé.'}
                  </span>
                </div>
                <p className="text-[#6e9556] text-sm mt-1">
                  Total des votes : {poll.totalVotes}
                </p>
              </div>
            </div>
          )}

          {/* Événement */}
          <div className="mt-6 pt-4 border-t border-[#a8be6c]/30">
            <p className="text-sm text-[#6e9556]">
              Sondage pour l'événement: <span className="font-medium text-[#2f4104]">{poll.event?.title}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}