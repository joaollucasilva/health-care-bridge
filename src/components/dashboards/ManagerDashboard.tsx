import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart,
  Users,
  Clock,
  TrendingUp,
  MessageCircle,
  UserCheck,
  AlertTriangle,
  Settings,
  Download,
  Plus,
} from 'lucide-react';

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();

  const teamStats = [
    {
      name: 'Maria Santos',
      role: 'Atendente Sênior',
      chatsToday: 32,
      avgResponse: '2m 15s',
      satisfaction: 98,
      status: 'online',
    },
    {
      name: 'João Silva',
      role: 'Atendente',
      chatsToday: 28,
      avgResponse: '3m 45s',
      satisfaction: 95,
      status: 'online',
    },
    {
      name: 'Ana Costa',
      role: 'Atendente',
      chatsToday: 24,
      avgResponse: '4m 12s',
      satisfaction: 92,
      status: 'busy',
    },
  ];

  const systemMetrics = {
    totalChatsToday: 156,
    avgResponseTime: '3m 24s',
    resolutionRate: 94,
    customerSatisfaction: 4.7,
    activeChannels: 4,
  };

  const recentAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Tempo de resposta acima da média no WhatsApp',
      time: '14:30',
    },
    {
      id: 2,
      type: 'info',
      message: 'Nova integração Instagram disponível',
      time: '13:15',
    },
    {
      id: 3,
      type: 'success',
      message: 'Meta mensal de satisfação atingida',
      time: '12:00',
    },
  ];

  const channelPerformance = [
    { name: 'WhatsApp', chats: 89, conversion: 78, color: 'bg-green-500' },
    { name: 'E-mail', chats: 34, conversion: 65, color: 'bg-blue-500' },
    { name: 'Instagram', chats: 23, conversion: 72, color: 'bg-pink-500' },
    { name: 'Facebook', chats: 10, conversion: 60, color: 'bg-blue-700' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'success':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      default:
        return <MessageCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Dashboard Gerencial</h1>
              <p className="text-muted-foreground">Bem-vindo, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Relatório
              </Button>
              <Button variant="healthcare" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Novo Atendente
              </Button>
              <Button variant="medical" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Chats Hoje</p>
                  <p className="text-2xl font-bold text-primary">{systemMetrics.totalChatsToday}</p>
                </div>
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-2">
                <Badge className="bg-green-100 text-green-800 text-xs">+12% hoje</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tempo Médio</p>
                  <p className="text-2xl font-bold text-primary">{systemMetrics.avgResponseTime}</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-2">
                <Badge className="bg-green-100 text-green-800 text-xs">-8% hoje</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa Resolução</p>
                  <p className="text-2xl font-bold text-healthcare-green">{systemMetrics.resolutionRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-healthcare-green" />
              </div>
              <div className="mt-2">
                <Badge className="bg-green-100 text-green-800 text-xs">Meta: 90%</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Satisfação</p>
                  <p className="text-2xl font-bold text-primary">{systemMetrics.customerSatisfaction}</p>
                </div>
                <BarChart className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-2">
                <Badge className="bg-green-100 text-green-800 text-xs">★★★★★</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Canais Ativos</p>
                  <p className="text-2xl font-bold text-primary">{systemMetrics.activeChannels}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">WhatsApp, Email, IG, FB</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Performance */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="mr-2 h-5 w-5 text-primary" />
                  Performance da Equipe
                </CardTitle>
                <CardDescription>
                  Desempenho individual dos atendentes hoje
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamStats.map((member, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <UserCheck className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{member.name}</h4>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status === 'online' ? 'Online' : member.status === 'busy' ? 'Ocupado' : 'Offline'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <p className="font-semibold text-primary">{member.chatsToday}</p>
                          <p className="text-muted-foreground">Chats</p>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <p className="font-semibold text-primary">{member.avgResponse}</p>
                          <p className="text-muted-foreground">Tempo Médio</p>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <p className="font-semibold text-healthcare-green">{member.satisfaction}%</p>
                          <p className="text-muted-foreground">Satisfação</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Channel Performance */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Performance por Canal</CardTitle>
                <CardDescription>Conversões de hoje</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {channelPerformance.map((channel, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{channel.name}</span>
                      <span className="text-muted-foreground">{channel.chats} chats</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${channel.color}`}
                          style={{ width: `${channel.conversion}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{channel.conversion}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Alertas Recentes</CardTitle>
                <CardDescription>Notificações do sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;