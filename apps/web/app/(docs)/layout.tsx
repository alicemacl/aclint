import { DocsProviders } from './providers'

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <DocsProviders>
      {children}
    </DocsProviders>
  )
}
