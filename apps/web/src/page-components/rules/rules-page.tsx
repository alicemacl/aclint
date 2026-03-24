'use client'

import { ALL_PATTERNS, ASSISTANT_RULES } from '@aclint/lens'
type PatternSeverity = (typeof ALL_PATTERNS)[number]['expectations'][number]['severity']

import { Box } from '@/src/components/layout'
import { Card } from '@/src/components/data-display'

const BUILT_IN_CHECKS = [
  {
    title: 'Hover Contrast',
    id: 'hover-color-contrast',
    description:
      'Checks hover text/background colors and reports WCAG contrast failures specifically for hover states.',
  },
  {
    title: 'Activation Monitor',
    id: 'no-activation-response',
    description:
      'Detects Space/Enter activation attempts on interactive elements when nothing changes in UI state, focus, or URL.',
  },
  {
    title: 'Focus Tracking',
    id: 'focus-tracking',
    description:
      'Tracks current/previous/next focusable elements, supports composite focus, and surfaces contextual accessibility diagnostics.',
  },
  {
    title: 'VoiceOver Engine',
    id: 'vo-engine',
    description:
      'Builds VoiceOver-style announcement previews with role/state/context to support guided screen reader testing.',
  },
  {
    title: 'Simulations',
    id: 'simulations',
    description:
      'Applies reduced motion, increased text size, and force-visible-focus simulations for quick accessibility validation.',
  },
]

function severityColor(severity: PatternSeverity) {
  if (severity === 'critical') return 'red.700'
  if (severity === 'serious') return 'orange.700'
  return 'blue.700'
}

export function RulesPage() {
  return (
    <Box as="main" maxWidth="1100px" marginX="auto" paddingX={{ base: '4', md: '6' }} paddingY="6">
      <Box display="flex" flexDirection="column" gap="8">
        <Box>
          <Box textStyle="2xl" fontWeight="bold">
            Rules Reference
          </Box>
          <Box marginTop="2" color="slate.600" fontSize="sm" maxWidth="800px">
            This page is mapped from the lens package exports. Pattern and assistant rule content is
            rendered directly from code to stay in sync with the implementation.
          </Box>
        </Box>

        <Box as="section" display="flex" flexDirection="column" gap="3">
          <Box textStyle="lg" fontWeight="semibold">
            Semantic Patterns
          </Box>
          <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))' }} gap="3">
            {ALL_PATTERNS.map((pattern) => (
              <Card.Root key={pattern.id} border="1px solid" borderColor="slate.200">
                <Card.Header>
                  <Card.Title>{pattern.name}</Card.Title>
                  <Card.Description>{pattern.description}</Card.Description>
                </Card.Header>
                <Card.Body>
                  <Box as="ul" display="flex" flexDirection="column" gap="2" paddingLeft="4">
                    {pattern.expectations.map((expectation) => (
                      <Box as="li" key={expectation.id} fontSize="sm" color="slate.700">
                        <Box display="inline" fontWeight="semibold" color={severityColor(expectation.severity)}>
                          [{expectation.severity}]
                        </Box>{' '}
                        {expectation.message}
                        <Box marginTop="1" color="slate.600">
                          {expectation.suggestion}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Card.Body>
              </Card.Root>
            ))}
          </Box>
        </Box>

        <Box as="section" display="flex" flexDirection="column" gap="3">
          <Box textStyle="lg" fontWeight="semibold">
            WCAG Rules
          </Box>
          <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))' }} gap="3">
            {ASSISTANT_RULES.map((rule) => (
              <Card.Root key={rule.id} border="1px solid" borderColor="slate.200">
                <Card.Header>
                  <Card.Title>{rule.summary}</Card.Title>
                  <Card.Description>{rule.explanation}</Card.Description>
                </Card.Header>
                <Card.Body display="flex" flexDirection="column" gap="2">
                  <Box fontSize="xs" color="slate.500">
                    Axe IDs: {rule.axeRuleIds.join(', ')}
                  </Box>
                  <Box fontSize="sm" color="slate.700">
                    <strong>Fix:</strong> {rule.fixGuidance.whatToDo}
                  </Box>
                  <Box fontSize="sm" color="slate.700">
                    <strong>VoiceOver test:</strong> {rule.voiceOverTest.steps.join(' ')}
                  </Box>
                </Card.Body>
              </Card.Root>
            ))}
          </Box>
        </Box>

        <Box as="section" display="flex" flexDirection="column" gap="3">
          <Box textStyle="lg" fontWeight="semibold">
            Built-in Checks
          </Box>
          <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))' }} gap="3">
            {BUILT_IN_CHECKS.map((item) => (
              <Card.Root key={item.id} border="1px solid" borderColor="slate.200">
                <Card.Header>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Description>{item.description}</Card.Description>
                </Card.Header>
                <Card.Body>
                  <Box fontSize="xs" color="slate.500">
                    ID: {item.id}
                  </Box>
                </Card.Body>
              </Card.Root>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
