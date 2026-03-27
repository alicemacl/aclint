import type { Metadata } from 'next'
import { ComponentPatternsPage } from '@/src/page-components/component-patterns'

export const metadata: Metadata = {
  title: 'Component Patterns – ACLint',
  description:
    'Learn how ACLint tracks semantic component patterns to detect common implementation mistakes.',
}

export default function ComponentPatternsDocsPage() {
  return <ComponentPatternsPage />
}
