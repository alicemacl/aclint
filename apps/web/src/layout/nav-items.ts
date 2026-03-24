import { BookOpenCheck, Chrome, Package, Play } from 'lucide-react'

export type NavItem = {
  href: string
  label: string
  description: string
  icon: React.ComponentType<{ size?: number }>
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: '/playground',
    label: 'Playground',
    description: 'Try ACLint in a live demo with intentional examples.',
    icon: Play,
  },
  {
    href: '/package',
    label: 'npm Package',
    description: 'Embed @aclint/lens directly into your app during development.',
    icon: Package,
  },
  {
    href: '/extension',
    label: 'Chrome Extension',
    description: 'Run the same checks on any site without changing app code.',
    icon: Chrome,
  },
  {
    href: '/rules',
    label: 'Rules',
    description: 'Browse patterns, WCAG guidance, and built-in accessibility checks.',
    icon: BookOpenCheck,
  },
]
