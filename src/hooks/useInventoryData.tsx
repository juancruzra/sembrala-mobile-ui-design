import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCurrentPrices } from '@/hooks/useCurrentPrices';

export interface CropInventory {
  soja_actual: number;
  maiz_actual: number;
  trigo_actual: number;
  girasol_actual: number;
  soja_proyectada: number;
  maiz_proyectada: number;
  trigo_proyectada: number;
  girasol_proyectada: number;
}

export const useInventoryData = () => {
  const [crops, setCrops] = useState<CropInventory>({
    soja_actual: 0,
    maiz_actual: 0,
    trigo_actual: 0,
    girasol_actual: 0,
    soja_proyectada: 0,
    maiz_proyectada: 0,
    trigo_proyectada: 0,
    girasol_proyectada: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const { currentPrices } = useCurrentPrices();
  
  const projectedPrices = {
    soja: 350000,
    maiz: 220000,
    trigo: 250000,
    girasol: 430000,
  };

  useEffect(() => {
    loadTenencias();
  }, []);

  const loadTenencias = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('tenencias')
        .select('producto_nombre, cantidad')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading tenencias:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las tenencias",
          variant: "destructive",
        });
        return;
      }

      const newCrops: CropInventory = {
        soja_actual: 0,
        maiz_actual: 0,
        trigo_actual: 0,
        girasol_actual: 0,
        soja_proyectada: 0,
        maiz_proyectada: 0,
        trigo_proyectada: 0,
        girasol_proyectada: 0,
      };

      data?.forEach((tenencia) => {
        if (tenencia.producto_nombre in newCrops) {
          newCrops[tenencia.producto_nombre as keyof CropInventory] = Number(tenencia.cantidad);
        }
      });

      setCrops(newCrops);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTenencia = async (producto: string, cantidad: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('tenencias')
        .upsert({
          user_id: user.id,
          producto_nombre: producto,
          cantidad: cantidad,
        }, {
          onConflict: 'user_id,producto_nombre'
        });

      if (error) {
        console.error('Error updating tenencia:', error);
        toast({
          title: "Error",
          description: "No se pudo actualizar la tenencia",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCropChange = (cropKey: string, value: number) => {
    setCrops(prev => ({ ...prev, [cropKey]: value }));
    updateTenencia(cropKey, value);
  };

  return {
    crops,
    currentPrices,
    projectedPrices,
    loading,
    handleCropChange,
  };
};
