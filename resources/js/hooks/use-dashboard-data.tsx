import { usePage } from '@inertiajs/react';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

import { appointmentService } from '@/services/appointment-service';
import { billingService } from '@/services/billing-service';
import { patientService } from '@/services/patient-service';
import type { Appointment } from '@/types/clinic-models';

function todayISO(): string {
    return new Date().toISOString().slice(0, 10);
}

function addDaysISO(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);

    return d.toISOString().slice(0, 10);
}

export type DashboardDataState = {
    loading: boolean;
    patientTotal: number | null;
    todayAppointmentCount: number | null;
    recentRevenue: number | null;
    mySchedule: Appointment[] | null;
    error: string | null;
    refetch: () => void;
};

const DashboardDataContext = createContext<DashboardDataState | null>(null);

export function DashboardDataProvider({
    widgetIds,
    children,
}: {
    widgetIds: string[];
    children: ReactNode;
}) {
    const { auth } = usePage().props;
    const [loading, setLoading] = useState(true);
    const [patientTotal, setPatientTotal] = useState<number | null>(null);
    const [todayAppointmentCount, setTodayAppointmentCount] = useState<
        number | null
    >(null);
    const [recentRevenue, setRecentRevenue] = useState<number | null>(null);
    const [mySchedule, setMySchedule] = useState<Appointment[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);

        const day = todayISO();
        const until = addDaysISO(7);
        const userId = auth.user?.id;

        try {
            const promises: Promise<void>[] = [];

            if (widgetIds.includes('total_patients')) {
                promises.push(
                    (async () => {
                        const res = await patientService.list({
                            per_page: 1,
                            page: 1,
                        });
                        setPatientTotal(res.pagination.total);
                    })(),
                );
            }

            if (widgetIds.includes('today_appointments')) {
                promises.push(
                    (async () => {
                        const res = await appointmentService.list({
                            from_date: day,
                            to_date: day,
                            per_page: 100,
                            page: 1,
                        });
                        setTodayAppointmentCount(res.pagination.total);
                    })(),
                );
            }

            if (widgetIds.includes('recent_revenue')) {
                promises.push(
                    (async () => {
                        const res = await billingService.listBills({
                            status: 'paid',
                            per_page: 50,
                            page: 1,
                        });
                        const sum = res.items.reduce(
                            (acc, b) =>
                                acc + Number.parseFloat(b.total_amount || '0'),
                            0,
                        );
                        setRecentRevenue(sum);
                    })(),
                );
            }

            if (widgetIds.includes('my_schedule') && userId) {
                promises.push(
                    (async () => {
                        const res = await appointmentService.list({
                            doctor_id: userId,
                            from_date: day,
                            to_date: until,
                            per_page: 25,
                            page: 1,
                        });
                        setMySchedule(res.items);
                    })(),
                );
            }

            await Promise.all(promises);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    }, [widgetIds, auth.user?.id]);

    useEffect(() => {
        void load();
    }, [load]);

    const value = useMemo<DashboardDataState>(
        () => ({
            loading,
            patientTotal,
            todayAppointmentCount,
            recentRevenue,
            mySchedule,
            error,
            refetch: load,
        }),
        [
            loading,
            patientTotal,
            todayAppointmentCount,
            recentRevenue,
            mySchedule,
            error,
            load,
        ],
    );

    return (
        <DashboardDataContext.Provider value={value}>
            {children}
        </DashboardDataContext.Provider>
    );
}

export function useDashboardData(): DashboardDataState {
    const ctx = useContext(DashboardDataContext);
    if (!ctx) {
        throw new Error(
            'useDashboardData must be used within DashboardDataProvider',
        );
    }

    return ctx;
}
