import { Grid, GridItem } from '@/styled-system/jsx'
import { Box } from '../components/layout'

export default function Header() {
  return (
    <Box as="header" padding="4">
      <Grid
        gridTemplateColumns="repeat(3, 1fr)"
        backgroundColor="white/20"
        padding="4"
        borderRadius="lg"
        color="white"
      >
        <GridItem>
          <Box textStyle="xl" fontWeight="bold">
            Dashboard
          </Box>
        </GridItem>
        <GridItem></GridItem>
        <GridItem>
          <Box>Header</Box>
        </GridItem>
      </Grid>
    </Box>
  )
}
