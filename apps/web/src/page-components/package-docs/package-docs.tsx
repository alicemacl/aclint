'use client'

import { Box } from '@/src/components/layout'
import { useVoPlatform, type VoPlatform } from '@aclint/lens'

export function PackageDocs() {
  const { platform, setPlatform } = useVoPlatform()

  return (
    <Box paddingX="4" paddingY="2" display="flex" flexDirection="column" gap="6">
      <Box>
        <Box textStyle="xl" fontWeight="bold">
          @aclint/lens
        </Box>
        <Box fontSize="sm" color="slate.600" marginTop="1">
          Embed real-time accessibility feedback directly in your development environment.
        </Box>
      </Box>

      <Section title="What it does">
        <Box as="ul" fontSize="sm" color="slate.700" display="flex" flexDirection="column" gap="1" paddingLeft="4">
          <Box as="li">Previews VoiceOver announcements for the focused element</Box>
          <Box as="li">Runs axe-core and AccessLint checks on focus</Box>
          <Box as="li">Detects semantic patterns that Lighthouse-style tools miss</Box>
          <Box as="li">Shows fix guidance with code examples and VoiceOver testing steps</Box>
          <Box as="li">Supports macOS and iOS VoiceOver guidance</Box>
        </Box>
      </Section>

      <Section title="Install">
        <CodeBlock>npm install @aclint/lens</CodeBlock>
      </Section>

      <Section title="Quick start">
        <Box fontSize="sm" color="slate.700" marginBottom="2">
          Wrap your app root with the dev tools component. It only renders in development mode.
        </Box>
        <CodeBlock>{`import { A11yDevTools } from '@aclint/lens'

export default function App() {
  return (
    <>
      <YourApp />
      <A11yDevTools />
    </>
  )
}`}</CodeBlock>
        <Box fontSize="xs" color="slate.500" marginTop="2">
          Press <Kbd>Ctrl+Shift+A</Kbd> (or <Kbd>Cmd+Shift+A</Kbd>) to toggle the panel.
        </Box>
      </Section>

      <Section title="Key exports">
        <Box as="ul" fontSize="sm" color="slate.700" display="flex" flexDirection="column" gap="1" paddingLeft="4">
          <Box as="li"><Code>A11yDevTools</Code> — drop-in component (dev-only)</Box>
          <Box as="li"><Code>A11yOverlay</Code> — full overlay for custom setups or the extension</Box>
          <Box as="li"><Code>VoPlatformProvider</Code> / <Code>useVoPlatform</Code> — shared VoiceOver platform context</Box>
          <Box as="li"><Code>useFocusTracking</Code> — hook for tracking focused element details</Box>
          <Box as="li"><Code>generateVOAnnouncement</Code> — synthesise a VoiceOver announcement string</Box>
        </Box>
      </Section>

      <Section title="VoiceOver testing steps">
        <Box fontSize="sm" color="slate.700" marginBottom="2">
          The panel shows platform-aware VoiceOver testing steps. Toggle the platform below — this
          preference is shared with the devtools panel.
        </Box>
        <PlatformToggle platform={platform} onChange={setPlatform} />
        <Box
          marginTop="3"
          padding="3"
          backgroundColor="slate.50"
          borderRadius="md"
          fontSize="sm"
          color="slate.700"
        >
          {platform === 'macos' ? (
            <>
              <strong>macOS:</strong> Enable VoiceOver with <Kbd>Cmd+F5</Kbd>. Navigate with{' '}
              <Kbd>VO+Right Arrow</Kbd>. Open the Rotor with <Kbd>VO+U</Kbd>.
            </>
          ) : (
            <>
              <strong>iOS:</strong> Enable VoiceOver in Settings → Accessibility → VoiceOver.
              Swipe right to navigate. Rotate two fingers to open the Rotor.
            </>
          )}
        </Box>
      </Section>

      <Section title="Limitations">
        <Box as="ul" fontSize="sm" color="slate.700" display="flex" flexDirection="column" gap="1" paddingLeft="4">
          <Box as="li">VoiceOver output is an approximation — always verify on a real device</Box>
          <Box as="li">Gradient text may cause false-positive contrast violations (filtered automatically)</Box>
          <Box as="li">The panel is designed for desktop Chrome; for other browsers see the extension</Box>
        </Box>
      </Section>
    </Box>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box as="section">
      <Box fontSize="md" fontWeight="semibold" marginBottom="2">
        {title}
      </Box>
      {children}
    </Box>
  )
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <Box
      as="pre"
      padding="3"
      backgroundColor="slate.900"
      color="slate.100"
      borderRadius="md"
      fontSize="xs"
      overflow="auto"
      lineHeight="1.6"
    >
      <code>{children}</code>
    </Box>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <Box
      as="code"
      display="inline"
      padding="0 4px"
      backgroundColor="slate.100"
      borderRadius="sm"
      fontSize="xs"
    >
      {children}
    </Box>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <Box
      as="kbd"
      display="inline"
      padding="0 4px"
      backgroundColor="slate.200"
      color="slate.800"
      borderRadius="sm"
      fontSize="xs"
      fontFamily="monospace"
      border="1px solid"
      borderColor="slate.300"
    >
      {children}
    </Box>
  )
}

function PlatformToggle({
  platform,
  onChange,
}: {
  platform: VoPlatform
  onChange: (p: VoPlatform) => void
}) {
  return (
    <Box display="flex" gap="1" padding="2px" backgroundColor="slate.100" borderRadius="md" width="fit-content">
      <Box
        as="button"
        padding="4px 12px"
        borderRadius="sm"
        fontSize="xs"
        fontWeight="semibold"
        cursor="pointer"
        backgroundColor={platform === 'macos' ? 'slate.800' : 'transparent'}
        color={platform === 'macos' ? 'white' : 'slate.600'}
        border="none"
        onClick={() => onChange('macos')}
      >
        macOS
      </Box>
      <Box
        as="button"
        padding="4px 12px"
        borderRadius="sm"
        fontSize="xs"
        fontWeight="semibold"
        cursor="pointer"
        backgroundColor={platform === 'ios' ? 'slate.800' : 'transparent'}
        color={platform === 'ios' ? 'white' : 'slate.600'}
        border="none"
        onClick={() => onChange('ios')}
      >
        iOS
      </Box>
    </Box>
  )
}
