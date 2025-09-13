import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Phone, Mail, Instagram, Send, Clock } from 'lucide-react';
import { useConversations } from '@/hooks/useConversations';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ActiveConversationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}


export function ActiveConversationsModal({ open, onOpenChange }: ActiveConversationsModalProps) {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const { conversations, loading } = useConversations();
  const { messages, sendMessage } = useMessages(selectedConversation);
  const { user, profile } = useAuth();

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return <Phone className="h-4 w-4 text-green-600" />;
      case 'email':
        return <Mail className="h-4 w-4 text-blue-600" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-600" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800">Ativo</Badge>;
      case 'waiting':
        return <Badge variant="secondary">Aguardando</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Resolvido</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const selectedConv = conversations.find(c => c.id === selectedConversation);
      if (selectedConv) {
        await sendMessage(newMessage, selectedConv.channel);
        setNewMessage('');
        toast.success('Mensagem enviada com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao enviar mensagem');
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Conversas Ativas</DialogTitle>
          <DialogDescription>
            Gerencie todas as conversas em andamento
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[70vh]">
          {/* Conversations List */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base">Conversas ({conversations.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(70vh-100px)]">
                {loading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Carregando conversas...
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Nenhuma conversa encontrada
                  </div>
                ) : (
                  <div className="space-y-2 p-4">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                          selectedConversation === conv.id 
                            ? 'border-primary bg-primary/5' 
                            : getPriorityColor(conv.priority)
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getChannelIcon(conv.channel)}
                            <h4 className="font-medium text-sm">{conv.patient_profile?.full_name || 'Paciente'}</h4>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {new Date(conv.last_message_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {conv.last_message?.content || conv.subject || 'Sem mensagens'}
                        </p>
                        <div className="flex items-center justify-between">
                          {getStatusBadge(conv.status)}
                          <Badge variant="outline" className="text-xs">
                            {conv.priority === 'high' ? 'Alta' : conv.priority === 'medium' ? 'Média' : 'Baixa'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedConv ? (
              <Card className="h-full flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getChannelIcon(selectedConv.channel)}
                      <div>
                        <CardTitle className="text-base">{selectedConv.patient_profile?.full_name || 'Paciente'}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {selectedConv.channel} • {getStatusBadge(selectedConv.status)}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Resolver Conversa
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-0">
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => {
                        const isFromCurrentUser = msg.sender_id === user?.id;
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`flex items-start space-x-2 max-w-[80%] ${
                                isFromCurrentUser ? 'flex-row-reverse space-x-reverse' : ''
                              }`}
                            >
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                  {isFromCurrentUser 
                                    ? profile?.full_name?.charAt(0) || 'U'
                                    : selectedConv?.patient_profile?.full_name?.charAt(0) || 'P'
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
                      })}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Digite sua resposta..."
                        className="flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent>
                  <div className="text-center text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Selecione uma conversa para visualizar</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}