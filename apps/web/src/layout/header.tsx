import { Box, Grid, GridItem } from "@/styled-system/jsx";

export default function Header() {
  return (
    <header>
      <Grid gridTemplateColumns="repeat(3, 1fr)">
        <GridItem>
          <Box textStyle="lg" fontWeight="bold">
            Dashboard
          </Box>
        </GridItem>
        <GridItem>
          <Box>Header</Box>
        </GridItem>
        <GridItem>
          <Box>Header</Box>
        </GridItem>
      </Grid>
    </header>
  );
}
