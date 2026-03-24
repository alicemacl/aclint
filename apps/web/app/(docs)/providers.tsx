'use client'

import { VoPlatformProvider } from '@a11y-lens/a11y-companion'

export function DocsProviders({ children }: { children: React.ReactNode }) {
  return <VoPlatformProvider>{children}</VoPlatformProvider>
}
