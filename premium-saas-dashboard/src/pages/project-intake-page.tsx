import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { type Resolver, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { type ProjectIntakeValues, projectIntakeSchema } from '@/lib/validations/project-intake'

export function ProjectIntakePage(): React.JSX.Element {
  const [submitting, setSubmitting] = useState(false)
  const form = useForm<ProjectIntakeValues>({
    resolver: zodResolver(projectIntakeSchema) as Resolver<ProjectIntakeValues>,
    defaultValues: {
      organization: '',
      contactEmail: '',
      region: 'us',
      seats: 25,
      notes: '',
      acceptTerms: false,
    },
    mode: 'onTouched',
  })

  const region = useWatch({ control: form.control, name: 'region' })
  const acceptTerms = useWatch({ control: form.control, name: 'acceptTerms' })

  async function onSubmit(values: ProjectIntakeValues): Promise<void> {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 650))
    setSubmitting(false)
    toast.success('Intake captured', {
      description: `${values.organization} · ${values.seats} seats · ${values.region.toUpperCase()}`,
    })
    form.reset({ ...form.getValues(), acceptTerms: false })
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-3"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="rounded-full px-3 font-semibold tracking-wide uppercase">Intake</Badge>
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Validation-ready</span>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">New deployment</h2>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed sm:text-base">
          Opinionated form layout with Zod + React Hook Form—ready to swap in your API route or server action.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-2xl"
      >
        <Card className="border-border/70 from-card to-card/25 bg-gradient-to-b shadow-lg shadow-black/15">
          <CardHeader>
            <CardTitle>Workspace details</CardTitle>
            <CardDescription>We will use this to provision environments and billing contacts.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="intake-form" className="space-y-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <div className="grid gap-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  autoComplete="organization"
                  placeholder="e.g. Northwind Veterinary"
                  aria-invalid={!!form.formState.errors.organization}
                  {...form.register('organization')}
                />
                {form.formState.errors.organization && (
                  <p className="text-destructive text-sm">{form.formState.errors.organization.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contactEmail">Work email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  aria-invalid={!!form.formState.errors.contactEmail}
                  {...form.register('contactEmail')}
                />
                {form.formState.errors.contactEmail && (
                  <p className="text-destructive text-sm">{form.formState.errors.contactEmail.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Data region</Label>
                  <Select
                    value={region}
                    onValueChange={(v) => form.setValue('region', v as ProjectIntakeValues['region'], { shouldValidate: true })}
                  >
                    <SelectTrigger className="h-10 w-full rounded-xl">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="eu">European Union</SelectItem>
                      <SelectItem value="apac">Asia Pacific</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.region && (
                    <p className="text-destructive text-sm">{form.formState.errors.region.message}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="seats">Seats</Label>
                  <Input
                    id="seats"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    aria-invalid={!!form.formState.errors.seats}
                    {...form.register('seats')}
                  />
                  {form.formState.errors.seats && (
                    <p className="text-destructive text-sm">{form.formState.errors.seats.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Goals, integrations, compliance needs…" rows={5} {...form.register('notes')} />
                {form.formState.errors.notes && (
                  <p className="text-destructive text-sm">{form.formState.errors.notes.message}</p>
                )}
              </div>

              <Separator className="opacity-60" />

              <div className="flex items-start gap-3">
                <Checkbox
                  id="acceptTerms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => form.setValue('acceptTerms', checked === true, { shouldValidate: true })}
                  aria-invalid={!!form.formState.errors.acceptTerms}
                />
                <div className="grid gap-1">
                  <Label htmlFor="acceptTerms" className="text-sm leading-snug font-medium">
                    I accept the Aurora platform terms, DPA, and acceptable use policy.
                  </Label>
                  {form.formState.errors.acceptTerms && (
                    <p className="text-destructive text-sm">{form.formState.errors.acceptTerms.message}</p>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t border-border/60 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl sm:w-auto"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              form="intake-form"
              className="w-full rounded-xl sm:w-auto"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting
                </>
              ) : (
                'Submit intake'
              )}
            </Button>
          </CardFooter>
        </Card>

        <p className="text-muted-foreground mt-4 text-center text-xs">
          This demo does not persist data—wire <span className="text-foreground font-mono text-[11px]">onSubmit</span>{' '}
          to your backend.
        </p>
      </motion.div>
    </div>
  )
}
