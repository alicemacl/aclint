import { Chrome, HomeIcon, Package, Play } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../components/buttons'
import { Box, Span } from '../components/layout'

export default function Sidebar() {
  return (
    <Box
      as="aside"
      width="250px"
      padding="4"
      borderRadius="lg"
      display="flex"
      flexDirection="column"
      gap="4"
    >
      <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Box textStyle="lg" fontWeight="bold" textTransform="uppercase">
          ACLint
        </Box>
      </Link>
      <Box as="nav">
        <Box as="ul" width="100%" listStyleType="none" padding="0" margin="0">
          {items.map((item) => (
            <SidebarItem
              key={item.href}
              icon={<item.icon size={16} />}
              label={item.label}
              href={item.href}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

const SidebarItem = ({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode
  label: string
  href: string
}) => {
  return (
    <Box as="li">
      <Button asChild width="100%" justifyContent="start">
        <Link href={href}>
          <Span>{icon}</Span>
          <Span>{label}</Span>
        </Link>
      </Button>
    </Box>
  )
}

const items = [
  {
    icon: Play,
    label: 'Playground',
    href: '/playground',
  },
  {
    icon: Package,
    label: 'npm Package',
    href: '/package',
  },
  {
    icon: Chrome,
    label: 'Chrome Extension',
    href: '/extension',
  },
]
