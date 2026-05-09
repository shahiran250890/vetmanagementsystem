import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { HeartPulse } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useMemo, useState } from 'react';

import AppLogoIcon from '@/components/app-logo-icon';
import { AuthFormField } from '@/components/auth/auth-form-field';
import {
    AuthPasswordInput,
    AuthTextInput,
} from '@/components/auth/auth-styled-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { home } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LoginPageProps = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: LoginPageProps) {
    const { name: appName } = usePage<{ name: string }>().props;

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            email: '',
            password: '',
            remember: false as boolean,
        });

    const [localErrors, setLocalErrors] = useState<{
        email?: string;
        password?: string;
    }>({});

    const emailError = localErrors.email ?? errors.email;
    const passwordError = localErrors.password ?? errors.password;

    const isSubmitDisabled = useMemo(() => {
        return (
            !data.email.trim() ||
            !data.password ||
            processing
        );
    }, [data.email, data.password, processing]);

    const validate = (): boolean => {
        const next: typeof localErrors = {};

        if (!data.email.trim()) {
            next.email = 'Email is required.';
        } else if (!emailPattern.test(data.email.trim())) {
            next.email = 'Please enter a valid email address.';
        }

        if (!data.password) {
            next.password = 'Password is required.';
        }

        setLocalErrors(next);

        return Object.keys(next).length === 0;
    };

    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        post(store.url(), {
            preserveScroll: true,
            onSuccess: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <div className="relative flex min-h-svh flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 dark:from-zinc-950 dark:via-zinc-950 dark:to-indigo-950/25 lg:flex-row">
                <motion.aside
                    className="relative hidden min-h-svh flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 px-10 py-14 text-white lg:flex lg:max-w-[min(50%,32rem)]"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div
                        className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-white/10 blur-3xl"
                        aria-hidden
                    />
                    <div
                        className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-blue-400/20 blur-3xl"
                        aria-hidden
                    />

                    <div className="relative z-10">
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-2.5 text-lg font-semibold tracking-tight text-white/95 transition-opacity hover:opacity-90"
                        >
                            <span className="flex size-10 items-center justify-center rounded-2xl bg-white/15 shadow-lg shadow-indigo-900/20 ring-1 ring-white/20">
                                <AppLogoIcon className="size-6 fill-current" />
                            </span>
                            {appName}
                        </Link>
                    </div>

                    <div className="relative z-10 max-w-sm space-y-4">
                        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                            <HeartPulse
                                className="size-6 text-white"
                                aria-hidden
                            />
                        </div>
                        <h2 className="text-3xl font-semibold leading-tight tracking-tight">
                            Care for every patient, every day.
                        </h2>
                        <p className="text-sm leading-relaxed text-indigo-100/90">
                            Sign in to access your practice dashboard, patient
                            records, and team tools in one secure place.
                        </p>
                    </div>

                    <p className="relative z-10 text-xs text-indigo-200/80">
                        © {new Date().getFullYear()} {appName}
                    </p>
                </motion.aside>

                <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-12">
                    <motion.div
                        className="w-full max-w-[400px]"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
                    >
                        <div
                            className={cn(
                                'rounded-2xl border border-slate-200/80 bg-white/80 p-8 shadow-xl shadow-indigo-500/5 ring-1 ring-slate-200/50',
                                'dark:border-zinc-800/80 dark:bg-zinc-900/70 dark:shadow-indigo-950/20 dark:ring-zinc-800/60',
                            )}
                        >
                            <div className="mb-8 flex flex-col items-center text-center">
                                <Link
                                    href={home()}
                                    className="mb-4 flex items-center gap-2.5 font-semibold text-foreground lg:hidden"
                                >
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50">
                                        <AppLogoIcon className="size-6 fill-current text-indigo-700 dark:text-indigo-300" />
                                    </span>
                                    <span>{appName}</span>
                                </Link>

                                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                    Welcome Back
                                </h1>
                                <p className="mt-1.5 text-sm text-muted-foreground">
                                    Please login to your account
                                </p>
                            </div>

                            <form
                                onSubmit={onSubmit}
                                className="flex flex-col gap-5"
                                noValidate
                            >
                                <AuthFormField
                                    id="email"
                                    label="Email"
                                    error={emailError}
                                >
                                    <AuthTextInput
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        autoFocus
                                        tabIndex={1}
                                        placeholder="you@example.com"
                                        value={data.email}
                                        aria-invalid={Boolean(emailError)}
                                        aria-describedby={
                                            emailError
                                                ? 'email-error'
                                                : undefined
                                        }
                                        onChange={(e) => {
                                            setData('email', e.target.value);
                                            setLocalErrors((p) => ({
                                                ...p,
                                                email: undefined,
                                            }));
                                            clearErrors('email');
                                        }}
                                    />
                                </AuthFormField>

                                <AuthFormField
                                    id="password"
                                    label="Password"
                                    error={passwordError}
                                >
                                    <AuthPasswordInput
                                        id="password"
                                        name="password"
                                        autoComplete="current-password"
                                        tabIndex={2}
                                        placeholder="Enter your password"
                                        value={data.password}
                                        aria-invalid={Boolean(passwordError)}
                                        aria-describedby={
                                            passwordError
                                                ? 'password-error'
                                                : undefined
                                        }
                                        onChange={(e) => {
                                            setData(
                                                'password',
                                                e.target.value,
                                            );
                                            setLocalErrors((p) => ({
                                                ...p,
                                                password: undefined,
                                            }));
                                            clearErrors('password');
                                        }}
                                    />
                                </AuthFormField>

                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                            checked={data.remember}
                                            onCheckedChange={(checked) =>
                                                setData(
                                                    'remember',
                                                    checked === true,
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor="remember"
                                            className="cursor-pointer text-sm font-normal text-muted-foreground"
                                        >
                                            Remember me
                                        </Label>
                                    </div>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            tabIndex={4}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    tabIndex={5}
                                    disabled={isSubmitDisabled}
                                    data-test="login-button"
                                    className={cn(
                                        'h-11 w-full rounded-xl text-base font-medium shadow-md shadow-indigo-500/25',
                                        'bg-indigo-600 text-white transition hover:bg-indigo-700',
                                        'focus-visible:ring-[3px] focus-visible:ring-indigo-500/40',
                                        'dark:bg-indigo-500 dark:hover:bg-indigo-400',
                                        'disabled:opacity-50',
                                    )}
                                >
                                    {processing ? (
                                        <>
                                            <Spinner className="size-5 text-white" />
                                            <span>Signing in…</span>
                                        </>
                                    ) : (
                                        'Log in'
                                    )}
                                </Button>
                            </form>

                            {status ? (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-6 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400"
                                >
                                    {status}
                                </motion.p>
                            ) : null}
                        </div>
                    </motion.div>
                </main>
            </div>
        </>
    );
}
