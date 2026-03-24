import type { Metadata } from 'next'
import { Box } from '@/src/components/layout'
import { Dashboard } from '@/src/page-components/dashboard'

export const metadata: Metadata = {
  title: 'Playground – A11y Lens',
  description: 'Interactive accessibility playground — test VoiceOver output, pattern detection, and WCAG checks.',
}

export default function PlaygroundPage() {
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
      <Dashboard />
    </Box>
  )
}
