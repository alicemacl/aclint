import type { Metadata } from 'next'
import { A11yDevToolsWrapper } from './A11yDevToolsWrapper'
import './globals.css'

export const metadata: Metadata = {
  title: 'A11y Lens',
  description: 'Real-time accessibility feedback for developers — npm package and Chrome extension.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <A11yDevToolsWrapper />
      </body>
    </html>
  )
}
