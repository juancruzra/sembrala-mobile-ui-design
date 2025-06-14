
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CompactInventoryCard = () => {
  const [crops, setCrops] = useState({
    // Tenencias Actuales
    soja_actual: 0,
    maiz_actual: 0,
    trigo_actual: 0,
    girasol_actual: 0,
    // Tenencias Proyectadas
    soja_proyectada: 0,
    maiz_proyectada: 0,
    trigo_proyectada: 0,
    girasol_proyectada: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Precios Actuales
  const currentPrices = {
    soja: 100000,
    maiz: 100000,
    trigo: 100000,
    girasol: 100000,
  };

  // Precios Proyectados
  const projectedPrices = {
    soja: 100000,
    maiz: 100000,
    trigo: 100000,
    girasol: 100000,
  };

  const cropLabels = {
    soja: 'Soja',
    maiz: 'Maíz',
    trigo: 'Trigo',
    girasol: 'Girasol',
  };
  
  const currentCrops = ['soja', 'maiz', 'trigo', 'girasol'];
  const projectedCrops = ['soja', 'maiz', 'trigo', 'girasol'];

  const currentTotal = currentCrops.reduce((sum, crop) => {
    const cropKey = `${crop}_actual` as keyof typeof crops;
    return sum + (crops[cropKey] * currentPrices[crop as keyof typeof currentPrices]);
  }, 0);

  const projectedTotal = projectedCrops.reduce((sum, crop) => {
    const cropKey = `${crop}_proyectada` as keyof typeof crops;
    return sum + (crops[cropKey] * projectedPrices[crop as keyof typeof projectedPrices]);
  }, 0);

  const grandTotal = currentTotal + projectedTotal;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

      const newCrops = {
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
          newCrops[tenencia.producto_nombre as keyof typeof newCrops] = Number(tenencia.cantidad);
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

  if (loading) {
    return (
      <Card className="mx-4 mb-6 border-2 border-sembrala-green/20 bg-gradient-to-br from-green-50 to-white">
        <CardContent className="p-6">
          <div className="text-center">Cargando tenencias...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-4 mb-6 border-2 border-sembrala-green/20 bg-gradient-to-br from-green-50 to-white">
      <CardHeader>
        <CardTitle className="text-lg text-sembrala-blue">
          Tenencias Valorizadas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tenencias Actuales */}
        <div className="space-y-3">
          <h3 className="font-bold text-sembrala-blue text-sm border-b border-gray-200 pb-1">
            Tenencias Actuales
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {currentCrops.map((crop) => {
              const cropKey = `${crop}_actual` as keyof typeof crops;
              return (
                <div key={cropKey} className="space-y-2">
                  <Label className="text-xs text-gray-600">
                    {cropLabels[crop as keyof typeof cropLabels]}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Tn"
                      value={crops[cropKey] || ''}
                      onChange={(e) => handleCropChange(cropKey, Number(e.target.value) || 0)}
                      className="h-8 text-sm flex-1"
                      min="0"
                      step="0.1"
                    />
                    <span className="text-xs text-gray-500">
                      {formatCurrency(currentPrices[crop as keyof typeof currentPrices])}/tn
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-sembrala-green">
                      {formatCurrency(crops[cropKey] * currentPrices[crop as keyof typeof currentPrices])}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-sembrala-green/10 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-700 mb-1">Subtotal Actuales:</p>
            <p className="text-lg font-bold text-sembrala-blue">
              {formatCurrency(currentTotal)}
            </p>
          </div>
        </div>

        {/* Tenencias Proyectadas */}
        <div className="space-y-3">
          <h3 className="font-bold text-sembrala-blue text-sm border-b border-gray-200 pb-1">
            Tenencias Proyectadas
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {projectedCrops.map((crop) => {
              const cropKey = `${crop}_proyectada` as keyof typeof crops;
              return (
                <div key={cropKey} className="space-y-2">
                  <Label className="text-xs text-gray-600">
                    {cropLabels[crop as keyof typeof cropLabels]}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Tn"
                      value={crops[cropKey] || ''}
                      onChange={(e) => handleCropChange(cropKey, Number(e.target.value) || 0)}
                      className="h-8 text-sm flex-1"
                      min="0"
                      step="0.1"
                    />
                    <span className="text-xs text-gray-500">
                      {formatCurrency(projectedPrices[crop as keyof typeof projectedPrices])}/tn
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-blue-600">
                      {formatCurrency(crops[cropKey] * projectedPrices[crop as keyof typeof projectedPrices])}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <p className="text-xs text-gray-700 mb-1">Subtotal Proyectadas:</p>
            <p className="text-lg font-bold text-sembrala-blue">
              {formatCurrency(projectedTotal)}
            </p>
          </div>
        </div>

        {/* Total General */}
        <div className="bg-sembrala-green/20 p-3 rounded-lg text-center border-t border-gray-200 pt-3">
          <p className="text-xs text-gray-700 mb-1">Total General:</p>
          <p className="text-xl font-bold text-sembrala-blue">
            {formatCurrency(grandTotal)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactInventoryCard;
