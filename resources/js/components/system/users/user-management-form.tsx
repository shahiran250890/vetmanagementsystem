import { Form, Link } from '@inertiajs/react';
import { formPageSurfaceClassName } from '@/components/form-page-layout';
import FormStatusToggle from '@/components/form-status-toggle';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import usersRoutes from '@/routes/settings/system/users';

type Role = { id: number; name: string };

type User = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    is_enabled: boolean;
    roles: Role[];
};

type UserManagementFormProps = {
    isEdit: boolean;
    managedUser?: User;
    roles: Role[];
    formAction: string;
    formMethod: 'post' | 'put';
    selectedRoleIds: Set<number>;
    isEnabled: boolean;
    onIsEnabledChange: (value: boolean) => void;
    showPasswordFields: boolean;
    onTogglePasswordFields: () => void;
    formatRoleName: (roleName: string) => string;
};

export function UserManagementForm({
    isEdit,
    managedUser,
    roles,
    formAction,
    formMethod,
    selectedRoleIds,
    isEnabled,
    onIsEnabledChange,
    showPasswordFields,
    onTogglePasswordFields,
    formatRoleName,
}: UserManagementFormProps) {
    return (
        <Form
            action={formAction}
            method={formMethod}
            className={cn(formPageSurfaceClassName, 'space-y-4')}
        >
            {({ errors, processing }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" defaultValue={managedUser?.name} />
                        <InputError message={errors.name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" name="email" defaultValue={managedUser?.email} />
                        <InputError message={errors.email} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" defaultValue={managedUser?.phone ?? ''} />
                        <InputError message={errors.phone} />
                    </div>
                    {isEdit && (
                        <div>
                            <Button type="button" variant="outline" onClick={onTogglePasswordFields}>
                                {showPasswordFields ? 'Cancel password change' : 'Change password'}
                            </Button>
                        </div>
                    )}
                    {showPasswordFields && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" name="password" />
                                <InputError message={errors.password} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm password</Label>
                                <Input id="password_confirmation" type="password" name="password_confirmation" />
                            </div>
                        </>
                    )}
                    <div className="grid gap-2">
                        <Label>Roles</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {roles.map((role) => (
                                <label key={role.id} className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" name="role_ids[]" value={role.id} defaultChecked={selectedRoleIds.has(role.id)} />
                                    {formatRoleName(role.name)}
                                </label>
                            ))}
                        </div>
                    </div>
                    <FormStatusToggle
                        id="is_enabled_toggle"
                        name="is_enabled"
                        label="Status"
                        enabledText="Enabled"
                        disabledText="Disabled"
                        checked={isEnabled}
                        onChange={onIsEnabledChange}
                    />
                    <div className="flex gap-2">
                        <Button disabled={processing}>{isEdit ? 'Update' : 'Create'}</Button>
                        <Button variant="outline" asChild>
                            <Link href={usersRoutes.index.url()}>Back</Link>
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
