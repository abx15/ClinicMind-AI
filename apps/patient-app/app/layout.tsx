import Providers from './providers'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-background text-text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
