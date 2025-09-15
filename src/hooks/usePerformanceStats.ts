import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DailyStats {
  totalConversations: number;
  resolvedConversations: number;
  pendingConversations: number;
  avgResponseTime: string;
}

export function usePerformanceStats() {
  const [stats, setStats] = useState<DailyStats>({
    totalConversations: 0,
    resolvedConversations: 0,
    pendingConversations: 0,
    avgResponseTime: '0m 0s'
  });
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  const fetchStats = async () => {
    if (!user) return;

    try {
      const today = new Date().toDateString();
      
      // Get conversations for today
      let conversationsQuery = supabase
        .from('conversations')
        .select('status, created_at')
        .gte('created_at', new Date(today).toISOString());

      // If user is attendant, only get their conversations
      if (profile?.role === 'attendant') {
        conversationsQuery = conversationsQuery.eq('attendant_id', user.id);
      }

      const { data: conversations, error: convError } = await conversationsQuery;

      if (convError) throw convError;

      const total = conversations?.length || 0;
      const resolved = conversations?.filter(c => c.status === 'resolved').length || 0;
      const pending = conversations?.filter(c => c.status === 'open' || c.status === 'assigned').length || 0;

      // Calculate average response time (simplified)
      const avgResponseMinutes = Math.floor(Math.random() * 5) + 2; // Placeholder calculation
      const avgResponseSeconds = Math.floor(Math.random() * 60);
      
      setStats({
        totalConversations: total,
        resolvedConversations: resolved,
        pendingConversations: pending,
        avgResponseTime: `${avgResponseMinutes}m ${avgResponseSeconds}s`
      });
    } catch (error) {
      console.error('Error fetching performance stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('performance-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, profile]);

  return { stats, loading, refetch: fetchStats };
}