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
import { lookupService } from '@/services/lookup-service';
import { medicalRecordService } from '@/services/medical-record-service';
import { patientService } from '@/services/patient-service';
import type { BreadcrumbItem } from '@/types';
import type { DoctorOption, Patient } from '@/types/clinic-models';

export default function MedicalRecordForm({
    medicalRecordId,
}: {
    medicalRecordId?: number;
}) {
    const { push } = useToast();
    const { hasAnyRole, auth } = useAuthRoles();
    const isEdit = medicalRecordId != null;
    const lockDoctorField =
        hasAnyRole('doctor') &&
        !hasAnyRole('admin', 'superadmin', 'receptionist');

    const [loading, setLoading] = useState(isEdit);
    const [submitting, setSubmitting] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<DoctorOption[]>([]);
    const [patientId, setPatientId] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [appointmentId, setAppointmentId] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');
    const [notes, setNotes] = useState('');
    const [rxName, setRxName] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Medical records', href: '/medical-records' },
        {
            title: isEdit ? 'Edit' : 'Create',
            href: isEdit
                ? `/medical-records/${medicalRecordId}/edit`
                : '/medical-records/create',
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
        if (medicalRecordId == null) {
            return;
        }

        let cancelled = false;
        (async () => {
            try {
                const r = await medicalRecordService.get(medicalRecordId);

                if (cancelled) {
                    return;
                }

                setPatientId(String(r.patient_id));
                setDoctorId(String(r.doctor_id));
                setAppointmentId(r.appointment_id ? String(r.appointment_id) : '');
                setSymptoms(r.symptoms ?? '');
                setDiagnosis(r.diagnosis ?? '');
                setTreatment(r.treatment ?? '');
                setNotes(r.notes ?? '');
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [medicalRecordId]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        const prescriptions = rxName.trim()
            ? [
                  {
                      medicine_name: rxName.trim(),
                      dosage: null,
                      duration: null,
                      instructions: null,
                  },
              ]
            : [];
        const payload: Record<string, unknown> = {
            patient_id: Number(patientId),
            doctor_id: Number(doctorId),
            appointment_id: appointmentId ? Number(appointmentId) : null,
            symptoms: symptoms || null,
            diagnosis: diagnosis || null,
            treatment: treatment || null,
            notes: notes || null,
            prescriptions,
        };

        try {
            if (isEdit && medicalRecordId != null) {
                await medicalRecordService.update(medicalRecordId, {
                    patient_id: Number(patientId),
                    doctor_id: Number(doctorId),
                    appointment_id: appointmentId ? Number(appointmentId) : null,
                    symptoms: symptoms || null,
                    diagnosis: diagnosis || null,
                    treatment: treatment || null,
                    notes: notes || null,
                });
                push('Medical record updated.', 'success');
            } else {
                await medicalRecordService.create(payload);
                push('Medical record created.', 'success');
            }

            router.visit('/medical-records');
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={isEdit ? 'Edit medical record' : 'New medical record'} />
                <LoadingSpinner />
            </AppLayout>
        );
    }

    const patientOpts: SelectOption[] = patients.map((p) => ({
        value: String(p.id),
        label: p.name,
    }));
    const doctorOpts: SelectOption[] = doctors.map((d) => ({
        value: String(d.id),
        label: d.name,
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit medical record' : 'New medical record'} />
            <FormPageContent
                title={isEdit ? 'Edit medical record' : 'New medical record'}
                backHref="/medical-records"
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
                        label="Appointment ID (optional)"
                        name="appointment_id"
                        type="number"
                        value={appointmentId}
                        onChange={(e) => setAppointmentId(e.target.value)}
                    />
                    <FormInput
                        label="Symptoms"
                        name="symptoms"
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                    />
                    <FormInput
                        label="Diagnosis"
                        name="diagnosis"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                    />
                    <FormInput
                        label="Treatment"
                        name="treatment"
                        value={treatment}
                        onChange={(e) => setTreatment(e.target.value)}
                    />
                    <FormInput
                        label="Notes"
                        name="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                    {!isEdit ? (
                        <FormInput
                            label="Prescription (medicine name, optional)"
                            name="rx"
                            value={rxName}
                            onChange={(e) => setRxName(e.target.value)}
                        />
                    ) : null}
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
