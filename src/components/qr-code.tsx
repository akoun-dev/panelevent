"use client"

import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { Copy, Download, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface QRCodeProps {
  eventId: string
  className?: string
  size?: number
}

export default function QRCodeComponent({ eventId, className = '', size = 200 }: QRCodeProps) {
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [eventSlug, setEventSlug] = useState<string>('')

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setLoading(true)
        setError('')
        
        // Récupérer le slug de l'événement
        const response = await fetch(`/api/events/${eventId}`)
        let checkinUrl = ''
        
        if (response.ok) {
          const event = await response.json()
          setEventSlug(event.slug || '')
          const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
          checkinUrl = `${baseUrl}/register/${event.slug}`
        } else {
          // Fallback vers l'URL par ID si le slug n'est pas disponible
          const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
          checkinUrl = `${baseUrl}/register/${eventId}`
        }
        
        // Générer le QR code
        const dataUrl = await QRCode.toDataURL(checkinUrl, {
          width: size,
          margin: 2,
          color: {
            dark: '#1c5320',
            light: '#a8be6c'
          }
        })
        
        setQrDataUrl(dataUrl)
      } catch {
        setError('Erreur lors de la génération du QR code')
        toast.error('Erreur lors de la génération du QR code')
      } finally {
        setLoading(false)
      }
    }

    generateQRCode()
  }, [eventId, size])

  const handleCopy = async () => {
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const checkinUrl = eventSlug ? `${baseUrl}/register/${eventSlug}` : `${baseUrl}/register/${eventId}`
      
      await navigator.clipboard.writeText(checkinUrl)
      setCopied(true)
      toast.success('URL copiée dans le presse-papier')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Erreur lors de la copie')
    }
  }

  const handleDownload = () => {
    if (!qrDataUrl) return

    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `qr-code-${eventId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('QR code téléchargé')
  }

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center bg-muted rounded-lg p-4 ${className}`} style={{ width: size, height: size }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-xs text-muted-foreground mt-2">Génération du QR code...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-muted rounded-lg p-4 ${className}`} style={{ width: size, height: size }}>
        <div className="text-red-500 text-sm text-center">
          <p>❌ Erreur</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrDataUrl}
          alt={`QR code pour l'événement ${eventId}`}
          width={size}
          height={size}
          className="rounded"
        />
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex items-center gap-2"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {copied ? 'Copié' : 'Copier'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Télécharger
        </Button>
      </div>
      
      <div className="text-xs text-muted-foreground text-center max-w-xs">
        <p>Scannez ce QR code pour vous inscrire à l'événement</p>
        <p className="text-[10px] opacity-70 mt-1 break-all">
          {typeof window !== 'undefined' ?
            (eventSlug ? `${window.location.origin}/register/${eventSlug}` : `${window.location.origin}/register/${eventId}`)
            : ''}
        </p>
      </div>
    </div>
  )
}