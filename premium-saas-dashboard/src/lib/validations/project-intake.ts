import { z } from 'zod'

export const projectIntakeSchema = z.object({
  organization: z.string().min(2, 'Organization must be at least 2 characters.'),
  contactEmail: z.string().email('Enter a valid work email.'),
  region: z.enum(['us', 'eu', 'apac']),
  seats: z.coerce.number().int().min(5, 'Minimum 5 seats for this tier.').max(5000, 'Contact sales above 5,000 seats.'),
  notes: z.string().max(2000, 'Notes are too long.').optional(),
  acceptTerms: z
    .boolean()
    .refine((value) => value === true, { message: 'You must accept the terms to continue.' }),
})

export type ProjectIntakeValues = z.infer<typeof projectIntakeSchema>
