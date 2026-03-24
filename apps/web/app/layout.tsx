import type { Metadata } from 'next'
import { A11yDevToolsWrapper } from './A11yDevToolsWrapper'
import './globals.css'
import { Navbar } from '@/src/layout/navbar'

export const metadata: Metadata = {
  title: 'ACLint',
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
        <Navbar />
        {children}
        <A11yDevToolsWrapper />
      </body>
    </html>
  )
}
