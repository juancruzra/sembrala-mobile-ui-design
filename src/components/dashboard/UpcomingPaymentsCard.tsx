
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Vencimiento {
  id: string;
  concepto: string;
  monto: number;
  fecha_vencimiento: string;
  categoria: string;
  estado: string;
}

const UpcomingPaymentsCard = () => {
  const [payments, setPayments] = useState<Vencimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysText = (days: number) => {
    if (days < 0) return `Vencido hace ${Math.abs(days)} ${Math.abs(days) === 1 ? 'día' : 'días'}`;
    if (days === 0) return 'Vence hoy';
    if (days === 1) return '1 día';
    return `${days} días`;
  };

  // Cargar vencimientos del usuario desde Supabase
  useEffect(() => {
    loadVencimientos();
  }, []);

  const loadVencimientos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('vencimientos')
        .select('*')
        .eq('user_id', user.id)
        .eq('estado', 'Pendiente')
        .order('fecha_vencimiento', { ascending: true });

      if (error) {
        console.error('Error loading vencimientos:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los vencimientos",
          variant: "destructive",
        });
        return;
      }

      setPayments(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="mx-4 mb-6">
        <CardContent className="p-6">
          <div className="text-center">Cargando vencimientos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-4 mb-6">
      <CardHeader>
        <CardTitle className="text-lg text-sembrala-blue">
          Próximos Vencimientos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {payments.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No tienes vencimientos pendientes
          </div>
        ) : (
          payments.slice(0, 4).map((payment) => {
            const daysUntilDue = getDaysUntilDue(payment.fecha_vencimiento);
            return (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-sembrala-blue text-sm">
                    {payment.concepto}
                  </p>
                  <p className="text-xs text-gray-600">
                    {daysUntilDue >= 0 ? `Vence en ${getDaysText(daysUntilDue)}` : getDaysText(daysUntilDue)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sembrala-red">
                    {formatCurrency(payment.monto)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        
        {payments.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <button 
              onClick={loadVencimientos}
              className="text-sembrala-green hover:underline text-sm font-medium"
            >
              {payments.length > 4 ? 'Ver todos los vencimientos' : 'Actualizar lista'}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingPaymentsCard;
