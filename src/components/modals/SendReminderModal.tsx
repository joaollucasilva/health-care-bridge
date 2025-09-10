import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Instagram, Facebook, Send } from 'lucide-react';

interface SendReminderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendReminderModal({ open, onOpenChange }: SendReminderModalProps) {
  const [patient, setPatient] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'email' | 'instagram' | 'sms'>('whatsapp');
  const [message, setMessage] = useState('');
  const [reminderType, setReminderType] = useState('');

  const patients = [
    { id: 1, name: 'Maria Silva', phone: '(11) 99999-9999', email: 'maria@email.com' },
    { id: 2, name: 'João Santos', phone: '(11) 88888-8888', email: 'joao@email.com' },
    { id: 3, name: 'Ana Costa', phone: '(11) 77777-7777', email: 'ana@email.com' },
  ];

  const reminderTypes = [
    { value: 'appointment', label: 'Lembrete de Consulta', template: 'Olá! Este é um lembrete de que você tem uma consulta marcada para amanhã às {time}. Por favor, confirme sua presença.' },
    { value: 'exam', label: 'Lembrete de Exame', template: 'Lembrete: Você tem um exame agendado para {date} às {time}. Lembre-se de seguir as orientações de preparo.' },
    { value: 'medication', label: 'Lembrete de Medicação', template: 'Lembrete importante: Não se esqueça de tomar sua medicação conforme prescrito pelo médico.' },
    { value: 'return', label: 'Lembrete de Retorno', template: 'É importante agendar seu retorno médico. Entre em contato conosco para marcar sua próxima consulta.' },
  ];

  const channels = [
    { id: 'whatsapp', name: 'WhatsApp', icon: Phone, color: 'text-green-600' },
    { id: 'email', name: 'E-mail', icon: Mail, color: 'text-blue-600' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
    { id: 'sms', name: 'SMS', icon: Phone, color: 'text-purple-600' },
  ];

  const handleReminderTypeChange = (type: string) => {
    setReminderType(type);
    const template = reminderTypes.find(rt => rt.value === type)?.template || '';
    setMessage(template);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the reminder through the selected channel
    console.log({
      patient,
      channel,
      reminderType,
      message,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enviar Lembrete</DialogTitle>
          <DialogDescription>
            Envie lembretes personalizados para os pacientes
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Paciente *</Label>
            <Select value={patient} onValueChange={setPatient}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o paciente" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.name}>
                    <div className="flex items-center justify-between w-full">
                      <span>{p.name}</span>
                      <div className="flex space-x-2 ml-4">
                        <Badge variant="outline" className="text-xs">
                          {p.phone}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {p.email}
                        </Badge>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Canal de Comunicação *</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {channels.map((ch) => {
                const Icon = ch.icon;
                return (
                  <Button
                    key={ch.id}
                    type="button"
                    variant={channel === ch.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChannel(ch.id as any)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className={`h-4 w-4 ${ch.color}`} />
                    <span>{ch.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Lembrete *</Label>
            <Select value={reminderType} onValueChange={handleReminderTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de lembrete" />
              </SelectTrigger>
              <SelectContent>
                {reminderTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem *</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite a mensagem do lembrete..."
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">
              Use {'{date}'} para data, {'{time}'} para horário nos templates
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Pré-visualização</h4>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                {React.createElement(channels.find(c => c.id === channel)?.icon || Phone, {
                  className: `h-4 w-4 ${channels.find(c => c.id === channel)?.color || 'text-gray-600'}`
                })}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{patient || 'Paciente'}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {message || 'A mensagem será exibida aqui...'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="medical">
              <Send className="mr-2 h-4 w-4" />
              Enviar Lembrete
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}