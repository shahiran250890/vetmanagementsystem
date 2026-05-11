import 'axios';

declare module 'axios' {
    interface AxiosRequestConfig {
        /** When true, the global API error toast is not shown (caller handles feedback). */
        skipErrorToast?: boolean;
    }
}
