import { HomeIcon, List, Settings, User } from 'lucide-react'
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
      <Box textStyle="lg" fontWeight="bold" textTransform="uppercase">
        A11y Lens
      </Box>
      <Box as="ul" width="100%">
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
    <Button asChild width="100%" justifyContent="start">
      <Span>
        <Span>{icon}</Span>
        <Link href={href}>{label}</Link>
      </Span>
    </Button>
  )
}

const items = [
  {
    icon: HomeIcon,
    label: 'Dashboard',
    href: '/',
  },
  {
    icon: List,
    label: 'Tasks',
    href: '/tasks',
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/settings',
  },
  {
    icon: User,
    label: 'Profile',
    href: '/profile',
  },
]
