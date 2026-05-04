import type { ReactNode } from 'react'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

export function AppProviders({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <TooltipProvider delayDuration={200}>
      {children}
      <Toaster richColors closeButton position="top-center" />
    </TooltipProvider>
  )
}
