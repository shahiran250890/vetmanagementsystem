/// <reference types="vitest/config" />

import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import path from 'path';

// universal PHP binary (works everywhere)
const phpBinary = process.env.PHP_BINARY || 'php';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['resources/js/**/*.test.ts'],
    },
    /*
     * Herd/Valet TLS auto-detection can make the dev server HTTPS on *.test while you
     * browse the site over HTTP — scripts then fail to load. IPv6 [::1] in public/hot is
     * also unreliable from some browsers. Use plain HTTP on 127.0.0.1.
     */
    server: {
        host: '127.0.0.1',
        port: 5173,
        strictPort: true,
        hmr: {
            host: '127.0.0.1',
        },
    },

    plugins: [
        laravel({
            detectTls: false,
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),

        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),

        tailwindcss(),

        wayfinder({
            formVariants: true,
            command: `"${phpBinary}" artisan wayfinder:generate --with-form`,
        }),
    ],

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },

    esbuild: {
        jsx: 'automatic',
    },

    build: {
        sourcemap: false,
        chunkSizeWarningLimit: 1200,
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ['react', 'react-dom'],
                },
            },
        },
    },
});
