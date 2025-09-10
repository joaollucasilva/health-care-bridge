import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Phone, Mail, Instagram, Facebook } from 'lucide-react';

interface ChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'attendant';
  timestamp: string;
}

export function ChatModal({ open, onOpenChange }: ChatModalProps) {
  const [message, setMessage] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<'whatsapp' | 'email' | 'instagram' | 'facebook'>('whatsapp');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: 'Olá! Como posso ajudá-lo hoje?',
      sender: 'attendant',
      timestamp: '14:30',
    },
  ]);

  const channels = [
    { id: 'whatsapp' as const, name: 'WhatsApp', icon: Phone, color: 'text-green-600' },
    { id: 'email' as const, name: 'E-mail', icon: Mail, color: 'text-blue-600' },
    { id: 'instagram' as const, name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
    { id: 'facebook' as const, name: 'Facebook', icon: Facebook, color: 'text-blue-700' },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      content: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate attendant response
    setTimeout(() => {
      const response: Message = {
        id: messages.length + 2,
        content: 'Recebido! Vou verificar essa informação para você.',
        sender: 'attendant',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Nova Conversa</DialogTitle>
          <DialogDescription>
            Escolha o canal e inicie uma conversa com nossa equipe
          </DialogDescription>
        </DialogHeader>

        {/* Channel Selection */}
        <div className="flex space-x-2 p-4 border rounded-lg">
          {channels.map((channel) => {
            const Icon = channel.icon;
            return (
              <Button
                key={channel.id}
                variant={selectedChannel === channel.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedChannel(channel.id)}
                className="flex items-center space-x-2"
              >
                <Icon className={`h-4 w-4 ${channel.color}`} />
                <span>{channel.name}</span>
              </Button>
            );
          })}
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 border rounded-lg">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[70%] ${
                    msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {msg.sender === 'user' ? 'EU' : 'AT'}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}