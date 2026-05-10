import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { genderDisplayLabel } from '@/lib/gender-selection';

import type { Patient } from './types';

type Detail = {
    label: string;
    value: string | null | undefined;
};

function DetailCard({
    title,
    details,
}: {
    title: string;
    details: Detail[];
}) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
                {details.map((detail) => (
                    <div key={detail.label}>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {detail.label}
                        </p>
                        <p className="mt-1 text-sm font-medium">
                            {detail.value || '-'}
                        </p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

export default function PatientInformationTab({ patient }: { patient: Patient }) {
    const isAnimal = patient.patient_type === 'animal';

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <DetailCard
                title="Personal Information"
                details={[
                    { label: 'Full name', value: patient.name },
                    { label: 'MRN', value: `P-${String(patient.id).padStart(6, '0')}` },
                    { label: 'Patient type', value: patient.patient_type },
                    { label: 'Gender', value: genderDisplayLabel(patient.sex) },
                    { label: 'Date of birth', value: patient.date_of_birth },
                    { label: 'Status', value: patient.status },
                ]}
            />

            <DetailCard
                title="Contact Information"
                details={[
                    {
                        label: 'Primary phone',
                        value: patient.human_profile?.primary_phone,
                    },
                    {
                        label: 'Emergency phone',
                        value: patient.emergency_contact_phone,
                    },
                    {
                        label: 'Owner',
                        value: patient.user?.name,
                    },
                    {
                        label: 'Owner user ID',
                        value: patient.user_id ? String(patient.user_id) : null,
                    },
                ]}
            />

            <DetailCard
                title={isAnimal ? 'Animal Profile' : 'Clinical Profile'}
                details={
                    isAnimal
                        ? [
                              { label: 'Species', value: patient.species },
                              { label: 'Breed', value: patient.breed },
                              { label: 'Color', value: patient.color },
                              {
                                  label: 'Microchip number',
                                  value: patient.microchip_number,
                              },
                              {
                                  label: 'Latest weight',
                                  value: patient.latest_weight_kg
                                      ? `${patient.latest_weight_kg} kg`
                                      : null,
                              },
                              {
                                  label: 'Vaccination status',
                                  value: patient.vaccination_status,
                              },
                          ]
                        : [
                              {
                                  label: 'IC / Passport',
                                  value:
                                      patient.human_profile
                                          ?.identification_number,
                              },
                              {
                                  label: 'Blood group',
                                  value: patient.human_profile?.blood_type,
                              },
                              {
                                  label: 'Height',
                                  value: patient.human_profile?.height_cm
                                      ? `${patient.human_profile.height_cm} cm`
                                      : null,
                              },
                              {
                                  label: 'Weight',
                                  value: patient.human_profile?.weight_kg
                                      ? `${patient.human_profile.weight_kg} kg`
                                      : null,
                              },
                              {
                                  label: 'Blood pressure',
                                  value: patient.human_profile?.blood_pressure,
                              },
                              {
                                  label: 'Vital medical information',
                                  value:
                                      patient.human_profile
                                          ?.vital_medical_information,
                              },
                          ]
                }
            />

            <DetailCard
                title="Address"
                details={[
                    {
                        label: 'Residential address',
                        value: patient.human_profile?.address,
                    },
                    { label: 'Clinic branch', value: null },
                ]}
            />

            <DetailCard
                title="Emergency Contact"
                details={[
                    {
                        label: 'Name',
                        value: patient.emergency_contact_name,
                    },
                    {
                        label: 'Phone',
                        value: patient.emergency_contact_phone,
                    },
                    { label: 'Relationship', value: null },
                ]}
            />

            <DetailCard
                title="Insurance"
                details={[
                    { label: 'Provider', value: null },
                    { label: 'Policy number', value: null },
                    { label: 'Coverage notes', value: null },
                ]}
            />

            <DetailCard
                title="Next of Kin"
                details={[
                    { label: 'Name', value: null },
                    { label: 'Phone', value: null },
                    { label: 'Relationship', value: null },
                ]}
            />

            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Registration Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Allergies
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {patient.allergies ? (
                                    patient.allergies
                                        .split(/[,;\n]/)
                                        .map((allergy) => allergy.trim())
                                        .filter(Boolean)
                                        .map((allergy) => (
                                            <Badge
                                                key={allergy}
                                                variant="destructive"
                                            >
                                                {allergy}
                                            </Badge>
                                        ))
                                ) : (
                                    <span className="text-sm font-medium">
                                        -
                                    </span>
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Current medications
                            </p>
                            <p className="mt-1 text-sm font-medium">
                                {patient.current_medications ?? '-'}
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Clinical notes
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm">
                            {patient.notes ?? '-'}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
