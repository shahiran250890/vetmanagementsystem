export type InvoiceStatus = 'paid' | 'pending' | 'failed' | 'draft'

export type InvoiceRow = {
  id: string
  customer: string
  email: string
  amountCents: number
  currency: string
  status: InvoiceStatus
  issuedAt: string
  plan: string
}

export const invoiceSeed: InvoiceRow[] = [
  {
    id: 'inv_8f2a',
    customer: 'Northwind Veterinary',
    email: 'billing@northwind.vet',
    amountCents: 128900,
    currency: 'USD',
    status: 'paid',
    issuedAt: '2026-04-28',
    plan: 'Enterprise',
  },
  {
    id: 'inv_9c11',
    customer: 'Bright Paws Clinic',
    email: 'accounts@brightpaws.io',
    amountCents: 48900,
    currency: 'USD',
    status: 'pending',
    issuedAt: '2026-04-27',
    plan: 'Growth',
  },
  {
    id: 'inv_1d44',
    customer: 'Atlas Animal Hospital',
    email: 'finance@atlasah.com',
    amountCents: 249900,
    currency: 'USD',
    status: 'paid',
    issuedAt: '2026-04-26',
    plan: 'Enterprise',
  },
  {
    id: 'inv_2a90',
    customer: 'Cedar Grove Pets',
    email: 'hello@cedargrove.pet',
    amountCents: 12900,
    currency: 'USD',
    status: 'failed',
    issuedAt: '2026-04-25',
    plan: 'Starter',
  },
  {
    id: 'inv_3bb1',
    customer: 'Lumen Care Group',
    email: 'ap@lumencare.group',
    amountCents: 79900,
    currency: 'USD',
    status: 'paid',
    issuedAt: '2026-04-24',
    plan: 'Growth',
  },
  {
    id: 'inv_4cc2',
    customer: 'Harborline Wellness',
    email: 'ops@harborline.co',
    amountCents: 0,
    currency: 'USD',
    status: 'draft',
    issuedAt: '2026-04-23',
    plan: 'Pilot',
  },
  {
    id: 'inv_5dd3',
    customer: 'Silverthread Labs',
    email: 'billing@silverthread.io',
    amountCents: 189900,
    currency: 'USD',
    status: 'paid',
    issuedAt: '2026-04-22',
    plan: 'Enterprise',
  },
  {
    id: 'inv_6ee4',
    customer: 'Kindred Veterinary Co.',
    email: 'finance@kindred.vet',
    amountCents: 45900,
    currency: 'USD',
    status: 'pending',
    issuedAt: '2026-04-21',
    plan: 'Growth',
  },
  {
    id: 'inv_7ff5',
    customer: 'Riverstone Clinic',
    email: 'contact@riverstone.clinic',
    amountCents: 9900,
    currency: 'USD',
    status: 'paid',
    issuedAt: '2026-04-20',
    plan: 'Starter',
  },
  {
    id: 'inv_8006',
    customer: 'Pulse Health Systems',
    email: 'ar@pulsehealth.systems',
    amountCents: 329900,
    currency: 'USD',
    status: 'paid',
    issuedAt: '2026-04-19',
    plan: 'Enterprise',
  },
  {
    id: 'inv_9117',
    customer: 'Oak & Ember Pets',
    email: 'team@oakember.pet',
    amountCents: 13900,
    currency: 'USD',
    status: 'pending',
    issuedAt: '2026-04-18',
    plan: 'Starter',
  },
  {
    id: 'inv_a228',
    customer: 'Vertex Diagnostics',
    email: 'billing@vertexdx.com',
    amountCents: 219900,
    currency: 'USD',
    status: 'failed',
    issuedAt: '2026-04-17',
    plan: 'Enterprise',
  },
]

export const revenueSeries = [
  { label: 'Jan', value: 182 },
  { label: 'Feb', value: 198 },
  { label: 'Mar', value: 214 },
  { label: 'Apr', value: 228 },
  { label: 'May', value: 246 },
  { label: 'Jun', value: 268 },
  { label: 'Jul', value: 281 },
]

export const activitySeries = [
  { name: 'API', value: 42 },
  { name: 'Web', value: 28 },
  { name: 'Mobile', value: 18 },
  { name: 'Exports', value: 12 },
]
