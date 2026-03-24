import Link from 'next/link'
import { Box } from '@/src/components/layout'
import { Card } from '@/src/components/data-display'
import { NAV_ITEMS } from '@/src/layout/nav-items'

export const Hero = () => {
  return (
    <Box
      as="main"
      maxWidth="1100px"
      marginX="auto"
      paddingX={{ base: '4', md: '6' }}
      paddingY={{ base: '8', md: '12' }}
      display="flex"
      flexDirection="column"
      gap={{ base: '8', md: '10' }}
    >
      <Box as="section" display="flex" flexDirection="column" gap="4">
        <Box textStyle={{ base: '3xl', md: '5xl' }} fontWeight="bold" lineHeight="tight">
          ACLint
        </Box>
        <Box fontSize={{ base: 'md', md: 'lg' }} color="slate.700" maxWidth="760px">
          Real-time accessibility feedback while you build. Compare what VoiceOver should
          announce with what your UI actually exposes, catch WCAG violations, and apply fixes
          with concrete guidance.
        </Box>
        <Box
          as="ul"
          listStyleType="none"
          padding="0"
          margin="0"
          display="flex"
          flexDirection="column"
          gap="1.5"
          color="slate.700"
        >
          <Box as="li">VoiceOver-aware checks for both macOS and iOS workflows</Box>
          <Box as="li">Pattern detection for semantic issues that generic audits often miss</Box>
          <Box as="li">Works while VoiceOver is active so you can validate in live sessions</Box>
        </Box>
      </Box>

      <Box
        as="section"
        display="grid"
        gridTemplateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))' }}
        gap="4"
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
          >
            <Card.Root height="100%" border="1px solid" borderColor="slate.200">
              <Card.Header display="flex" alignItems="center" gap="2">
                <item.icon size={16} />
                <Card.Title>{item.label}</Card.Title>
              </Card.Header>
              <Card.Body>
                <Card.Description>{item.description}</Card.Description>
              </Card.Body>
            </Card.Root>
          </Link>
        ))}
      </Box>

      <Box fontSize="xs" color="slate.600">
        Open source · Framework agnostic · npm package + Chrome extension
      </Box>
    </Box>
  )
}
