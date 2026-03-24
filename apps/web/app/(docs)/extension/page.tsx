import type { Metadata } from 'next'
import { Box } from '@/src/components/layout'
import { ExtensionDocs } from '@/src/page-components/extension-docs/extension-docs'

export const metadata: Metadata = {
  title: 'Chrome Extension – ACLint',
  description: 'Install the ACLint Chrome extension for real-time accessibility feedback on any website.',
}

export default function ExtensionPage() {
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
      <ExtensionDocs />
    </Box>
  )
}
