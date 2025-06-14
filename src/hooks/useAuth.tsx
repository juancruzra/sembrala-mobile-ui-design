
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { cleanupAuthState } from '@/utils/authUtils';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useAuth: Inicializando...');
    
    // Configurar listener de cambios de autenticación PRIMERO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('useAuth: Auth state change:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Defer any additional data fetching to prevent deadlocks
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            console.log('useAuth: Usuario autenticado:', session.user.email);
          }, 0);
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('useAuth: Usuario desconectado');
          cleanupAuthState();
        }
      }
    );

    // LUEGO obtener sesión actual
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('useAuth: Error al obtener sesión:', error);
        cleanupAuthState();
      }
      
      console.log('useAuth: Sesión inicial:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('useAuth: Limpiando subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('useAuth: Cerrando sesión...');
      cleanupAuthState();
      
      await supabase.auth.signOut({ scope: 'global' });
      
      // Forzar recarga completa
      setTimeout(() => {
        window.location.href = '/auth';
      }, 500);
    } catch (error) {
      console.error('useAuth: Error al cerrar sesión:', error);
      // Forzar recarga aunque haya error
      window.location.href = '/auth';
    }
  };

  return {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: !!user && !!session,
  };
};
