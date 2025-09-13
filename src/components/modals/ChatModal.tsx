import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Phone, Mail, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatModal({ open, onOpenChange }: ChatModalProps) {
  const [message, setMessage] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<'whatsapp' | 'email' | 'instagram' | 'facebook'>('whatsapp');
  const [messages, setMessages] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { user, profile } = useAuth();

  // Create or get existing conversation
  useEffect(() => {
    if (!user || !open) return;

    const initializeConversation = async () => {
      try {
        // Check if user already has an open conversation
        const { data: existingConv } = await supabase
          .from('conversations')
          .select('*')
          .eq('patient_id', user.id)
          .eq('status', 'open')
          .eq('channel', selectedChannel)
          .single();

        if (existingConv) {
          setConversationId(existingConv.id);
          loadMessages(existingConv.id);
        } else {
          // Create new conversation
          const { data: newConv, error } = await supabase
            .from('conversations')
            .insert({
              patient_id: user.id,
              channel: selectedChannel,
              status: 'open',
              priority: 'medium',
              subject: 'Nova conversa'
            })
            .select()
            .single();

          if (error) throw error;
          
          setConversationId(newConv.id);
          setMessages([]);
        }
      } catch (error) {
        console.error('Error initializing conversation:', error);
        toast.error('Erro ao inicializar conversa');
      }
    };

    initializeConversation();
  }, [user, open, selectedChannel]);

  const loadMessages = async (convId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender_profile:profiles!messages_sender_id_fkey(full_name)
        `)
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Subscribe to real-time messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          loadMessages(conversationId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const channels = [
    { id: 'whatsapp' as const, name: 'WhatsApp', icon: Phone, color: 'text-green-600' },
    { id: 'email' as const, name: 'E-mail', icon: Mail, color: 'text-blue-600' },
    { id: 'instagram' as const, name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
    { id: 'facebook' as const, name: 'Facebook', icon: Facebook, color: 'text-blue-700' },
  ];

  const handleSendMessage = async () => {
    if (!message.trim() || !conversationId || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: message,
          channel: selectedChannel,
          message_type: 'text',
          status: 'sent',
        });

      if (error) throw error;
      
      setMessage('');
      toast.success('Mensagem enviada!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao enviar mensagem');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Nova Conversa</DialogTitle>
          <DialogDescription>
            Escolha o canal e inicie uma conversa com nossa equipe
          </DialogDescription>
        </DialogHeader>

        {/* Channel Selection */}
        <div className="flex space-x-2 p-4 border rounded-lg">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <Button
                key={channel.id}
                variant={selectedChannel === channel.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedChannel(channel.id)}
                className="flex items-center space-x-2"
              >
                <Icon className={`h-4 w-4 ${channel.color}`} />
                <span>{channel.name}</span>
              </Button>
            );
          })}
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 border rounded-lg">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Inicie uma conversa conosco!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isFromCurrentUser = msg.sender_id === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-[70%] ${
                        isFromCurrentUser ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {isFromCurrentUser 
                            ? profile?.full_name?.charAt(0) || 'EU'
                            : msg.sender_profile?.full_name?.charAt(0) || 'AT'
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`p-3 rounded-lg ${
                          isFromCurrentUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          isFromCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!message.trim() || !conversationId}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}