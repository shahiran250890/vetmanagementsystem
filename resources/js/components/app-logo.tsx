import { usePage } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/90 via-primary to-primary/70 text-primary-foreground shadow-sm ring-1 ring-primary/25">
                <Sparkles className="size-4" aria-hidden />
            </div>
            <div className="ml-1 grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold tracking-tight">{name}</span>
                <span className="text-muted-foreground truncate text-[11px] font-medium tracking-wide uppercase">
                    Clinic workspace
                </span>
            </div>
        </>
    );
}
