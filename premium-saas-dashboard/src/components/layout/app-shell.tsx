import { motion } from 'framer-motion'
import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { AppSidebar } from '@/components/layout/app-sidebar'
import { TopNavbar } from '@/components/layout/top-navbar'
import { useSidebarCollapsed } from '@/hooks/use-sidebar-collapsed'
import { cn } from '@/lib/utils'

export function AppShell(): React.JSX.Element {
  const { collapsed, toggle } = useSidebarCollapsed()

  return (
    <div className="bg-background text-foreground flex min-h-dvh">
      <AppSidebar collapsed={collapsed} onToggle={toggle} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar />

        <motion.main
          layout
          className={cn('canvas-grid relative flex-1')}
          transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        >
          <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
            <Suspense
              fallback={
                <div className="flex min-h-[40vh] items-center justify-center py-16">
                  <div className="border-primary/30 border-t-primary size-8 animate-spin rounded-full border-2" />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </motion.main>
      </div>
    </div>
  )
}
