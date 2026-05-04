import { Bell, Command, LogOut, Search, Settings, UserRound } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'sonner'

import { MobileSidebar } from '@/components/layout/mobile-sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { mainNav } from '@/config/navigation'

function titleFromPath(pathname: string): string {
  if (pathname.startsWith('/ledger')) {
    return 'Ledger'
  }
  if (pathname.startsWith('/intake')) {
    return 'Intake'
  }
  return 'Overview'
}

export function TopNavbar(): React.JSX.Element {
  const location = useLocation()
  const title = useMemo(() => titleFromPath(location.pathname), [location.pathname])

  return (
    <header className="border-border/60 bg-background/70 supports-[backdrop-filter]:bg-background/55 sticky top-0 z-20 border-b backdrop-blur-xl">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-2 lg:hidden">
          <MobileSidebar />
        </div>

        <div className="min-w-0 flex-1 lg:hidden">
          <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">Workspace</p>
          <p className="truncate text-sm font-semibold tracking-tight">{title}</p>
        </div>

        <div className="hidden min-w-0 flex-1 items-center gap-3 lg:flex">
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0"
          >
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Workspace</p>
            <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
          </motion.div>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <nav className="text-muted-foreground hidden items-center gap-1 text-xs font-medium xl:flex">
            {mainNav.map((n) => (
              <span key={n.href} className="rounded-md px-2 py-1 hover:bg-accent/50 hover:text-foreground">
                {n.title}
              </span>
            ))}
          </nav>
        </div>

        <div className="ml-auto flex min-w-0 items-center justify-end gap-2 sm:gap-3">
          <div className="relative hidden w-full max-w-md md:block">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search invoices, customers, IDs…"
              className="border-border/70 bg-card/40 focus-visible:ring-primary/30 h-10 rounded-xl pl-10 pr-24 shadow-none"
              aria-label="Search"
            />
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 items-center gap-1 text-[11px] font-medium sm:flex">
              <kbd className="bg-muted/60 border-border/60 rounded-md border px-1.5 py-0.5 font-sans">
                <Command className="mr-0.5 inline size-3" />
                K
              </kbd>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="border-border/70 bg-card/40 hover:bg-accent/60 shrink-0 rounded-xl"
            aria-label="Notifications"
            onClick={() => toast.message('You are caught up', { description: 'No new alerts in the last 24 hours.' })}
          >
            <Bell className="size-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="border-border/70 bg-card/40 hover:bg-accent/60 h-10 gap-2 rounded-xl px-2"
              >
                <Avatar className="size-7">
                  <AvatarImage src="https://avatar.vercel.sh/aurora" alt="" />
                  <AvatarFallback>AK</AvatarFallback>
                </Avatar>
                <div className="hidden text-left text-sm leading-tight sm:block">
                  <p className="font-medium">Avery Kim</p>
                  <p className="text-muted-foreground text-xs">Owner</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium">Avery Kim</p>
                  <p className="text-muted-foreground text-xs font-normal">avery@aurora.app</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.success('Opening profile')}>
                <UserRound />
                Profile
                <DropdownMenuShortcut>⇧P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success('Opening settings')}>
                <Settings />
                Settings
                <DropdownMenuShortcut>⇧S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                onClick={() => toast.error('Signed out (demo)')}
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
