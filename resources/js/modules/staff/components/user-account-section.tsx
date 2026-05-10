import { FormInput } from '@/components/form-input';
import FormStatusToggle from '@/components/form-status-toggle';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import type { StaffMember } from '../types';

export function UserAccountSection({
    managedStaff,
    errors,
    enableLogin,
    onEnableLoginChange,
    isEnabled,
    onIsEnabledChange,
    showPasswordFields,
    onTogglePasswordFields,
}: {
    managedStaff?: StaffMember;
    errors: Record<string, string>;
    enableLogin: boolean;
    onEnableLoginChange: (value: boolean) => void;
    isEnabled: boolean;
    onIsEnabledChange: (value: boolean) => void;
    showPasswordFields: boolean;
    onTogglePasswordFields: () => void;
}) {
    return (
        <div className="space-y-4">
            <input type="hidden" name="enable_login" value={enableLogin ? '1' : '0'} />
            {!enableLogin && <input type="hidden" name="is_enabled" value="0" />}
            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                <Label htmlFor="enable_login_toggle">Enable login account</Label>
                <button
                    id="enable_login_toggle"
                    type="button"
                    className={`inline-flex h-7 min-w-28 items-center justify-center rounded-full px-3 text-xs font-medium transition ${enableLogin ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                    onClick={() => onEnableLoginChange(!enableLogin)}
                >
                    {enableLogin ? 'Yes' : 'No'}
                </button>
            </div>

            {enableLogin && (
                <>
                    <FormInput
                        label="Login email *"
                        name="account_email"
                        type="email"
                        aria-required={enableLogin}
                        defaultValue={managedStaff?.account_email ?? ''}
                        error={errors.account_email}
                    />

                    <FormStatusToggle
                        id="is_enabled_toggle"
                        name="is_enabled"
                        label="Account enabled"
                        enabledText="Enabled"
                        disabledText="Disabled"
                        checked={isEnabled}
                        onChange={onIsEnabledChange}
                    />

                    <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-muted-foreground">
                            Two-factor authentication:{' '}
                            <strong className="text-foreground">
                                {managedStaff?.two_factor_confirmed_at ? 'Configured' : 'Not configured'}
                            </strong>
                        </span>
                    </div>

                    <div>
                        <Button type="button" variant="outline" onClick={onTogglePasswordFields}>
                            {showPasswordFields ? 'Cancel password change' : 'Set / change password'}
                        </Button>
                    </div>

                    {showPasswordFields && (
                        <>
                            <FormInput
                                label="Password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                error={errors.password}
                            />
                            <FormInput
                                label="Confirm password"
                                name="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                error={errors.password_confirmation}
                            />
                        </>
                    )}
                </>
            )}
        </div>
    );
}
