import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  MessageCircle,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Calendar,
} from 'lucide-react';

const AttendantDashboard: React.FC = () => {
  const { profile } = useAuth();

  const activeChats = [
    {
      id: 1,
      patient: 'Maria Silva',
      channel: 'whatsapp',
      lastMessage: 'Preciso remarcar minha consulta',
      time: '14:30',
      priority: 'high',
      status: 'active',
    },
    {
      id: 2,
      patient: 'João Santos',
      channel: 'email',
      lastMessage: 'Quando fica pronto o resultado?',
      time: '14:15',
      priority: 'medium',
      status: 'waiting',
    },
    {
      id: 3,
      patient: 'Ana Costa',
      channel: 'instagram',
      lastMessage: 'Obrigada pelo atendimento!',
      time: '13:45',
      priority: 'low',
      status: 'resolved',
    },
  ];

  const todayStats = {
    totalChats: 24,
    resolved: 18,
    pending: 6,
    avgResponseTime: '3m 24s',
  };

  const quickActions = [
    { label: 'Agendar Consulta', icon: Calendar, variant: 'medical' as const },
    { label: 'Enviar Lembrete', icon: Clock, variant: 'healthcare' as const },
    { label: 'Ver Agenda', icon: Users, variant: 'outline' as const },
  ];

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return <Phone className="h-4 w-4 text-green-600" />;
      case 'email':
        return <Mail className="h-4 w-4 text-blue-600" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-600" />;
      case 'facebook':
        return <Facebook className="h-4 w-4 text-blue-700" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
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

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Olá, {profile?.full_name}</h1>
              <p className="text-muted-foreground">Painel do Atendente</p>
            </div>
            <div className="flex items-center space-x-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button key={index} variant={action.variant} size="sm">
                    <Icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Hoje</p>
                  <p className="text-2xl font-bold text-primary">{todayStats.totalChats}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolvidos</p>
                  <p className="text-2xl font-bold text-healthcare-green">{todayStats.resolved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-healthcare-green" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-warning-amber">{todayStats.pending}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-warning-amber" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tempo Médio</p>
                  <p className="text-2xl font-bold text-primary">{todayStats.avgResponseTime}</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Chats */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5 text-primary" />
                    Conversas Ativas
                  </span>
                  <Badge variant="secondary">{activeChats.length}</Badge>
                </CardTitle>
                <CardDescription>
                  Atendimentos em andamento e pendentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`p-4 border rounded-lg cursor-pointer hover:shadow-sm transition-all ${getPriorityColor(chat.priority)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {getChannelIcon(chat.channel)}
                          <div>
                            <h4 className="font-medium">{chat.patient}</h4>
                            <p className="text-sm opacity-75">{chat.lastMessage}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs opacity-75 mb-1">{chat.time}</div>
                          {getStatusBadge(chat.status)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(chat.priority)}`}
                        >
                          {chat.priority === 'high' ? 'Alta' : chat.priority === 'medium' ? 'Média' : 'Baixa'} Prioridade
                        </Badge>
                        <Button size="sm" variant="outline">
                          Responder
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Templates */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Respostas Rápidas</CardTitle>
                <CardDescription>Templates mais utilizados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  Confirmação de consulta
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  Reagendar consulta
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  Resultado de exame
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  Informações gerais
                </Button>
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Agenda de Hoje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>09:00 - Consulta Dr. Silva</span>
                  <Badge variant="secondary">Confirmada</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>14:00 - Consulta Dra. Ana</span>
                  <Badge variant="outline">Pendente</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>16:30 - Retorno</span>
                  <Badge variant="secondary">Confirmada</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendantDashboard;