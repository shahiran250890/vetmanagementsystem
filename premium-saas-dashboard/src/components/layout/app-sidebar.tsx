import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { footerNav, mainNav } from '@/config/navigation'
import { cn } from '@/lib/utils'

export type AppSidebarProps = {
  collapsed: boolean
  onToggle: () => void
  /** When true, sidebar is shown inside mobile sheet (not `hidden` on small screens). */
  embedded?: boolean
}

function SidebarNavLink({
  item,
  collapsed,
}: {
  item: (typeof mainNav)[number]
  collapsed: boolean
}): React.JSX.Element {
  const content = ({ isActive }: { isActive: boolean }): React.JSX.Element => (
    <>
      {isActive && (
        <motion.span
          layoutId="nav-pill"
          className="bg-primary/20 absolute inset-0 rounded-xl"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
      <item.icon className="relative z-10 size-4 shrink-0" aria-hidden />
      {!collapsed && (
        <span className="relative z-10 flex min-w-0 flex-1 items-center justify-between gap-2">
          <span className="truncate">{item.title}</span>
          {item.badge && (
            <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wide">
              {item.badge}
            </Badge>
          )}
        </span>
      )}
    </>
  )

  const link = (
    <NavLink
      to={item.href}
      end={item.href === '/'}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors',
          collapsed && 'justify-center px-0',
          isActive
            ? 'bg-primary/12 text-primary'
            : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
        )
      }
    >
      {({ isActive }) => content({ isActive })}
    </NavLink>
  )

  if (collapsed) {
    return (
      <Tooltip key={item.href}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.title}</TooltipContent>
      </Tooltip>
    )
  }

  return link
}

export function AppSidebar({ collapsed, onToggle, embedded = false }: AppSidebarProps): React.JSX.Element {
  return (
    <motion.aside
      layout
      transition={{ type: 'spring', stiffness: 420, damping: 38 }}
      className={cn(
        'border-border/60 bg-card/40 supports-[backdrop-filter]:bg-card/30 sticky top-0 z-30 h-dvh shrink-0 flex-col border-r backdrop-blur-xl',
        embedded ? 'flex w-full' : 'hidden lg:flex',
        !embedded && (collapsed ? 'lg:w-[4.5rem]' : 'lg:w-60'),
      )}
    >
      <div className={cn('flex h-14 items-center gap-2 px-3', collapsed && !embedded && 'lg:justify-center')}>
        <div className="from-primary/35 via-primary/15 to-primary/5 ring-primary/25 flex size-9 items-center justify-center rounded-xl bg-gradient-to-br shadow-[0_0_0_1px_rgba(255,255,255,0.06)] ring-1">
          <Sparkles className="text-primary size-4" aria-hidden />
        </div>
        {(!collapsed || embedded) && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">Aurora</p>
            <p className="text-muted-foreground truncate text-xs">Operations</p>
          </div>
        )}
      </div>

      <Separator className="opacity-60" />

      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="flex flex-col gap-1">
          {mainNav.map((item) => (
            <SidebarNavLink key={item.href} item={item} collapsed={!embedded && collapsed} />
          ))}
        </nav>
      </ScrollArea>

      <div className="mt-auto space-y-2 p-2">
        <Separator className="opacity-60" />
        {footerNav.map((item) => {
          const inner = (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors',
                  !embedded && collapsed && 'lg:justify-center lg:px-0',
                  isActive
                    ? 'bg-primary/12 text-primary'
                    : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                )
              }
            >
              <item.icon className="size-4 shrink-0" aria-hidden />
              {(!embedded && !collapsed) || embedded ? (
                <span className="truncate">{item.title}</span>
              ) : null}
            </NavLink>
          )

          if (!embedded && collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{inner}</TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            )
          }

          return inner
        })}
        {!embedded && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="border-border/70 bg-background/40 hover:bg-accent/60 w-full"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </Button>
        )}
      </div>
    </motion.aside>
  )
}
