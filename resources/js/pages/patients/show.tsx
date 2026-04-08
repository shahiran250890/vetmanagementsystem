import InputError from '@/components/input-error';
import PatientHistoryTimeline from '@/components/patients/patient-history-timeline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import type { BreadcrumbItem } from '@/types';

type Patient = {
    id: number;
    name: string;
    species: string;
    status: string;
    breed: string | null;
    sex: string | null;
    date_of_birth: string | null;
    color: string | null;
    microchip_number: string | null;
    user?: {
        name: string;
    } | null;
    allergies: string | null;
    current_medications: string | null;
    latest_weight_kg: string | null;
    vaccination_status: string | null;
    notes: string | null;
    history_entries: Array<{
        id: number;
        entry_date: string;
        visit_case_number?: string | null;
        visit_at?: string | null;
        clinic_location?: string | null;
        visit_type?: string | null;
        visit_status?: string | null;
        appointment_id?: string | null;
        entry_type: string | null;
        title: string;
        details: string;
        creator?: {
            name: string;
        } | null;
    }>;
};

export default function ShowPatient({ patient }: { patient: Patient }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Patients', href: '/patients' },
        { title: patient.name, href: `/patients/${patient.id}` },
    ];

    const historyForm = useForm({
        entry_date: '',
        visit_case_number: '',
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
        historyForm.post(`/patients/${patient.id}/history`, {
            preserveScroll: true,
            onSuccess: () => historyForm.reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={patient.name} />
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">{patient.name}</h1>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link href={`/patients/${patient.id}/edit`}>Edit</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/patients">Back</Link>
                        </Button>
                    </div>
                </div>

                <section className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-muted-foreground">Species</p>
                        <p>{patient.species}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p>{patient.status}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Owner</p>
                        <p>{patient.user?.name ?? '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Microchip</p>
                        <p>{patient.microchip_number ?? '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Weight</p>
                        <p>{patient.latest_weight_kg ?? '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Vaccination</p>
                        <p>{patient.vaccination_status ?? '-'}</p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">Allergies</p>
                        <p>{patient.allergies ?? '-'}</p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">
                            Current medications
                        </p>
                        <p>{patient.current_medications ?? '-'}</p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">Clinical notes</p>
                        <p>{patient.notes ?? '-'}</p>
                    </div>
                </section>

                <section className="space-y-4 rounded-lg border p-4">
                    <h2 className="text-lg font-medium">Clinical history</h2>
                    <PatientHistoryTimeline entries={patient.history_entries} />
                </section>

                <section className="space-y-4 rounded-lg border p-4">
                    <h2 className="text-lg font-medium">Add history entry</h2>

                    <form onSubmit={submitHistory} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="visit_case_number">
                                    Visit ID / Case Number
                                </Label>
                                <Input
                                    id="visit_case_number"
                                    value={historyForm.data.visit_case_number}
                                    onChange={(event) =>
                                        historyForm.setData(
                                            'visit_case_number',
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="entry_date">Date</Label>
                                <Input
                                    id="entry_date"
                                    type="date"
                                    value={historyForm.data.entry_date}
                                    onChange={(event) =>
                                        historyForm.setData(
                                            'entry_date',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError message={historyForm.errors.entry_date} />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="visit_at">Visit Date & Time</Label>
                                <Input
                                    id="visit_at"
                                    type="datetime-local"
                                    value={historyForm.data.visit_at}
                                    onChange={(event) =>
                                        historyForm.setData(
                                            'visit_at',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError message={historyForm.errors.visit_at} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="clinic_location">
                                    Clinic Location / Branch
                                </Label>
                                <Input
                                    id="clinic_location"
                                    value={historyForm.data.clinic_location}
                                    onChange={(event) =>
                                        historyForm.setData(
                                            'clinic_location',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={historyForm.errors.clinic_location}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="veterinarian_user_id">
                                    Veterinarian ID
                                </Label>
                                <Input
                                    id="veterinarian_user_id"
                                    value={historyForm.data.veterinarian_user_id}
                                    onChange={(event) =>
                                        historyForm.setData(
                                            'veterinarian_user_id',
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="assistant_user_id">
                                    Assistant / Nurse ID
                                </Label>
                                <Input
                                    id="assistant_user_id"
                                    value={historyForm.data.assistant_user_id}
                                    onChange={(event) =>
                                        historyForm.setData(
                                            'assistant_user_id',
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="visit_type">Visit Type</Label>
                                <select
                                    id="visit_type"
                                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                                    value={historyForm.data.visit_type}
                                    onChange={(event) =>
                                        historyForm.setData(
                                            'visit_type',
                                            event.target.value,
                                        )
                                    }
                                >
                                    <option value="consultation">
                                        Consultation
                                    </option>
                                    <option value="vaccination">Vaccination</option>
                                    <option value="surgery">Surgery</option>
                                    <option value="emergency">Emergency</option>
                                    <option value="grooming_medical_check">
                                        Grooming medical check
                                    </option>
                                    <option value="follow_up">Follow-up</option>
                                </select>
                                <InputError message={historyForm.errors.visit_type} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="visit_status">Status</Label>
                                <select
                                    id="visit_status"
                                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                                    value={historyForm.data.visit_status}
                                    onChange={(event) =>
                                        historyForm.setData(
                                            'visit_status',
                                            event.target.value,
                                        )
                                    }
                                >
                                    <option value="waiting">Waiting</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <InputError
                                    message={historyForm.errors.visit_status}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="appointment_id">
                                    Appointment ID (optional)
                                </Label>
                                <Input
                                    id="appointment_id"
                                    value={historyForm.data.appointment_id}
                                    onChange={(event) =>
                                        historyForm.setData(
                                            'appointment_id',
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="entry_type">Entry Type (optional)</Label>
                            <Input
                                id="entry_type"
                                value={historyForm.data.entry_type}
                                onChange={(event) =>
                                    historyForm.setData(
                                        'entry_type',
                                        event.target.value,
                                    )
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={historyForm.data.title}
                                onChange={(event) =>
                                    historyForm.setData('title', event.target.value)
                                }
                            />
                            <InputError message={historyForm.errors.title} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="details">Details</Label>
                            <textarea
                                id="details"
                                className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={historyForm.data.details}
                                onChange={(event) =>
                                    historyForm.setData('details', event.target.value)
                                }
                            />
                            <InputError message={historyForm.errors.details} />
                        </div>

                        <Button type="submit" disabled={historyForm.processing}>
                            Add entry
                        </Button>
                    </form>
                </section>
            </div>
        </AppLayout>
    );
}
