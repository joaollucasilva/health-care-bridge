import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface LoginFormProps {
  onToggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    const { error } = await login(email, password);
    
    if (!error) {
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a) ao sistema.`,
      });
    } else {
      toast({
        title: "Erro no login",
        description: error,
        variant: "destructive",
      });
    }
  };

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