import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { User, Stethoscope, UserCheck, Loader2 } from 'lucide-react';

interface LoginFormProps {
  onToggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const success = await login(email, password, selectedRole);
    
    if (success) {
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a) ao sistema.`,
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    }
  };

  const roleOptions = [
    {
      id: 'patient' as UserRole,
      label: 'Paciente',
      description: 'Acesso para consultas e histórico',
      icon: User,
    },
    {
      id: 'attendant' as UserRole,
      label: 'Atendente',
      description: 'Gestão de atendimentos',
      icon: UserCheck,
    },
    {
      id: 'manager' as UserRole,
      label: 'Gerente',
      description: 'Administração completa',
      icon: Stethoscope,
    },
  ];

  return (
    <Card className="w-full max-w-md shadow-medical">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold text-primary">Entrar</CardTitle>
        <CardDescription>
          Acesse sua conta no sistema de atendimento médico
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tipo de Acesso</Label>
            <div className="grid grid-cols-1 gap-2">
              {roleOptions.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3 rounded-lg border-2 text-left transition-all hover:shadow-sm ${
                      selectedRole === role.id
                        ? 'border-primary bg-accent text-accent-foreground'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{role.label}</p>
                        <p className="text-xs text-muted-foreground">{role.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="h-11"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="medical"
            className="w-full h-11"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
        </form>

        {/* Toggle to Register */}
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <button
              type="button"
              onClick={onToggleForm}
              className="text-primary hover:underline font-medium"
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;