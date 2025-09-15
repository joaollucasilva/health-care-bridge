import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  chatsToday: number;
  avgResponse: string;
  satisfaction: number;
  status: 'online' | 'busy' | 'offline';
}

export function useTeamStats() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTeamStats = async () => {
    if (!user) return;

    try {
      // Get all attendants and managers
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .in('role', ['attendant', 'manager'])
        .eq('is_active', true);

      if (profilesError) throw profilesError;

      const today = new Date().toDateString();

      // For each team member, get their stats
      const teamStats = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Get conversations handled today
          const { data: conversations } = await supabase
            .from('conversations')
            .select('status')
            .eq('attendant_id', profile.id)
            .gte('created_at', new Date(today).toISOString());

          const chatsToday = conversations?.length || 0;
          
          // Simplified calculations for demo
          const avgResponseMinutes = Math.floor(Math.random() * 5) + 2;
          const avgResponseSeconds = Math.floor(Math.random() * 60);
          const satisfaction = Math.floor(Math.random() * 10) + 90; // 90-100%
          const status = Math.random() > 0.7 ? 'online' : Math.random() > 0.5 ? 'busy' : 'offline';

          return {
            id: profile.id,
            name: profile.full_name,
            role: profile.role === 'attendant' ? 'Atendente' : 'Gerente',
            chatsToday,
            avgResponse: `${avgResponseMinutes}m ${avgResponseSeconds}s`,
            satisfaction,
            status: status as 'online' | 'busy' | 'offline'
          };
        })
      );

      setTeamMembers(teamStats);
    } catch (error) {
      console.error('Error fetching team stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamStats();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('team-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          fetchTeamStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { teamMembers, loading, refetch: fetchTeamStats };
}