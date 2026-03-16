import { Head } from '@inertiajs/react';

type Props = {
    title?: string;
    message?: string;
};

export default function TenantDisabled({
    title = 'Site unavailable',
    message = 'This site is currently not accessible. Please contact your administrator for assistance.',
}: Props) {
    return (
        <>
            <Head title={title} />
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFDFC] px-6 py-10 text-[#1b1b18] dark:bg-[#0a0a0a]">
                <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.25)] ring-1 ring-black/5 dark:bg-[#161615] dark:text-[#EDEDEC] dark:ring-white/10">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF3C7] text-[#92400E] dark:bg-[#451A03] dark:text-[#FBBF24]">
                        <span className="text-xl font-semibold">!</span>
                    </div>
                    <h1 className="mb-2 text-xl font-semibold tracking-tight">{title}</h1>
                    <p className="mb-6 text-sm leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
                        {message}
                    </p>
                    <div className="flex flex-col gap-3 text-sm">
                        <p className="text-xs text-[#8A8984] dark:text-[#7C7B75]">
                            If you believe this is a mistake, please reach out to your system
                            administrator or support team and provide your site address.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

