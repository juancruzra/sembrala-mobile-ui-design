
import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import Dashboard from '@/components/dashboard/Dashboard';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener usuario actual
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-sembrala-light-gray flex items-center justify-center">
        <div className="text-sembrala-blue">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-sembrala-light-gray">
      <Dashboard />
    </div>
  );
};

export default Index;
