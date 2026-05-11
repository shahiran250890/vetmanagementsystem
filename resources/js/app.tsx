import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApiToastBridge } from '@/components/api-toast-bridge';
import { ToastViewport } from '@/components/toast-viewport';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ToastProvider } from '@/contexts/toast-context';
import '../css/app.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import { initializeTheme } from '@/hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <TooltipProvider delayDuration={0}>
                    <ToastProvider>
                        <ApiToastBridge />
                        <ToastViewport />
                        <App {...props} />
                    </ToastProvider>
                </TooltipProvider>
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
