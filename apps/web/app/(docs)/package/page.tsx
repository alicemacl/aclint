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
      maxWidth="1100px"
      marginX="auto"
      paddingX={{ base: '4', md: '6' }}
      paddingY="4"
      backgroundColor="white"
      overflowY="auto"
    >
      <PackageDocs />
    </Box>
  )
}
