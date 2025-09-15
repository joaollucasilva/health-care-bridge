import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Appointment {
  id: string;
  patient_id: string;
  attendant_id: string | null;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'in_progress' | 'no_show';
  title: string;
  description: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  attendant_profile?: {
    full_name: string;
  };
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          attendant_profile:profiles!appointments_attendant_id_fkey(full_name)
        `)
        .eq('patient_id', user.id)
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
        },
        () => {
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { appointments, loading, refetch: fetchAppointments };
}