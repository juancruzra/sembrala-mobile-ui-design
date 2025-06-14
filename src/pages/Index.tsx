
import React from 'react';
import Auth from './Auth';
import Dashboard from '@/components/dashboard/Dashboard';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, loading } = useAuth();

  console.log('Index: Estado de autenticación:', { user: user?.email, loading });

  if (loading) {
    return (
      <div className="min-h-screen bg-sembrala-light-gray flex items-center justify-center">
        <div className="text-sembrala-blue">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    console.log('Index: Usuario no autenticado, mostrando Auth');
    return <Auth />;
  }

  console.log('Index: Usuario autenticado, mostrando Dashboard');
  return (
    <div className="min-h-screen bg-sembrala-light-gray">
      <Dashboard />
    </div>
  );
};

export default Index;
