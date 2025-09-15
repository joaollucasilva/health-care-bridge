import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ScheduleAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleAppointmentModal({ open, onOpenChange }: ScheduleAppointmentModalProps) {
  const [date, setDate] = useState<Date>();
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [doctor, setDoctor] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const doctors = [
    'Dr. Carlos Lima - Cardiologia',
    'Dra. Ana Silva - Dermatologia',
    'Dr. Roberto Santos - Ortopedia',
    'Dra. Maria Costa - Ginecologia',
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !doctor || !patientName || !patientEmail || !user) return;

    setLoading(true);
    try {
      // Find existing patient profile
      const { data: existingPatient } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', patientEmail)
        .single();

      if (!existingPatient) {
        toast.error('Paciente não encontrado no sistema. O paciente deve estar registrado antes de agendar uma consulta.');
        return;
      }

      // Create appointment
      const scheduledDateTime = new Date(date);
      const [hours, minutes] = time.split(':');
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));

      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          patient_id: existingPatient.id,
          attendant_id: user.id,
          scheduled_at: scheduledDateTime.toISOString(),
          title: `Consulta - ${doctor}`,
          description: notes || `Consulta com ${doctor}`,
          notes: notes,
          status: 'scheduled'
        });

      if (appointmentError) throw appointmentError;

      toast.success('Consulta agendada com sucesso!');
      onOpenChange(false);
      
      // Reset form
      setDate(undefined);
      setPatientName('');
      setPatientEmail('');
      setDoctor('');
      setTime('');
      setNotes('');
    } catch (error: any) {
      console.error('Error scheduling appointment:', error);
      toast.error('Erro ao agendar consulta: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agendar Consulta</DialogTitle>
          <DialogDescription>
            Preencha os dados para agendar uma nova consulta
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Nome do Paciente *</Label>
              <Input
                id="patientName"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Digite o nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientEmail">E-mail do Paciente *</Label>
              <Input
                id="patientEmail"
                type="email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                placeholder="email@exemplo.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Médico/Especialidade *</Label>
            <Select value={doctor} onValueChange={setDoctor}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o médico" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doc) => (
                  <SelectItem key={doc} value={doc}>
                    {doc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data da Consulta *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP', { locale: undefined }) : 'Selecione a data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Horário *</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informações adicionais sobre a consulta..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="medical" disabled={loading}>
              {loading ? 'Agendando...' : 'Agendar Consulta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}