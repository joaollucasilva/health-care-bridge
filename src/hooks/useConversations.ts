import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Conversation {
  id: string;
  patient_id: string;
  attendant_id: string | null;
  channel: 'whatsapp' | 'email' | 'instagram' | 'facebook' | 'phone' | 'web_chat';
  status: 'open' | 'closed' | 'assigned' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  subject: string | null;
  last_message_at: string;
  created_at: string;
  patient_profile?: {
    full_name: string;
  };
  attendant_profile?: {
    full_name: string;
  };
  last_message?: {
    content: string;
  };
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  const fetchConversations = async () => {
    if (!user || !profile) return;

    try {
      let query = supabase
        .from('conversations')
        .select(`
          *,
          patient_profile:profiles!conversations_patient_id_fkey(full_name),
          attendant_profile:profiles!conversations_attendant_id_fkey(full_name),
          last_message:messages(content)
        `)
        .order('last_message_at', { ascending: false });

      // Filter conversations based on user role
      if (profile.role === 'patient') {
        query = query.eq('patient_id', user.id);
      } else if (profile.role === 'attendant') {
        // Attendants see unassigned conversations or conversations assigned to them
        query = query.or(`attendant_id.is.null,attendant_id.eq.${user.id}`);
      }
      // Managers can see all conversations (no additional filter)

      const { data, error } = await query;

      if (error) throw error;

      // Get the last message for each conversation
      const conversationsWithLastMessage = await Promise.all(
        (data || []).map(async (conv) => {
          const { data: lastMessage } = await supabase
            .from('messages')
            .select('content')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1);

          return {
            ...conv,
            last_message: lastMessage?.[0] || null,
          };
        })
      );

      setConversations(conversationsWithLastMessage as Conversation[]);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          fetchConversations();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, profile]);

  return { conversations, loading, refetch: fetchConversations };
}