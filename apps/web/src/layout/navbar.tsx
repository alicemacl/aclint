'use client'

import { Dialog } from '@ark-ui/react/dialog'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Box } from '../components/layout'
import { NAV_ITEMS } from './nav-items'

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Navbar() {
  const pathname = usePathname()

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      zIndex="1000"
      backgroundColor="white"
      borderBottom="1px solid"
      borderColor="slate.200"
    >
      <Box
        maxWidth="1100px"
        marginX="auto"
        paddingX={{ base: '4', md: '6' }}
        paddingY="3"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box fontWeight="bold" letterSpacing="0.04em">
            ACLint
          </Box>
        </Link>

        <Box as="nav" display={{ base: 'none', md: 'flex' }} alignItems="center" gap="1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <Box
                  paddingX="3"
                  paddingY="2"
                  borderRadius="md"
                  fontSize="sm"
                  fontWeight={active ? 'semibold' : 'medium'}
                  color={active ? 'slate.900' : 'slate.600'}
                  backgroundColor={active ? 'slate.100' : 'transparent'}
                  _hover={{ backgroundColor: 'slate.100', color: 'slate.900' }}
                >
                  {item.label}
                </Box>
              </Link>
            )
          })}
        </Box>

        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Box
              as="button"
              display={{ base: 'inline-flex', md: 'none' }}
              alignItems="center"
              justifyContent="center"
              width="9"
              height="9"
              border="1px solid"
              borderColor="slate.300"
              borderRadius="md"
              backgroundColor="white"
              color="slate.800"
              aria-label="Open navigation menu"
            >
              <Menu size={18} />
            </Box>
          </Dialog.Trigger>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Box
                backgroundColor="white"
                width="100vw"
                maxWidth="320px"
                height="100vh"
                marginLeft="auto"
                padding="4"
                borderLeft="1px solid"
                borderColor="slate.200"
                display="flex"
                flexDirection="column"
                gap="3"
              >
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box fontWeight="bold">Navigation</Box>
                  <Dialog.CloseTrigger asChild>
                    <Box
                      as="button"
                      width="8"
                      height="8"
                      display="inline-flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="slate.300"
                      backgroundColor="white"
                      aria-label="Close navigation menu"
                    >
                      <X size={16} />
                    </Box>
                  </Dialog.CloseTrigger>
                </Box>
                <Box as="nav" display="flex" flexDirection="column" gap="1">
                  {NAV_ITEMS.map((item) => {
                    const active = isActive(pathname, item.href)
                    return (
                      <Dialog.CloseTrigger asChild key={item.href}>
                        <Link href={item.href} style={{ textDecoration: 'none' }}>
                          <Box
                            paddingX="3"
                            paddingY="2.5"
                            borderRadius="md"
                            fontWeight={active ? 'semibold' : 'medium'}
                            color={active ? 'slate.900' : 'slate.700'}
                            backgroundColor={active ? 'slate.100' : 'transparent'}
                          >
                            {item.label}
                          </Box>
                        </Link>
                      </Dialog.CloseTrigger>
                    )
                  })}
                </Box>
              </Box>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      </Box>
    </Box>
  )
}
