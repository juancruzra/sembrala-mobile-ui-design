
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User } from 'lucide-react';

const ProfileSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Error al cerrar sesión",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="pb-20 p-4 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-sembrala-blue mb-2">Mi Perfil</h2>
        <p className="text-gray-600">Gestiona tu cuenta y configuración</p>
      </div>

      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-sembrala-green rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-lg text-sembrala-blue">
            Información de la cuenta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email:</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
              {user?.email || 'No disponible'}
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">ID de Usuario:</label>
            <p className="text-gray-500 text-sm bg-gray-50 p-3 rounded-md break-all">
              {user?.id || 'No disponible'}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Fecha de registro:</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
              {user?.created_at 
                ? new Date(user.created_at).toLocaleDateString('es-ES')
                : 'No disponible'
              }
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-sembrala-blue">
            Acciones de cuenta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full h-12 text-base font-semibold"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Cerrar Sesión
          </Button>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500 mt-8">
        <p>Sembrala v1.0</p>
        <p>Tu billetera digital agropecuaria</p>
      </div>
    </div>
  );
};

export default ProfileSection;
