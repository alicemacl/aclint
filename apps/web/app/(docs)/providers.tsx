'use client'

import { VoPlatformProvider } from '@aclint/lens'

export function DocsProviders({ children }: { children: React.ReactNode }) {
  return <VoPlatformProvider>{children}</VoPlatformProvider>
}
