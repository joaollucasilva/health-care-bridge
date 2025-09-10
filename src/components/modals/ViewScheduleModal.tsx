import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Clock, User, MapPin, Phone } from 'lucide-react';

interface ViewScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewScheduleModal({ open, onOpenChange }: ViewScheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const scheduleItems = [
    {
      id: 1,
      time: '09:00',
      patient: 'Maria Silva',
      type: 'Consulta',
      doctor: 'Dr. Carlos Lima',
      room: 'Sala 202',
      phone: '(11) 99999-9999',
      status: 'confirmed',
    },
    {
      id: 2,
      time: '10:30',
      patient: 'João Santos',
      type: 'Retorno',
      doctor: 'Dra. Ana Silva',
      room: 'Sala 105',
      phone: '(11) 88888-8888',
      status: 'pending',
    },
    {
      id: 3,
      time: '14:00',
      patient: 'Ana Costa',
      type: 'Consulta',
      doctor: 'Dr. Roberto Santos',
      room: 'Sala 301',
      phone: '(11) 77777-7777',
      status: 'confirmed',
    },
    {
      id: 4,
      time: '16:00',
      patient: 'Pedro Lima',
      type: 'Exame',
      doctor: 'Dra. Maria Costa',
      room: 'Sala 150',
      phone: '(11) 66666-6666',
      status: 'pending',
    },
  ];

  const getStatusColor = (status: string) => {
    return status === 'confirmed' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agenda Completa</DialogTitle>
          <DialogDescription>
            Visualize e gerencie todos os compromissos
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Selecionar Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Schedule Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Agenda do dia - {formatDate(selectedDate)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scheduleItems.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{item.time}</h3>
                              <p className="text-sm text-muted-foreground">{item.type}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                <strong>Paciente:</strong> {item.patient}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                <strong>Médico:</strong> {item.doctor}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                <strong>Local:</strong> {item.room}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                <strong>Contato:</strong> {item.phone}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                            <Button variant="outline" size="sm">
                              Contatar
                            </Button>
                          </div>
                        </div>
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