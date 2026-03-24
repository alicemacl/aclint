import type { Metadata } from 'next'
import { Box } from '@/src/components/layout'
import { PackageDocs } from '@/src/page-components/package-docs/package-docs'

export const metadata: Metadata = {
  title: 'npm Package – A11y Lens',
  description: 'Install and use @a11y-lens/a11y-companion for real-time accessibility feedback during development.',
}

export default function PackagePage() {
  return (
    <Box
      as="main"
      padding="4"
      backgroundColor="white"
      borderRadius="md"
      border="1px solid"
      borderColor="slate.300"
      overflowY="auto"
    >
      <PackageDocs />
    </Box>
  )
}
