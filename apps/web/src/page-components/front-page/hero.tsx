import Link from 'next/link'
import { Box } from '@/src/components/layout'

export const Hero = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      padding="8"
      textAlign="center"
      gap="6"
    >
      <Box textStyle="4xl" fontWeight="bold" lineHeight="tight">
        ACLint
      </Box>
      <Box fontSize="lg" color="slate.600" maxWidth="560px">
        Real-time accessibility feedback while you build. Know what screen readers announce,
        catch WCAG violations, and learn to fix them — before your users do.
      </Box>

      <Box as="ul" listStyleType="none" padding="0" margin="0" display="flex" flexDirection="column" gap="2" textAlign="left" fontSize="md" color="slate.700">
        <Box as="li">🔍 Live VoiceOver announcement preview (macOS &amp; iOS)</Box>
        <Box as="li">⚡ Pattern detection that Lighthouse misses</Box>
        <Box as="li">🛠️ Fix guidance with code examples and testing steps</Box>
      </Box>

      <Box display="flex" gap="4" marginTop="4">
        <Link
          href="/package"
          style={{
            padding: '10px 24px',
            borderRadius: '8px',
            backgroundColor: '#1e293b',
            color: 'white',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          npm Package
        </Link>
        <Link
          href="/extension"
          style={{
            padding: '10px 24px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            color: '#1e293b',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          Chrome Extension
        </Link>
        <Link
          href="/playground"
          style={{
            padding: '10px 24px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            color: '#1e293b',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          Try the Playground
        </Link>
      </Box>

      <Box fontSize="xs" color="slate.600" marginTop="8">
        Open-source · Works with any framework · Desktop Chrome extension + npm embed
      </Box>
    </Box>
  )
}
