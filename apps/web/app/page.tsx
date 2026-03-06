import { Box } from '@/src/components/layout'
import { Dashboard } from '@/src/page-components/dashboard'

export default function Home() {
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
