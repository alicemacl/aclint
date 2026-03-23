import { Box } from '@/src/components/layout'

import { DashboardPlayground } from './dashboard-playground'

export const Dashboard = () => {
  return (
    <Box paddingX="4" paddingY="2">
      <Box>
        <Box textStyle="xl" fontWeight="bold">
          Dashboard
        </Box>
        <Box fontSize="sm" color="slate.600" marginTop="1">
          A11y playground — interactive examples for the devtools panel (VoiceOver, patterns, WCAG).
        </Box>
      </Box>

      <DashboardPlayground />
    </Box>
  )
}
