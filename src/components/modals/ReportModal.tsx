import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Download, FileText, Calendar, Users, MessageCircle, TrendingUp } from 'lucide-react';

interface ReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ open, onOpenChange }) => {
  const [reportType, setReportType] = useState<string>('daily');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const { toast } = useToast();

  const reportTypes = [
    { value: 'daily', label: 'Relatório Diário', icon: Calendar },
    { value: 'weekly', label: 'Relatório Semanal', icon: Calendar },
    { value: 'monthly', label: 'Relatório Mensal', icon: Calendar },
    { value: 'team', label: 'Performance da Equipe', icon: Users },
    { value: 'conversations', label: 'Conversas', icon: MessageCircle }
  ];

  const generateReport = async () => {
    setLoading(true);
    
    try {
      // Simulate report generation - in real app this would fetch actual data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData = {
        daily: {
          totalConversations: 156,
          avgResponseTime: '3m 24s',
          satisfactionRate: 94,
          resolutionRate: 87,
          topPerformer: 'Maria Santos'
        },
        weekly: {
          totalConversations: 892,
          avgResponseTime: '3m 45s',
          satisfactionRate: 92,
          resolutionRate: 89,
          topPerformer: 'João Silva'
        },
        monthly: {
          totalConversations: 3567,
          avgResponseTime: '4m 12s',
          satisfactionRate: 91,
          resolutionRate: 85,
          topPerformer: 'Ana Costa'
        },
        team: {
          totalMembers: 8,
          activeMembers: 6,
          avgSatisfaction: 93,
          totalConversations: 156
        },
        conversations: {
          openConversations: 23,
          closedToday: 89,
          pendingResponse: 12,
          avgDuration: '12m 30s'
        }
      };

      setReportData(mockData[reportType as keyof typeof mockData]);
      
      toast({
        title: "Relatório gerado com sucesso!",
        description: "Os dados foram compilados e estão prontos para visualização.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao gerar relatório",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    // Simulate download
    toast({
      title: "Download iniciado",
      description: "O relatório está sendo baixado em formato PDF.",
    });
  };

  const selectedReportType = reportTypes.find(r => r.value === reportType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Gerar Relatório
          </DialogTitle>
          <DialogDescription>
            Selecione o tipo de relatório que deseja gerar e visualizar.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Relatório</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de relatório" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button onClick={generateReport} disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                  Gerando...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </>
              )}
            </Button>
            
            {reportData && (
              <Button onClick={downloadReport} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </div>

          {reportData && selectedReportType && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <selectedReportType.icon className="h-5 w-5 text-primary" />
                  {selectedReportType.label}
                </CardTitle>
                <CardDescription>
                  Dados compilados em {new Date().toLocaleDateString('pt-BR')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(reportData).map(([key, value]) => (
                    <div key={key} className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </p>
                      <p className="text-lg font-semibold text-primary">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};