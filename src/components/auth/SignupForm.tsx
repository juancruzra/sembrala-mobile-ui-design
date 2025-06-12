import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SignupFormProps {
  onSignup: (email: string, password: string, inviteCode?: string) => void;
  onSwitchToLogin: () => void;
}

const SignupForm = ({ onSignup, onSwitchToLogin }: SignupFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const saveInvitationCode = async (userId: string, code: string) => {
    if (!code) return;
    
    try {
      const { error } = await supabase
        .from('invitation_codes')
        .insert({
          user_id: userId,
          invitation_code: code
        });
      
      if (error) {
        console.error('Error saving invitation code:', error);
      }
    } catch (error) {
      console.error('Error saving invitation code:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    if (password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    
    try {
      await onSignup(email, password, inviteCode);
      
      // Si el usuario se registra exitosamente y hay un código de invitación, guardarlo
      if (inviteCode && user?.id) {
        await saveInvitationCode(user.id, inviteCode);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mobile-container flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto">
            <img src="logo.png" alt="Logo Sembrala" className="h-20 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-sembrala-blue">
            Crear Cuenta
          </CardTitle>
          <p className="text-muted-foreground">
            Toma el control de tus finanzas
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Crea una contraseña segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-base"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 text-base"
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inviteCode">Código de Invitación</Label>
              <Input
                id="inviteCode"
                type="text"
                placeholder="Ingresa tu código de invitación"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="h-12 text-base"
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-sembrala-green hover:bg-sembrala-green/90 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-sembrala-green hover:underline"
              disabled={isLoading}
            >
              ¿Ya tenes cuenta? Inicia sesión
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupForm;
