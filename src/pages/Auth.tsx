
import React, { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cleanupAuthState, handleAuthError } from '@/utils/authUtils';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();

  const handleLogin = async (email: string, password: string) => {
    try {
      // Limpiar estado anterior
      cleanupAuthState();
      
      // Intentar cerrar sesión global primero
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continuar aunque falle
        console.log('Sign out preventivo falló, continuando...');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        const friendlyMessage = handleAuthError(error);
        toast({
          title: "Error al iniciar sesión",
          description: friendlyMessage,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente",
        });
        
        // Forzar recarga completa para limpiar estado
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      }
    } catch (error: any) {
      console.error('Error inesperado en login:', error);
      const friendlyMessage = handleAuthError(error);
      toast({
        title: "Error al iniciar sesión",
        description: friendlyMessage,
        variant: "destructive",
      });
    }
  };

  const handleSignup = async (email: string, password: string, inviteCode?: string) => {
    try {
      // Limpiar estado anterior
      cleanupAuthState();
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            invite_code: inviteCode || null,
          }
        }
      });

      if (error) {
        const friendlyMessage = handleAuthError(error);
        toast({
          title: "Error al registrarse",
          description: friendlyMessage,
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
          description: data.user.email_confirmed_at 
            ? "Tu cuenta ha sido creada exitosamente" 
            : "Revisa tu email para confirmar tu cuenta",
        });
        
        // Si el email está confirmado, redirigir automáticamente
        if (data.user.email_confirmed_at) {
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        }
      }
    } catch (error: any) {
      console.error('Error inesperado en signup:', error);
      const friendlyMessage = handleAuthError(error);
      toast({
        title: "Error al registrarse",
        description: friendlyMessage,
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
