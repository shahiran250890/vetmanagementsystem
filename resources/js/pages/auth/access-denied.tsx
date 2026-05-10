import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { HeartPulse, ShieldX } from 'lucide-react';

import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { home } from '@/routes';

export default function AccessDenied() {
    const { name: appName } = usePage<{ name: string }>().props;

    return (
        <>
            <Head title="Access denied" />

            <div className="relative flex min-h-svh flex-col bg-gradient-to-br from-slate-50 via-white to-rose-50/40 dark:from-zinc-950 dark:via-zinc-950 dark:to-rose-950/20 lg:flex-row">
                <motion.aside
                    className="relative hidden min-h-svh flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-rose-700 via-rose-800 to-slate-900 px-10 py-14 text-white lg:flex lg:max-w-[min(50%,32rem)]"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div
                        className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-white/10 blur-3xl"
                        aria-hidden
                    />
                    <div className="relative z-10">
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-2.5 text-lg font-semibold tracking-tight text-white/95 transition-opacity hover:opacity-90"
                        >
                            <span className="flex size-10 items-center justify-center rounded-2xl bg-white/15 shadow-lg shadow-rose-950/30 ring-1 ring-white/20">
                                <AppLogoIcon className="size-6 fill-current" />
                            </span>
                            {appName}
                        </Link>
                    </div>

                    <div className="relative z-10 max-w-sm space-y-4">
                        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                            <ShieldX className="size-7 text-white" aria-hidden />
                        </div>
                        <h2 className="text-3xl font-semibold leading-tight tracking-tight">
                            Account access is disabled
                        </h2>
                        <p className="text-sm leading-relaxed text-rose-100/90">
                            Your credentials may be correct, but this account is not permitted to sign in. Contact your
                            clinic administrator if you believe this is a mistake.
                        </p>
                    </div>

                    <p className="relative z-10 text-xs text-rose-200/80">
                        © {new Date().getFullYear()}
                    </p>
                </motion.aside>

                <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-12">
                    <motion.div
                        className="w-full max-w-[440px]"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
                    >
                        <div
                            className={cn(
                                'rounded-2xl border border-slate-200/80 bg-white/90 p-8 shadow-xl shadow-rose-500/10 ring-1 ring-slate-200/50',
                                'dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:ring-zinc-800/60',
                            )}
                        >
                            <div className="mb-6 flex flex-col items-center text-center">
                                <Link
                                    href={home()}
                                    className="mb-5 flex items-center gap-2.5 font-semibold text-foreground lg:hidden"
                                >
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/40">
                                        <AppLogoIcon className="size-6 fill-current text-rose-700 dark:text-rose-300" />
                                    </span>
                                    <span>{appName}</span>
                                </Link>

                                <div className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-rose-500/10 ring-1 ring-rose-500/20">
                                    <ShieldX className="size-8 text-rose-600 dark:text-rose-400" aria-hidden />
                                </div>

                                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                    Access denied
                                </h1>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    Your user account has been disabled for sign-in. You can return to the login page or
                                    reach out to your organisation administrator to restore access.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                                <Button asChild className="h-11 rounded-xl bg-indigo-600 px-6 font-medium hover:bg-indigo-700">
                                    <Link href="/login">Back to login</Link>
                                </Button>
                                <Button asChild variant="outline" className="h-11 rounded-xl">
                                    <Link href={home()}>Home</Link>
                                </Button>
                            </div>

                            <div className="mt-8 flex items-start gap-3 rounded-xl border border-dashed border-muted-foreground/25 bg-muted/30 p-4 text-left text-sm text-muted-foreground">
                                <HeartPulse className="mt-0.5 size-4 shrink-0 text-rose-600 dark:text-rose-400" aria-hidden />
                                <div className="space-y-1">
                                    <p className="font-medium text-foreground">Still need help?</p>
                                    <p>
                                        Administrators can re-enable your account under{' '}
                                        <span className="font-medium text-foreground">Staff Management</span> → User
                                        account → Login allowed.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </>
    );
}
