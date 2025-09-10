import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

interface AllAppointmentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AllAppointmentsModal({ open, onOpenChange }: AllAppointmentsModalProps) {
  const appointments = [
    {
      id: 1,
      doctor: 'Dr. Carlos Lima',
      specialty: 'Cardiologia',
      date: '2024-01-15',
      time: '14:00',
      status: 'confirmed',
      location: 'Consultório 202',
      notes: 'Consulta de rotina - Levar exames anteriores',
    },
    {
      id: 2,
      doctor: 'Dra. Ana Silva',
      specialty: 'Dermatologia',
      date: '2024-01-18',
      time: '10:30',
      status: 'pending',
      location: 'Consultório 105',
      notes: 'Avaliação de lesão cutânea',
    },
    {
      id: 3,
      doctor: 'Dr. Roberto Santos',
      specialty: 'Ortopedia',
      date: '2024-01-22',
      time: '09:00',
      status: 'confirmed',
      location: 'Consultório 301',
      notes: 'Retorno - Acompanhamento pós-cirúrgico',
    },
    {
      id: 4,
      doctor: 'Dra. Maria Costa',
      specialty: 'Ginecologia',
      date: '2024-01-25',
      time: '16:00',
      status: 'pending',
      location: 'Consultório 150',
      notes: 'Exame preventivo anual',
    },
  ];

  const getStatusColor = (status: string) => {
    return status === 'confirmed' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Todas as Consultas</DialogTitle>
          <DialogDescription>
            Visualize todas suas consultas agendadas
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <User className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">{appointment.doctor}</h3>
                      <Badge variant="secondary">{appointment.specialty}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(appointment.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{appointment.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{appointment.location}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">
                        <strong>Observações:</strong> {appointment.notes}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Remarcar
                      </Button>
                      <Button variant="outline" size="sm">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}