import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/components/auth/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PanelEvent - Plateforme de gestion d'événements",
  description: "La plateforme unifiée pour la gestion d'événements, sessions interactives, questions en direct, sondages et attestations.",
  keywords: ["PanelEvent", "événements", "gestion", "Q&A", "sondages", "attestations"],
  authors: [{ name: "PanelEvent Team" }],
  openGraph: {
    title: "PanelEvent",
    description: "Plateforme de gestion d'événements interactive",
    url: "https://panelevent.com",
    siteName: "PanelEvent",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PanelEvent",
    description: "Plateforme de gestion d'événements interactive",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
