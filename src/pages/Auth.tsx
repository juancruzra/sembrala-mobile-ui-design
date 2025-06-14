
import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        toast({
          title: "Error al iniciar sesión",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (email: string, password: string, inviteCode?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            invite_code: inviteCode || null,
          }
        }
      });

      if (error) {
        toast({
          title: "Error al registrarse",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        // Si el usuario se registró exitosamente y proporcionó un código de invitación
        if (inviteCode && inviteCode.trim() !== '') {
          try {
            const { error: inviteError } = await supabase
              .from('invitation_codes')
              .insert({
                user_id: data.user.id,
                invitation_code: inviteCode.trim()
              });

            if (inviteError) {
              console.error('Error al guardar código de invitación:', inviteError);
              // No mostramos error al usuario para no interrumpir el flujo de registro
            }
          } catch (inviteError) {
            console.error('Error al procesar código de invitación:', inviteError);
          }
        }

        toast({
          title: "¡Cuenta creada!",
          description: "Tu cuenta ha sido creada exitosamente",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-sembrala-light-gray">
      {isLogin ? (
        <LoginForm
          onLogin={handleLogin}
          onSwitchToSignup={() => setIsLogin(false)}
        />
      ) : (
        <SignupForm
          onSignup={handleSignup}
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </div>
  );
};

export default Auth;
