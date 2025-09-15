import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/hooks/useAppointments';
import { useConversations } from '@/hooks/useConversations';
import { SettingsModal } from '@/components/modals/SettingsModal';
import { ChatModal } from '@/components/modals/ChatModal';
import { AllAppointmentsModal } from '@/components/modals/AllAppointmentsModal';
import {
  Calendar,
  MessageCircle,
  Clock,
  FileText,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Settings,
} from 'lucide-react';

const PatientDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { appointments } = useAppointments();
  const { conversations } = useConversations();
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [allAppointmentsModalOpen, setAllAppointmentsModalOpen] = useState(false);
  const [messagesModalOpen, setMessagesModalOpen] = useState(false);

  // Get upcoming appointments (next 5)
  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.scheduled_at) > new Date())
    .slice(0, 5)
    .map(apt => ({
      id: apt.id,
      doctor: apt.attendant_profile?.full_name || 'Atendente não definido',
      specialty: apt.title,
      date: new Date(apt.scheduled_at).toLocaleDateString('pt-BR'),
      time: new Date(apt.scheduled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: apt.status,
    }));

  // Get recent messages from conversations  
  const recentMessages = conversations
    .filter(conv => conv.last_message)
    .slice(0, 5)
    .map(conv => ({
      id: conv.id,
      channel: conv.channel,
      message: conv.last_message?.content || '',
      time: new Date(conv.last_message_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'read', // Simplified for now
    }));

  const communicationChannels = [
    { name: 'Chat do Site', icon: MessageCircle, color: 'text-primary', available: true },
    { name: 'WhatsApp', icon: Phone, color: 'text-green-600', available: true },
    { name: 'E-mail', icon: Mail, color: 'text-blue-600', available: true },
    { name: 'Instagram', icon: Instagram, color: 'text-pink-600', available: true },
    { name: 'Facebook', icon: Facebook, color: 'text-blue-700', available: false },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Bem-vindo, {profile?.full_name}</h1>
              <p className="text-muted-foreground">Painel do Paciente</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="medical" onClick={() => setChatModalOpen(true)}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Nova Mensagem
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSettingsModalOpen(true)}>
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Próximas Consultas */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-primary" />
                  Próximas Consultas
                </CardTitle>
                <CardDescription>
                  Suas consultas agendadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{appointment.doctor}</h4>
                          <Badge variant="secondary">{appointment.specialty}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {appointment.date} às {appointment.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                        >
                          {appointment.status === 'confirmed' ? 'Confirmada' : 
                           appointment.status === 'scheduled' ? 'Agendada' :
                           appointment.status === 'completed' ? 'Concluída' :
                           appointment.status === 'cancelled' ? 'Cancelada' :
                           appointment.status === 'in_progress' ? 'Em andamento' :
                           appointment.status === 'no_show' ? 'Faltou' : 'Pendente'}
                        </Badge>
                      </div>
                    </div>
                  ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>Nenhuma consulta agendada</p>
                      <p className="text-sm">Suas próximas consultas aparecerão aqui</p>
                    </div>
                  )}
                </div>
                <div className="pt-4">
                  <Button variant="outline" className="w-full" onClick={() => setAllAppointmentsModalOpen(true)}>
                    Ver Todas as Consultas
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Histórico de Conversas */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5 text-primary" />
                  Mensagens Recentes
                </CardTitle>
                <CardDescription>
                  Últimas comunicações com a clínica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMessages.length > 0 ? (
                    recentMessages.map((message) => (
                    <div
                      key={message.id}
                      className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="mt-1">
                        {message.channel === 'whatsapp' && (
                          <Phone className="h-4 w-4 text-green-600" />
                        )}
                        {message.channel === 'email' && (
                          <Mail className="h-4 w-4 text-blue-600" />
                        )}
                        {message.channel === 'web_chat' && (
                          <MessageCircle className="h-4 w-4 text-primary" />
                        )}
                        {message.channel === 'instagram' && (
                          <Instagram className="h-4 w-4 text-pink-600" />
                        )}
                        {message.channel === 'facebook' && (
                          <Facebook className="h-4 w-4 text-blue-700" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{message.message}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                          <Badge variant={message.status === 'unread' ? 'default' : 'secondary'}>
                            {message.status === 'unread' ? 'Não lida' : 'Lida'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>Nenhuma mensagem ainda</p>
                      <p className="text-sm">Suas conversas com a clínica aparecerão aqui</p>
                    </div>
                  )}
                </div>
                <div className="pt-4">
                  <Button variant="outline" className="w-full" onClick={() => setMessagesModalOpen(true)}>
                    Ver Todas as Mensagens
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Canais de Comunicação */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Canais de Atendimento</CardTitle>
                <CardDescription>
                  Como você pode entrar em contato
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {communicationChannels.map((channel, index) => {
                    const Icon = channel.icon;
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          channel.available
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-4 w-4 ${channel.color}`} />
                          <span className="text-sm font-medium">{channel.name}</span>
                        </div>
                        <Badge variant={channel.available ? 'default' : 'secondary'}>
                          {channel.available ? 'Disponível' : 'Em breve'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Informações Rápidas */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Horário de Atendimento</p>
                    <p className="text-xs text-muted-foreground">Seg-Sex: 8h às 18h</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Documentos</p>
                    <p className="text-xs text-muted-foreground">Exames e receitas disponíveis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SettingsModal 
        open={settingsModalOpen} 
        onOpenChange={setSettingsModalOpen}
      />
      <ChatModal 
        open={chatModalOpen} 
        onOpenChange={setChatModalOpen}
      />
      <AllAppointmentsModal 
        open={allAppointmentsModalOpen} 
        onOpenChange={setAllAppointmentsModalOpen}
      />
      <ChatModal 
        open={messagesModalOpen} 
        onOpenChange={setMessagesModalOpen}
      />
    </div>
  );
};

export default PatientDashboard;