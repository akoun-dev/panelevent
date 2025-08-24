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
        const dataUrl = await QRCode.toDataURL(url, {
          width: 300,
          margin: 2,
          color: {
            dark: '#1c5320',
            light: '#a8be6c'
          }
        })
        setQrCodeDataUrl(dataUrl)
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