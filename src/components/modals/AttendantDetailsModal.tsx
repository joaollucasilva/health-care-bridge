import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Clock, CheckCircle, AlertCircle, Phone, Mail, Instagram } from 'lucide-react';

interface AttendantDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendant: {
    name: string;
    role: string;
    chatsToday: number;
    avgResponse: string;
    satisfaction: number;
    status: string;
  };
}

export function AttendantDetailsModal({ open, onOpenChange, attendant }: AttendantDetailsModalProps) {
  const conversations = [
    {
      id: 1,
      patient: 'Maria Silva',
      channel: 'whatsapp',
      status: 'resolved',
      startTime: '09:15',
      endTime: '09:32',
      subject: 'Reagendamento de consulta',
    },
    {
      id: 2,
      patient: 'João Santos',
      channel: 'email',
      status: 'resolved',
      startTime: '10:20',
      endTime: '10:45',
      subject: 'Dúvidas sobre exame',
    },
    {
      id: 3,
      patient: 'Ana Costa',
      channel: 'instagram',
      status: 'pending',
      startTime: '14:30',
      endTime: null,
      subject: 'Informações sobre tratamento',
    },
  ];

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

  const getStatusIcon = (status: string) => {
    return status === 'resolved' ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <AlertCircle className="h-4 w-4 text-yellow-600" />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Atendente</DialogTitle>
          <DialogDescription>
            Performance detalhada e conversas do dia
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Section */}
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-16 h-16 mx-auto mb-4">
                <AvatarFallback className="text-lg">
                  {attendant.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">{attendant.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{attendant.role}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{attendant.chatsToday}</p>
                <p className="text-sm text-muted-foreground">Chats hoje</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-primary">{attendant.avgResponse}</p>
                <p className="text-sm text-muted-foreground">Tempo médio</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-healthcare-green">{attendant.satisfaction}%</p>
                <p className="text-sm text-muted-foreground">Satisfação</p>
              </div>
            </CardContent>
          </Card>

          {/* Conversations List */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Conversas de Hoje ({conversations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {conversations.map((conv) => (
                    <div key={conv.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getChannelIcon(conv.channel)}
                          <div>
                            <h4 className="font-medium">{conv.patient}</h4>
                            <p className="text-sm text-muted-foreground">{conv.subject}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(conv.status)}
                          <Badge variant={conv.status === 'resolved' ? 'default' : 'secondary'}>
                            {conv.status === 'resolved' ? 'Resolvida' : 'Pendente'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3" />
                          <span>Início: {conv.startTime}</span>
                        </div>
                        {conv.endTime && (
                          <span>Fim: {conv.endTime}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}