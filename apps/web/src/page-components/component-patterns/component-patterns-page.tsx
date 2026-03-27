'use client'

import Link from 'next/link'
import { ALL_PATTERNS } from '@aclint/lens'
import { Box } from '@/src/components/layout'
import { Card } from '@/src/components/data-display'

type PatternSeverity = (typeof ALL_PATTERNS)[number]['expectations'][number]['severity']

function severityColor(severity: PatternSeverity) {
  if (severity === 'critical') return 'red.700'
  if (severity === 'serious') return 'orange.700'
  return 'blue.700'
}

export function ComponentPatternsPage() {
  return (
    <Box as="main" maxWidth="1100px" marginX="auto" paddingX={{ base: '4', md: '6' }} paddingY="6">
      <Box display="flex" flexDirection="column" gap="6">
        <Box>
          <Box textStyle="2xl" fontWeight="bold">
            Component Patterns
          </Box>
          <Box marginTop="2" fontSize="sm" color="slate.600" maxWidth="850px">
            ACLint tracks semantic component patterns to simulate common implementation mistakes.
            Instead of only checking raw attributes, it recognizes behavior-like structures (such as
            links used as triggers or fake buttons) and reports risks that often slip past generic
            audits.
          </Box>
        </Box>

        <Box
          padding="4"
          border="1px solid"
          borderColor="slate.200"
          borderRadius="lg"
          backgroundColor="slate.50"
          fontSize="sm"
          color="slate.700"
        >
          <strong>How this works:</strong> each pattern has a <code>matches</code> predicate and one
          or more expectations. When an element matches, ACLint evaluates those expectations and
          surfaces a focused issue with fix guidance.
        </Box>

        <Box display="grid" gridTemplateColumns={{ base: '1fr', md: 'repeat(2, minmax(0, 1fr))' }} gap="3">
          {ALL_PATTERNS.map((pattern) => (
            <Card.Root key={pattern.id} border="1px solid" borderColor="slate.200">
              <Card.Header>
                <Card.Title>{pattern.name}</Card.Title>
                <Card.Description>{pattern.description}</Card.Description>
              </Card.Header>
              <Card.Body display="flex" flexDirection="column" gap="2">
                <Box fontSize="xs" color="slate.500">
                  Pattern ID: {pattern.id}
                </Box>
                <Box as="ul" paddingLeft="4" display="flex" flexDirection="column" gap="2">
                  {pattern.expectations.map((expectation) => (
                    <Box key={expectation.id} as="li" fontSize="sm" color="slate.700">
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

        <Box fontSize="sm" color="slate.600">
          Want the full combined reference? See{' '}
          <Link href="/rules" style={{ textDecoration: 'underline' }}>
            Rules
          </Link>
          .
        </Box>
      </Box>
    </Box>
  )
}
