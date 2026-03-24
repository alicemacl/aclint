import Sidebar from '@/src/layout/sidebar'
import { Grid } from '@/styled-system/jsx'
import { DocsProviders } from './providers'

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <DocsProviders>
      <Grid gridTemplateColumns="250px 1fr" padding="4" height="100vh" width="100vw">
        <Sidebar />
        {children}
      </Grid>
    </DocsProviders>
  )
}
