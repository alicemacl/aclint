'use client'

import { Box } from '@/src/components/layout'
import { useVoPlatform, type VoPlatform } from '@a11y-lens/a11y-companion'

export function ExtensionDocs() {
  const { platform, setPlatform } = useVoPlatform()

  return (
    <Box paddingX="4" paddingY="2" display="flex" flexDirection="column" gap="6">
      <Box>
        <Box textStyle="xl" fontWeight="bold">
          A11y Lens – Chrome Extension
        </Box>
        <Box fontSize="sm" color="slate.600" marginTop="1">
          Run real-time accessibility checks on any website — no code changes required.
        </Box>
      </Box>

      <Section title="What it does">
        <Box as="ul" fontSize="sm" color="slate.700" display="flex" flexDirection="column" gap="1" paddingLeft="4">
          <Box as="li">Injects the A11y Lens panel onto any page in Chrome</Box>
          <Box as="li">Same VoiceOver preview, pattern detection, and WCAG checks as the npm package</Box>
          <Box as="li">Toggle with the toolbar icon or <Kbd>Ctrl+Shift+A</Kbd></Box>
          <Box as="li">Works on localhost, staging, and production sites</Box>
        </Box>
      </Section>

      <Section title="Install">
        <Box fontSize="sm" color="slate.700" marginBottom="2">
          The extension is not yet on the Chrome Web Store. To install from source:
        </Box>
        <Box as="ol" fontSize="sm" color="slate.700" display="flex" flexDirection="column" gap="1" paddingLeft="4">
          <Box as="li">Clone the repo and run <Code>pnpm install && pnpm build</Code></Box>
          <Box as="li">Open <Code>chrome://extensions</Code> and enable Developer mode</Box>
          <Box as="li">Click &ldquo;Load unpacked&rdquo; and select the <Code>apps/extension/dist</Code> folder</Box>
          <Box as="li">Click the A11y Lens icon in the toolbar (or press <Kbd>Ctrl+Shift+A</Kbd>)</Box>
        </Box>
      </Section>

      <Section title="Permissions">
        <Box as="ul" fontSize="sm" color="slate.700" display="flex" flexDirection="column" gap="1" paddingLeft="4">
          <Box as="li"><strong>activeTab</strong> — access the current tab when you click the icon</Box>
          <Box as="li"><strong>scripting</strong> — inject the panel script into the page</Box>
        </Box>
        <Box fontSize="xs" color="slate.500" marginTop="1">
          No data leaves your browser. All checks run locally.
        </Box>
      </Section>

      <Section title="Keyboard shortcuts">
        <Box
          padding="3"
          backgroundColor="slate.50"
          borderRadius="md"
          fontSize="sm"
          color="slate.700"
        >
          <PlatformToggle platform={platform} onChange={setPlatform} />
          <Box marginTop="3">
            {platform === 'macos' ? (
              <Box as="ul" listStyleType="none" padding="0" display="flex" flexDirection="column" gap="1">
                <Box as="li"><Kbd>Cmd+Shift+A</Kbd> — toggle the panel</Box>
                <Box as="li"><Kbd>Tab</Kbd> / <Kbd>Shift+Tab</Kbd> — navigate focusable elements</Box>
                <Box as="li"><Kbd>Cmd+F5</Kbd> — start VoiceOver (system)</Box>
              </Box>
            ) : (
              <Box as="ul" listStyleType="none" padding="0" display="flex" flexDirection="column" gap="1">
                <Box as="li">Swipe right / left — navigate elements with VoiceOver</Box>
                <Box as="li">Double tap — activate focused element</Box>
                <Box as="li">Two-finger rotate — open the Rotor</Box>
              </Box>
            )}
          </Box>
        </Box>
      </Section>

      <Section title="Limitations">
        <Box as="ul" fontSize="sm" color="slate.700" display="flex" flexDirection="column" gap="1" paddingLeft="4">
          <Box as="li">Chrome only — no Firefox or Safari extension support yet</Box>
          <Box as="li">Cannot run on <Code>chrome://</Code> pages, the Web Store, or PDF viewers</Box>
          <Box as="li">Cross-origin iframes are not inspected</Box>
          <Box as="li"><strong>Desktop only</strong> — Chrome extensions do not run on iOS Safari. For mobile testing, use the npm package with responsive DevTools or test on a real device.</Box>
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
    <Box display="flex" gap="1" padding="2px" backgroundColor="slate.200" borderRadius="md" width="fit-content">
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
