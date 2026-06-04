import './globals.css'
import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import { ConditionalChrome } from './ConditionalChrome'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Brooklyn Audio | Hi-Fi Audio Equipment | Dartmouth, NS',
  description: 'High-fidelity audio equipment for serious listeners. Turntables, amplifiers, speakers and more — curated for over 30 years in Dartmouth, Nova Scotia.',
  keywords: 'hi-fi, audio, turntables, amplifiers, speakers, Dartmouth, Nova Scotia, Brooklyn Audio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body suppressHydrationWarning>
        <ConditionalChrome>{children}</ConditionalChrome>
      </body>
    </html>
  )
}
