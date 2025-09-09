import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import heroImage from '@/assets/medical-hero.jpg';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-hero">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-medical opacity-80" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Plataforma Integrada de Atendimento Médico
            </h1>
            <p className="text-lg opacity-90">
              Centralize todos os canais de comunicação da sua clínica em uma única plataforma moderna e eficiente.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span className="text-sm">WhatsApp, Instagram, Facebook integrados</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span className="text-sm">Dashboard com métricas em tempo real</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span className="text-sm">Agenda médica integrada</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-bold text-primary mb-2">
              Clínica Digital
            </h1>
            <p className="text-muted-foreground">
              Plataforma integrada de atendimento
            </p>
          </div>

          {/* Auth Forms */}
          {isLogin ? (
            <LoginForm onToggleForm={toggleForm} />
          ) : (
            <RegisterForm onToggleForm={toggleForm} />
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>© 2024 Clínica Digital. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;