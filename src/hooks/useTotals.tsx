import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CROP_PRICES, getPriceByProductKey } from '@/config/prices';

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

  const loadTotals = useCallback(async () => {
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

      let currentTenencia = 0;
      let projectedTenencia = 0;

      tenenciasData?.forEach((tenencia) => {
        const cantidad = Number(tenencia.cantidad);
        const precio = getPriceByProductKey(tenencia.producto_nombre);
        
        // Verificar si es una tenencia actual
        if (tenencia.producto_nombre.endsWith('_actual')) {
          currentTenencia += cantidad * precio;
        }
        
        // Verificar si es una tenencia proyectada
        if (tenencia.producto_nombre.endsWith('_proyectada')) {
          projectedTenencia += cantidad * precio;
        }
      });

      const totalTenencias = currentTenencia + projectedTenencia;

      // Sumar todos los vencimientos pendientes
      const upcomingPayments = vencimientosData?.reduce((sum, vencimiento) => {
        return sum + Number(vencimiento.monto);
      }, 0) || 0;

      // Saldo futuro = tenencias actuales - gastos pendientes
      const futureSaldo = currentTenencia - upcomingPayments;
      
      // Saldo futuro proyectado = total general - gastos pendientes
      const projectedFutureSaldo = totalTenencias - upcomingPayments;

      setTotals({
        currentTenencias: currentTenencia,
        projectedTenencias: projectedTenencia,
        totalTenencias: totalTenencias,
        upcomingPayments: upcomingPayments,
        futureSaldo: futureSaldo,
        projectedFutureSaldo: projectedFutureSaldo,
      });
    } catch (error) {
      console.error('Error loading totals:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTotals();

    // Suscribirse a cambios en tiempo real en tenencias
    const tenenciasChannel = supabase
      .channel('tenencias-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenencias'
        },
        () => {
          console.log('Tenencias changed, reloading totals...');
          loadTotals();
        }
      )
      .subscribe();

    // Suscribirse a cambios en tiempo real en vencimientos
    const vencimientosChannel = supabase
      .channel('vencimientos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vencimientos'
        },
        () => {
          console.log('Vencimientos changed, reloading totals...');
          loadTotals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tenenciasChannel);
      supabase.removeChannel(vencimientosChannel);
    };
  }, [loadTotals]);

  return {
    ...totals,
    loading,
    formatCurrency,
    refreshTotals: loadTotals,
  };
};
