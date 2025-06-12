
import { useState, useEffect, useCallback } from 'react';
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

      // Precios actuales (para Girasol y Trigo)
      const currentPrices = {
        girasol: 411775,
        trigo: 235300,
      };

      // Precios proyectados (para Maíz y Soja)
      const projectedPrices = {
        maiz: 203700,
        soja: 321300,
      };

      let currentTenencia = 0;
      let projectedTenencia = 0;

      tenenciasData?.forEach((tenencia) => {
        const cantidad = Number(tenencia.cantidad);
        
        if (tenencia.producto_nombre === 'girasol' || tenencia.producto_nombre === 'trigo') {
          const precio = currentPrices[tenencia.producto_nombre as keyof typeof currentPrices] || 0;
          currentTenencia += cantidad * precio;
        } else if (tenencia.producto_nombre === 'maiz' || tenencia.producto_nombre === 'soja') {
          const precio = projectedPrices[tenencia.producto_nombre as keyof typeof projectedPrices] || 0;
          projectedTenencia += cantidad * precio;
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
  }, []);

  useEffect(() => {
    loadTotals();

    // Create unique channel names with timestamps to avoid conflicts
    const channelId = Date.now();
    
    // Suscribirse a cambios en tiempo real en tenencias
    const tenenciasChannel = supabase
      .channel(`totals-tenencias-${channelId}`)
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
      .channel(`totals-vencimientos-${channelId}`)
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
