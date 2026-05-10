import { describe, expect, it } from 'vitest';

import type { PatientFormData } from '@/types/patient';

import { createPatientFormSchema } from './patient-form-schema';

function baseAnimal(overrides: Partial<PatientFormData> = {}): PatientFormData {
    return {
        patient_type: 'animal',
        name: 'Rex',
        sex: '',
        date_of_birth: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        allergies: '',
        current_medications: '',
        status: 'active',
        notes: '',
        animal_profile: {
            owner_user_id: '',
            species: 'Canine',
            breed: '',
            color: '',
            microchip_number: '',
            latest_weight_kg: '',
            vaccination_status: '',
        },
        human_profile: {
            identification_number: '',
            blood_type_id: '',
            primary_phone: '',
            address: '',
            height_cm: '',
            weight_kg: '',
            blood_pressure: '',
            vital_medical_information: '',
        },
        ...overrides,
    };
}

describe('createPatientFormSchema', () => {
    it('rejects empty name', () => {
        const schema = createPatientFormSchema({ allowedPatientTypes: ['animal', 'human'] });
        const result = schema.safeParse(
            baseAnimal({
                name: '   ',
            }),
        );

        expect(result.success).toBe(false);
    });

    it('requires species for animal patients', () => {
        const schema = createPatientFormSchema({ allowedPatientTypes: ['animal', 'human'] });
        const result = schema.safeParse(
            baseAnimal({
                animal_profile: {
                    owner_user_id: '',
                    species: '',
                    breed: '',
                    color: '',
                    microchip_number: '',
                    latest_weight_kg: '',
                    vaccination_status: '',
                },
            }),
        );

        expect(result.success).toBe(false);
    });

    it('requires ic/passport and phone no for human patients', () => {
        const schema = createPatientFormSchema({ allowedPatientTypes: ['animal', 'human'] });
        const result = schema.safeParse({
            ...baseAnimal(),
            patient_type: 'human',
            animal_profile: {
                owner_user_id: '',
                species: '',
                breed: '',
                color: '',
                microchip_number: '',
                latest_weight_kg: '',
                vaccination_status: '',
            },
            human_profile: {
                identification_number: '   ',
                blood_type_id: '',
                primary_phone: '   ',
                address: '',
                height_cm: '',
                weight_kg: '',
                blood_pressure: '',
                vital_medical_information: '',
            },
        });

        expect(result.success).toBe(false);
    });
});
