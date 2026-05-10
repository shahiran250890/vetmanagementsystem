/**
 * Client-side validation for patient create/update. Align with
 * `App\Modules\Patients\Http\Requests\StorePatientRequest` / `UpdatePatientRequest`
 * (subset; `unique`, `exists`, … stay server-only).
 */

import { z } from 'zod';

import type { PatientFormData, PatientType } from '@/types/patient';

export type PatientFormSchemaContext = {
    allowedPatientTypes: readonly PatientType[];
};

function endOfToday(): Date {
    const d = new Date();

    d.setHours(23, 59, 59, 999);

    return d;
}

export function createPatientFormSchema(context: PatientFormSchemaContext): z.ZodType<PatientFormData> {
    const allowed = context.allowedPatientTypes;

    if (allowed.length === 0) {
        throw new Error('createPatientFormSchema requires at least one allowed patient type.');
    }

    const patientTypeSchema = z.enum(allowed as [PatientType, ...PatientType[]]);

    return z
        .object({
            patient_type: patientTypeSchema,
            name: z.string(),
            sex: z.union([z.literal(''), z.literal('1'), z.literal('2')]),
            date_of_birth: z.string(),
            emergency_contact_name: z.string(),
            emergency_contact_phone: z.string(),
            allergies: z.string(),
            current_medications: z.string(),
            status: z.enum(['active', 'deceased', 'transferred']),
            notes: z.string(),
            animal_profile: z.object({
                owner_user_id: z.string(),
                species: z.string(),
                breed: z.string(),
                color: z.string(),
                microchip_number: z.string(),
                latest_weight_kg: z.string(),
                vaccination_status: z.string(),
            }),
            human_profile: z.object({
                identification_number: z.string(),
                blood_type_id: z.string(),
                primary_phone: z.string(),
                address: z.string(),
                height_cm: z.string(),
                weight_kg: z.string(),
                blood_pressure: z.string(),
                vital_medical_information: z.string(),
            }),
        })
        .superRefine((data, refinementCtx) => {
            const name = data.name.trim();

            if (name === '') {
                refinementCtx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Please provide the patient name.',
                    path: ['name'],
                });
            } else if (name.length > 255) {
                refinementCtx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Name must not exceed 255 characters.',
                    path: ['name'],
                });
            }

            const dob = data.date_of_birth.trim();

            if (dob !== '') {
                const d = new Date(`${dob}T12:00:00`);

                if (Number.isNaN(d.getTime())) {
                    refinementCtx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Enter a valid date of birth.',
                        path: ['date_of_birth'],
                    });
                } else if (d > endOfToday()) {
                    refinementCtx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Date of birth cannot be in the future.',
                        path: ['date_of_birth'],
                    });
                }
            }

            if (data.emergency_contact_name.trim().length > 255) {
                refinementCtx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Emergency contact name must not exceed 255 characters.',
                    path: ['emergency_contact_name'],
                });
            }

            if (data.emergency_contact_phone.trim().length > 50) {
                refinementCtx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Emergency contact phone must not exceed 50 characters.',
                    path: ['emergency_contact_phone'],
                });
            }

            if (data.patient_type === 'animal') {
                const ap = data.animal_profile;

                if (!ap.species.trim()) {
                    refinementCtx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Please provide the species for animal patients.',
                        path: ['animal_profile', 'species'],
                    });
                } else if (ap.species.length > 255) {
                    refinementCtx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Species must not exceed 255 characters.',
                        path: ['animal_profile', 'species'],
                    });
                }

                if (ap.breed.length > 255) {
                    refinementCtx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Breed must not exceed 255 characters.',
                        path: ['animal_profile', 'breed'],
                    });
                }

                if (ap.color.length > 255) {
                    refinementCtx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Color must not exceed 255 characters.',
                        path: ['animal_profile', 'color'],
                    });
                }

                if (ap.microchip_number.length > 255) {
                    refinementCtx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Microchip number must not exceed 255 characters.',
                        path: ['animal_profile', 'microchip_number'],
                    });
                }

                const w = ap.latest_weight_kg.trim();

                if (w !== '') {
                    const n = Number(w);

                    if (Number.isNaN(n) || n < 0 || n > 999.99) {
                        refinementCtx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Weight must be between 0 and 999.99 kg.',
                            path: ['animal_profile', 'latest_weight_kg'],
                        });
                    }
                }

                if (ap.vaccination_status.length > 255) {
                    refinementCtx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Vaccination status must not exceed 255 characters.',
                        path: ['animal_profile', 'vaccination_status'],
                    });
                }

                const owner = ap.owner_user_id.trim();

                if (owner !== '' && !/^\d+$/.test(owner)) {
                    refinementCtx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Select a valid owner.',
                        path: ['animal_profile', 'owner_user_id'],
                    });
                }
            }

            if (data.patient_type === 'human') {
                const hp = data.human_profile;

                if (!hp.identification_number.trim()) {
                    refinementCtx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Please provide IC/Passport for human patients.',
                        path: ['human_profile', 'identification_number'],
                    });
                } else if (hp.identification_number.length > 255) {
                    refinementCtx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Identification number must not exceed 255 characters.',
                        path: ['human_profile', 'identification_number'],
                    });
                }

                const bt = hp.blood_type_id.trim();

                if (bt !== '' && !/^\d+$/.test(bt)) {
                    refinementCtx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Select a valid blood type.',
                        path: ['human_profile', 'blood_type_id'],
                    });
                }

                if (!hp.primary_phone.trim()) {
                    refinementCtx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Please provide phone number for human patients.',
                        path: ['human_profile', 'primary_phone'],
                    });
                } else if (hp.primary_phone.length > 50) {
                    refinementCtx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Primary phone must not exceed 50 characters.',
                        path: ['human_profile', 'primary_phone'],
                    });
                }

                const height = hp.height_cm.trim();

                if (height !== '') {
                    const n = Number(height);

                    if (Number.isNaN(n) || n < 30 || n > 260) {
                        refinementCtx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Height must be between 30 and 260 cm.',
                            path: ['human_profile', 'height_cm'],
                        });
                    }
                }

                const weight = hp.weight_kg.trim();

                if (weight !== '') {
                    const n = Number(weight);

                    if (Number.isNaN(n) || n < 1 || n > 500) {
                        refinementCtx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Weight must be between 1 and 500 kg.',
                            path: ['human_profile', 'weight_kg'],
                        });
                    }
                }

                if (hp.blood_pressure.length > 20) {
                    refinementCtx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Blood pressure must not exceed 20 characters.',
                        path: ['human_profile', 'blood_pressure'],
                    });
                }
            }
        }) as z.ZodType<PatientFormData>;
}
