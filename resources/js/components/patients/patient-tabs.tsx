import {
    ClipboardList,
    FileText,
    History,
    UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { KeyboardEvent } from 'react';

import { cn } from '@/lib/utils';

import type { PatientWorkspaceTab } from './types';

const tabs: Array<{
    value: PatientWorkspaceTab;
    label: string;
    description: string;
    icon: LucideIcon;
}> = [
    {
        value: 'information',
        label: 'Patient Information',
        description: 'Demographics and contacts',
        icon: UserRound,
    },
    {
        value: 'history',
        label: 'Medical History',
        description: 'Visits and timeline',
        icon: History,
    },
    {
        value: 'new-record',
        label: 'New Medical Record',
        description: 'Add consultation entry',
        icon: ClipboardList,
    },
    {
        value: 'medical-certificate',
        label: 'Medical Certificate (MC)',
        description: 'Issue and manage MCs',
        icon: FileText,
    },
];

export default function PatientTabs({
    activeTab,
    onChange,
    canManageMedicalCertificates,
}: {
    activeTab: PatientWorkspaceTab;
    onChange: (tab: PatientWorkspaceTab) => void;
    canManageMedicalCertificates: boolean;
}) {
    const visibleTabs = canManageMedicalCertificates
        ? tabs
        : tabs.filter((tab) => tab.value !== 'medical-certificate');

    const handleKeyDown = (
        event: KeyboardEvent<HTMLButtonElement>,
        currentIndex: number,
    ) => {
        const lastIndex = visibleTabs.length - 1;
        const nextIndex =
            event.key === 'ArrowRight'
                ? currentIndex === lastIndex
                    ? 0
                    : currentIndex + 1
                : event.key === 'ArrowLeft'
                  ? currentIndex === 0
                      ? lastIndex
                      : currentIndex - 1
                  : event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? lastIndex
                      : null;

        if (nextIndex === null) {
            return;
        }

        event.preventDefault();
        const nextTab = visibleTabs[nextIndex];
        onChange(nextTab.value);
        document.getElementById(`patient-tab-${nextTab.value}`)?.focus();
    };

    return (
        <div className="sticky top-0 z-30 border-b bg-background/95 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div
                role="tablist"
                aria-label="Patient workspace sections"
                className="flex gap-2 overflow-x-auto pb-1"
            >
                {visibleTabs.map((tab, index) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.value;

                    return (
                        <button
                            key={tab.value}
                            id={`patient-tab-${tab.value}`}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`patient-panel-${tab.value}`}
                            tabIndex={isActive ? 0 : -1}
                            onClick={() => onChange(tab.value)}
                            onKeyDown={(event) => handleKeyDown(event, index)}
                            className={cn(
                                'group flex min-w-56 items-center gap-3 rounded-2xl border px-4 py-3 text-left shadow-sm transition duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                                isActive
                                    ? 'border-primary/40 bg-primary text-primary-foreground shadow-md'
                                    : 'border-border bg-card hover:border-primary/30 hover:bg-muted/60',
                            )}
                        >
                            <span
                                className={cn(
                                    'flex size-9 items-center justify-center rounded-xl transition',
                                    isActive
                                        ? 'bg-primary-foreground/15'
                                        : 'bg-primary/10 text-primary',
                                )}
                            >
                                <Icon className="size-4" aria-hidden="true" />
                            </span>
                            <span className="grid gap-1">
                                <span className="text-sm font-semibold">
                                    {tab.label}
                                </span>
                                <span
                                    className={cn(
                                        'text-xs',
                                        isActive
                                            ? 'text-primary-foreground/80'
                                            : 'text-muted-foreground',
                                    )}
                                >
                                    {tab.description}
                                </span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
