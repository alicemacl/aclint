import type { Metadata } from 'next'
import { Box } from '@/src/components/layout'
import { PackageDocs } from '@/src/page-components/package-docs/package-docs'

export const metadata: Metadata = {
  title: 'npm Package – ACLint',
  description: 'Install and use @aclint/lens for real-time accessibility feedback during development.',
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
