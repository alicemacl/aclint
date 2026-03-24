import { Box } from '@/src/components/layout'
import { Dashboard } from '@/src/page-components/dashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Playground – ACLint',
  description:
    'Interactive accessibility playground — test VoiceOver output, pattern detection, and WCAG checks.',
}

export default function PlaygroundPage() {
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
      <Dashboard />
    </Box>
  )
}
