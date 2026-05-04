import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import AccountSettingsLayout from '@/layouts/settings/account-settings-layout';
import { edit as editAppearance } from '@/routes/appearance';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: editAppearance(),
    },
];

export default function Appearance() {
    return (
        <AccountSettingsLayout breadcrumbs={breadcrumbs} headTitle="Appearance settings">
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Appearance settings"
                        description="Update your account's appearance settings"
                    />
                    <AppearanceTabs />
                </div>
        </AccountSettingsLayout>
    );
}
