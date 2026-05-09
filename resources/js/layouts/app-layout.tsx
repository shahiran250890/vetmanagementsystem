import MainLayout from '@/layouts/main-layout';
import type { AppLayoutProps } from '@/types';

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <MainLayout breadcrumbs={breadcrumbs} {...props}>
        {children}
    </MainLayout>
);
