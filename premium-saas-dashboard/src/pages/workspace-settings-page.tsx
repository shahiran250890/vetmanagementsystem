import { motion } from 'framer-motion'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function WorkspaceSettingsPage(): React.JSX.Element {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-3"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="rounded-full px-3 font-semibold tracking-wide uppercase">
            Workspace
          </Badge>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Settings</h2>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed sm:text-base">
          Placeholder surface for org profile, SSO, and audit exports—extend alongside your product settings model.
        </p>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Organization profile</CardTitle>
            <CardDescription>Legal name, address, and tax identifiers.</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">Coming soon in your app shell.</CardContent>
        </Card>
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>SCIM, SAML, and session policies.</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">Coming soon in your app shell.</CardContent>
        </Card>
      </div>

      <Separator className="opacity-60" />
    </div>
  )
}
