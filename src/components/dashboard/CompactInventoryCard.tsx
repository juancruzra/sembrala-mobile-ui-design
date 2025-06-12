
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const CompactInventoryCard = () => {
  const [crops, setCrops] = useState({
    soja: 0,
    maiz: 0,
    trigo: 0,
    girasol: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const prices = {
    soja: 321300,
    maiz: 203700,
    trigo: 235500,
    girasol: 411775,
  };

  const cropLabels = {
    soja: 'Soja (Cosechada)',
    maiz: 'Maíz (Cosechado)',
    trigo: 'Trigo (Proyectado)',
    girasol: 'Girasol (Proyectado)',
  };
  
  const currentCrops = ['soja', 'maiz'];
  const projectedCrops = ['trigo', 'girasol'];

  const currentTotal = currentCrops.reduce((sum, crop) => {
    return sum + (crops[crop as keyof typeof crops] * prices[crop as keyof typeof prices]);
  }, 0);

  const projectedTotal = projectedCrops.reduce((sum, crop) => {
    return sum + (crops[crop as keyof typeof crops] * prices[crop as keyof typeof prices]);
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

      const newCrops = { soja: 0, maiz: 0, trigo: 0, girasol: 0 };

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

  const handleCropChange = (cropName: string, value: number) => {
    setCrops(prev => ({ ...prev, [cropName]: value }));
    updateTenencia(cropName, value);
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
            {currentCrops.map((crop) => (
              <div key={crop} className="space-y-2">
                <Label className="text-xs text-gray-600">
                  {cropLabels[crop as keyof typeof cropLabels]}
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Tn"
                    value={crops[crop as keyof typeof crops] || ''}
                    onChange={(e) => handleCropChange(crop, Number(e.target.value) || 0)}
                    className="h-8 text-sm flex-1"
                    min="0"
                    step="0.1"
                  />
                  <span className="text-xs text-gray-500">
                    {formatCurrency(prices[crop as keyof typeof prices])}/tn
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-sembrala-green">
                    {formatCurrency(crops[crop as keyof typeof crops] * prices[crop as keyof typeof prices])}
                  </span>
                </div>
              </div>
            ))}
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
            {projectedCrops.map((crop) => (
              <div key={crop} className="space-y-2">
                <Label className="text-xs text-gray-600">
                  {cropLabels[crop as keyof typeof cropLabels]}
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Tn"
                    value={crops[crop as keyof typeof crops] || ''}
                    onChange={(e) => handleCropChange(crop, Number(e.target.value) || 0)}
                    className="h-8 text-sm flex-1"
                    min="0"
                    step="0.1"
                  />
                  <span className="text-xs text-gray-500">
                    {formatCurrency(prices[crop as keyof typeof prices])}/tn
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-blue-600">
                    {formatCurrency(crops[crop as keyof typeof crops] * prices[crop as keyof typeof prices])}
                  </span>
                </div>
              </div>
            ))}
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
