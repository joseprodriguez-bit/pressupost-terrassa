import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pressupost Terrassa · On van els teus impostos',
  description: 'Consulta el pressupost municipal de Terrassa. Transparència total sobre la despesa pública.',
  openGraph: {
    title: 'Pressupost Terrassa',
    description: 'On va el teu diner? Consulta la despesa de l\'Ajuntament de Terrassa.',
    locale: 'ca_ES',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ca">
      <body>{children}</body>
    </html>
  )
}
