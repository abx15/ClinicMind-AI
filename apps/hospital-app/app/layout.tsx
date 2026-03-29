import type { Metadata } from 'next'
import { DM_Sans, Syne } from 'next/font/google'
import Providers from './providers'
import './globals.css'

const dmSans = DM_Sans({
  subsets:  ['latin'],
  variable: '--font-dm-sans',
  display:  'swap',
  weight:   ['300', '400', '500', '600', '700'],
})

const syne = Syne({
  subsets:  ['latin'],
  variable: '--font-syne',
  display:  'swap',
  weight:   ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title:       'ClinicMind — Hospital Management Portal',
  description: 'Manage your clinic, doctors, staff and patient queue.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable}`}>
      <body className="font-dm-sans antialiased bg-background text-text-primary" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
