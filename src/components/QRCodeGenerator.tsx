'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import QRCode from 'qrcode'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface QRCodeGeneratorProps {
  url: string
  eventName: string
}

export function QRCodeGenerator({ url, eventName }: QRCodeGeneratorProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('')

  useEffect(() => {
    const generateQR = async () => {
      try {
        // Générer le QR code normal d'abord
        const dataUrl = await QRCode.toDataURL(url, {
          width: 300,
          margin: 2,
          color: {
            dark: '#1c5320',
            light: '#a8be6c'
          }
        })
        
        // Si nous sommes dans le navigateur, essayer d'ajouter le favicon
        if (typeof window !== 'undefined') {
          try {
            console.log('QRCodeGenerator: Tentative de chargement du favicon...')
            // Charger le favicon
            const faviconResponse = await fetch('/favicon.png')
            console.log('QRCodeGenerator: Réponse favicon:', faviconResponse.status, faviconResponse.statusText)
            
            if (!faviconResponse.ok) {
              throw new Error(`HTTP error! status: ${faviconResponse.status}`)
            }
            
            const faviconBlob = await faviconResponse.blob()
            console.log('QRCodeGenerator: Favicon blob chargé:', faviconBlob.type, faviconBlob.size)
            
            const faviconUrl = URL.createObjectURL(faviconBlob)
            console.log('QRCodeGenerator: URL temporaire créée:', faviconUrl)
            
            // Créer un canvas pour dessiner le QR code avec le favicon
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) {
              throw new Error('Could not get canvas context')
            }
            
            canvas.width = 300
            canvas.height = 300
            
            // Charger l'image du QR code
            const qrImage = new window.Image()
            qrImage.src = dataUrl
            
            await new Promise<void>((resolve) => {
              qrImage.onload = () => resolve()
            })
            
            // Dessiner le QR code sur le canvas
            ctx.drawImage(qrImage, 0, 0, 300, 300)
            
            // Charger et dessiner le favicon au centre
            const faviconImage = new window.Image()
            faviconImage.src = faviconUrl
            
            await new Promise<void>((resolve) => {
              faviconImage.onload = () => {
                console.log('QRCodeGenerator: Favicon image chargée:', faviconImage.width, 'x', faviconImage.height)
                resolve()
              }
            })
            
            // Calculer la position et la taille du favicon (20% du QR code)
            const faviconSize = 300 * 0.2
            const centerX = (300 - faviconSize) / 2
            const centerY = (300 - faviconSize) / 2
            
            // Dessiner un fond blanc pour le favicon
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(centerX, centerY, faviconSize, faviconSize)
            
            // Dessiner le favicon
            ctx.drawImage(faviconImage, centerX, centerY, faviconSize, faviconSize)
            
            // Convertir le canvas en data URL
            const finalDataUrl = canvas.toDataURL('image/png')
            console.log('QRCodeGenerator: QR code final généré avec favicon')
            setQrCodeDataUrl(finalDataUrl)
            
            // Nettoyer l'URL temporaire
            URL.revokeObjectURL(faviconUrl)
            
          } catch (faviconErr) {
            console.error('QRCodeGenerator: Failed to add favicon to QR code:', faviconErr)
            console.log('QRCodeGenerator: Utilisation du QR code sans favicon comme fallback')
            // Fallback: utiliser le QR code sans favicon
            setQrCodeDataUrl(dataUrl)
          }
        } else {
          // Environnement serveur, utiliser le QR code normal
          console.log('QRCodeGenerator: Environnement serveur - QR code normal')
          setQrCodeDataUrl(dataUrl)
        }
      } catch (err) {
        console.error('Failed to generate QR code:', err)
      }
    }

    generateQR()
  }, [url])

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return
    
    const link = document.createElement('a')
    link.href = qrCodeDataUrl
    link.download = `qrcode-${eventName.toLowerCase().replace(/\s+/g, '-')}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {qrCodeDataUrl ? (
        <>
          <Image
            src={qrCodeDataUrl}
            alt={`QR Code for ${eventName}`}
            width={300}
            height={300}
            unoptimized
            className="w-64 h-64"
          />
          <Button onClick={downloadQRCode}>
            <Download className="w-4 h-4 mr-2" />
            Télécharger QR Code
          </Button>
        </>
      ) : (
        <div className="w-64 h-64 flex items-center justify-center bg-muted rounded-lg">
          <p>Génération du QR Code...</p>
        </div>
      )}
    </div>
  )
}