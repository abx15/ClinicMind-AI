import './globals.css'
import type { Metadata } from 'next'
import Providers from '@/providers'

export const metadata: Metadata = {
  title: 'ClinicMind Admin - Super Admin Portal',
  description: 'ClinicMind AI Platform - Super Admin Control Panel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
