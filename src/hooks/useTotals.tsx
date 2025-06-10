import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTotals = () => {
  const [totals, setTotals] = useState({
    currentTenencias: 0,
    projectedTenencias: 0,
    totalTenencias: 0,
    upcomingPayments: 0,
    futureSaldo: 0,
    projectedFutureSaldo: 0,
  });
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    loadTotals();
  }, []);

  const loadTotals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Cargar tenencias
      const { data: tenenciasData } = await supabase
        .from('tenencias')
        .select('producto_nombre, cantidad')
        .eq('user_id', user.id);

      // Cargar vencimientos pendientes
      const { data: vencimientosData } = await supabase
        .from('vencimientos')
        .select('monto')
        .eq('user_id', user.id)
        .eq('estado', 'Pendiente');

      // Precios por tonelada
      const prices = {
        soja: 321300,
        maiz: 203700,
        trigo: 235300,
        girasol: 411775,
      };

      let currentTenencia = 0;
      let projectedTenencia = 0;

      tenenciasData?.forEach((tenencia) => {
        const cantidad = Number(tenencia.cantidad);
        const precio = prices[tenencia.producto_nombre as keyof typeof prices] || 0;
        const total = cantidad * precio;

        if (tenencia.producto_nombre === 'soja' || tenencia.producto_nombre === 'maiz') {
          currentTenencia += total;
        } else if (tenencia.producto_nombre === 'trigo' || tenencia.producto_nombre === 'girasol') {
          projectedTenencia += total;
        }
      });

      const currentTotal = currentTenencia + projectedTenencia;

      // Sumar todos los vencimientos pendientes
      const upcomingPayments = vencimientosData?.reduce((sum, vencimiento) => {
        return sum + Number(vencimiento.monto);
      }, 0) || 0;

      const futureSaldo = currentTenencia - upcomingPayments;
      const projectedFutureSaldo = currentTenencia + projectedTenencia - upcomingPayments;

      setTotals({
        currentTenencias: currentTenencia,
        projectedTenencias: projectedTenencia,
        totalTenencias: currentTotal,
        upcomingPayments: upcomingPayments,
        futureSaldo: futureSaldo,
        projectedFutureSaldo: projectedFutureSaldo,
      });
    } catch (error) {
      console.error('Error loading totals:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    ...totals,
    loading,
    formatCurrency,
    refreshTotals: loadTotals,
  };
};
