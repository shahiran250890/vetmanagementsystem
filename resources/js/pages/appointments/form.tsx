import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { FormInput } from '@/components/form-input';
import {
    FormPageContent,
    formPageFormClassName,
    formPagePrimarySubmitClassName,
} from '@/components/form-page-layout';
import { LoadingSpinner } from '@/components/loading-spinner';
import { SelectDropdown  } from '@/components/select-dropdown';
import type {SelectOption} from '@/components/select-dropdown';
import { useToast } from '@/contexts/toast-context';
import { useAuthRoles } from '@/hooks/use-auth-roles';
import AppLayout from '@/layouts/app-layout';
import { appointmentService } from '@/services/appointment-service';
import { lookupService } from '@/services/lookup-service';
import { patientService } from '@/services/patient-service';
import type { BreadcrumbItem } from '@/types';
import type { DoctorOption, Patient } from '@/types/clinic-models';

const typeOptions: SelectOption[] = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'walk_in', label: 'Walk-in' },
];

const statusOptions: SelectOption[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

export default function AppointmentForm({
    appointmentId,
}: {
    appointmentId?: number;
}) {
    const { push } = useToast();
    const { hasAnyRole, auth } = useAuthRoles();
    const isEdit = appointmentId != null;
    const lockDoctorField =
        hasAnyRole('doctor') &&
        !hasAnyRole('admin', 'superadmin', 'receptionist');

    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<DoctorOption[]>([]);
    const [patientId, setPatientId] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [dt, setDt] = useState('');
    const [type, setType] = useState('scheduled');
    const [status, setStatus] = useState('pending');
    const [notes, setNotes] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Appointments', href: '/appointments' },
        {
            title: isEdit ? 'Edit' : 'Create',
            href: isEdit
                ? `/appointments/${appointmentId}/edit`
                : '/appointments/create',
        },
    ];

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const [plist, dlist] = await Promise.all([
                patientService.list({ per_page: 100, page: 1 }),
                lookupService.doctors(),
            ]);

            if (cancelled) {
                return;
            }

            setPatients(plist.items);
            setDoctors(dlist);

            if (auth.user && lockDoctorField) {
                setDoctorId(String(auth.user.id));
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [auth.user, lockDoctorField]);

    useEffect(() => {
        if (appointmentId == null) {
            return;
        }

        let cancelled = false;
        (async () => {
            try {
                const a = await appointmentService.get(appointmentId);

                if (cancelled) {
                    return;
                }

                setPatientId(String(a.patient_id));
                setDoctorId(String(a.doctor_id));
                const raw = a.appointment_datetime ?? '';
                setDt(raw ? raw.slice(0, 16) : '');
                setType(a.type);
                setStatus(a.status);
                setNotes(a.notes ?? '');
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [appointmentId]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        const payload = {
            patient_id: Number(patientId),
            doctor_id: Number(doctorId),
            appointment_datetime: new Date(dt)
                .toISOString()
                .slice(0, 19)
                .replace('T', ' '),
            type,
            status,
            notes: notes || null,
        };

        try {
            if (isEdit && appointmentId != null) {
                await appointmentService.update(appointmentId, payload);
                push('Appointment updated.', 'success');
            } else {
                await appointmentService.create(payload);
                push('Appointment created.', 'success');
            }

            router.visit('/appointments');
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={isEdit ? 'Edit appointment' : 'New appointment'} />
                <LoadingSpinner />
            </AppLayout>
        );
    }

    const patientOpts: SelectOption[] = patients.map((p) => ({
        value: String(p.id),
        label: `${p.name} (${p.patient_type})`,
    }));
    const doctorOpts: SelectOption[] = doctors.map((d) => ({
        value: String(d.id),
        label: d.name,
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit appointment' : 'New appointment'} />
            <FormPageContent
                title={isEdit ? 'Edit appointment' : 'New appointment'}
                backHref="/appointments"
            >
                <form
                    onSubmit={(e) => void onSubmit(e)}
                    className={formPageFormClassName}
                >
                    <SelectDropdown
                        label="Patient"
                        name="patient_id"
                        options={patientOpts}
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        required
                    />
                    <SelectDropdown
                        label="Doctor"
                        name="doctor_id"
                        options={doctorOpts}
                        value={doctorId}
                        onChange={(e) => setDoctorId(e.target.value)}
                        required
                        disabled={lockDoctorField && !isEdit}
                    />
                    <FormInput
                        label="Date & time"
                        name="appointment_datetime"
                        type="datetime-local"
                        value={dt}
                        onChange={(e) => setDt(e.target.value)}
                        required
                    />
                    <SelectDropdown
                        label="Type"
                        name="type"
                        options={typeOptions}
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    />
                    <SelectDropdown
                        label="Status"
                        name="status"
                        options={statusOptions}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    />
                    <FormInput
                        label="Notes"
                        name="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={submitting}
                        className={formPagePrimarySubmitClassName}
                    >
                        {submitting ? 'Saving…' : 'Save'}
                    </button>
                </form>
            </FormPageContent>
        </AppLayout>
    );
}
