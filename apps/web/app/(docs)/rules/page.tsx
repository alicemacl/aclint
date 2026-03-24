import type { Metadata } from 'next'
import { RulesPage } from '@/src/page-components/rules'

export const metadata: Metadata = {
  title: 'Rules – ACLint',
  description:
    'Reference for ACLint semantic patterns, WCAG guidance mappings, and built-in accessibility checks.',
}

export default function RulesDocsPage() {
  return <RulesPage />
}
