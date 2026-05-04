import { FilePenLine, LayoutDashboard, Settings2, Table2, type LucideIcon } from 'lucide-react'

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
}

export const mainNav: NavItem[] = [
  { title: 'Overview', href: '/', icon: LayoutDashboard },
  { title: 'Ledger', href: '/ledger', icon: Table2, badge: 'Live' },
  { title: 'Intake', href: '/intake', icon: FilePenLine },
]

export const footerNav: NavItem[] = [{ title: 'Workspace', href: '/settings', icon: Settings2 }]
