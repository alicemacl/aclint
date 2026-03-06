import Sidebar from '@/src/layout/sidebar'
import { Grid } from '@/styled-system/jsx'
import type { Metadata } from 'next'
import { A11yDevToolsWrapper } from './A11yDevToolsWrapper'
import './globals.css'

export const metadata: Metadata = {
  title: 'A11y Lens – Test',
  description: 'Test app for a11y-companion',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Grid gridTemplateColumns="250px 1fr" padding="4" height="100vh" width="100vw">
          <Sidebar />
          {children}
        </Grid>
        <A11yDevToolsWrapper />
      </body>
    </html>
  )
}
