import { Box } from '@/src/components/layout'
import { ExtensionDocs } from '@/src/page-components/extension-docs/extension-docs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chrome Extension – ACLint',
  description:
    'Install the ACLint Chrome extension for real-time accessibility feedback on any website.',
}

export default function ExtensionPage() {
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
      <ExtensionDocs />
    </Box>
  )
}
