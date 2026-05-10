import { Head, useForm } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';
import { useMemo, useState } from 'react';

import {
    MedicalCertificateTab,
    MedicalHistoryTab,
    NewMedicalRecordTab,
    PatientHeader,
    PatientInformationTab,
    PatientTabs,
} from '@/components/patients';
import type {
    NewMedicalRecordFormData,
    PatientWorkspaceTab,
} from '@/components/patients';
import AppLayout from '@/layouts/app-layout';
import {
    index as patientsIndex,
    show as showPatient,
} from '@/routes/patients';
import { store as storeHistory } from '@/routes/patients/history';
import type { BreadcrumbItem, PatientRecord } from '@/types';

const defaultTab: PatientWorkspaceTab = 'information';
const tabs: PatientWorkspaceTab[] = [
    'information',
    'history',
    'new-record',
    'medical-certificate',
];

function tabFromUrl(canManageMedicalCertificates: boolean): PatientWorkspaceTab {
    if (typeof window === 'undefined') {
        return defaultTab;
    }

    const tab = new URLSearchParams(window.location.search).get('tab');

    if (!tabs.includes(tab as PatientWorkspaceTab)) {
        return defaultTab;
    }

    if (tab === 'medical-certificate' && !canManageMedicalCertificates) {
        return defaultTab;
    }

    return tab as PatientWorkspaceTab;
}

export default function PatientManagementPage({
    patient,
    canManageMedicalCertificates = false,
}: {
    patient: PatientRecord;
    canManageMedicalCertificates?: boolean;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Patients', href: patientsIndex() },
        { title: patient.name, href: showPatient(patient.id) },
    ];

    const initialTab = useMemo(
        () => tabFromUrl(canManageMedicalCertificates),
        [canManageMedicalCertificates],
    );
    const [activeTab, setActiveTab] =
        useState<PatientWorkspaceTab>(initialTab);
    const [mountedTabs, setMountedTabs] = useState<Set<PatientWorkspaceTab>>(
        () => new Set([initialTab]),
    );

    const historyForm = useForm<NewMedicalRecordFormData>({
        entry_date: '',
        visit_at: '',
        clinic_location: '',
        veterinarian_user_id: '',
        assistant_user_id: '',
        visit_type: 'consultation',
        appointment_id: '',
        visit_status: 'waiting',
        entry_type: '',
        title: '',
        details: '',
    });

    const submitHistory = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        historyForm.post(storeHistory.url(patient.id), {
            preserveScroll: true,
            onSuccess: () => historyForm.reset(),
        });
    };

    const selectTab = (tab: PatientWorkspaceTab) => {
        if (tab === 'medical-certificate' && !canManageMedicalCertificates) {
            return;
        }

        setActiveTab(tab);
        setMountedTabs((current) => new Set(current).add(tab));

        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', tab);
            window.history.replaceState({}, '', url);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={patient.name} />
            <div className="mx-auto max-w-7xl space-y-6">
                <PatientHeader
                    patient={patient}
                    canManageMedicalCertificates={canManageMedicalCertificates}
                    onOpenTab={selectTab}
                />

                <PatientTabs
                    activeTab={activeTab}
                    onChange={selectTab}
                    canManageMedicalCertificates={canManageMedicalCertificates}
                />

                <section className="min-h-[32rem]">
                    {mountedTabs.has('information') ? (
                        <TabPanel activeTab={activeTab} tab="information">
                            <PatientInformationTab patient={patient} />
                        </TabPanel>
                    ) : null}

                    {mountedTabs.has('history') ? (
                        <TabPanel activeTab={activeTab} tab="history">
                            <MedicalHistoryTab patient={patient} />
                        </TabPanel>
                    ) : null}

                    {mountedTabs.has('new-record') ? (
                        <TabPanel activeTab={activeTab} tab="new-record">
                            <NewMedicalRecordTab
                                data={historyForm.data}
                                errors={historyForm.errors}
                                processing={historyForm.processing}
                                onSubmit={submitHistory}
                                onSetData={historyForm.setData}
                                onReset={() => historyForm.reset()}
                                patientType={patient.patient_type}
                            />
                        </TabPanel>
                    ) : null}

                    {canManageMedicalCertificates &&
                    mountedTabs.has('medical-certificate') ? (
                        <TabPanel
                            activeTab={activeTab}
                            tab="medical-certificate"
                        >
                            <MedicalCertificateTab patient={patient} />
                        </TabPanel>
                    ) : null}
                </section>
            </div>
        </AppLayout>
    );
}

function TabPanel({
    activeTab,
    tab,
    children,
}: {
    activeTab: PatientWorkspaceTab;
    tab: PatientWorkspaceTab;
    children: ReactNode;
}) {
    const isActive = activeTab === tab;

    return (
        <div
            id={`patient-panel-${tab}`}
            role="tabpanel"
            aria-labelledby={`patient-tab-${tab}`}
            hidden={!isActive}
            tabIndex={0}
            className="animate-in fade-in-50 duration-200"
        >
            {children}
        </div>
    );
}
