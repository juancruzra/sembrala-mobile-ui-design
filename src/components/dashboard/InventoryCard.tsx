
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const InventoryCard = () => {
  const [soyaTons, setSoyaTons] = useState(0);
  const [cornTons, setCornTons] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const soyaPrice = 323500; // Price per ton in ARS
  const cornPrice = 296500; // Price per ton in ARS
  
  const soyaTotal = soyaTons * soyaPrice;
  const cornTotal = cornTons * cornPrice;
  const grandTotal = soyaTotal + cornTotal;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Cargar tenencias del usuario desde Supabase
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

      // Inicializar las cantidades
      let soja = 0;
      let maiz = 0;

      data?.forEach((tenencia) => {
        if (tenencia.producto_nombre === 'soja') {
          soja = Number(tenencia.cantidad);
        } else if (tenencia.producto_nombre === 'maiz') {
          maiz = Number(tenencia.cantidad);
        }
      });

      setSoyaTons(soja);
      setCornTons(maiz);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar tenencias en Supabase (UPSERT)
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

  const handleSoyaChange = (value: number) => {
    setSoyaTons(value);
    updateTenencia('soja', value);
  };

  const handleCornChange = (value: number) => {
    setCornTons(value);
    updateTenencia('maiz', value);
  };

  if (loading) {
    return (
      <Card className="mx-4 mb-6 border-2 border-sembrala-green/20 bg-gradient-to-br from-green-50 to-white">
        <CardContent className="p-6">
          <div className="text-center">Cargando inventario...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-4 mb-6 border-2 border-sembrala-green/20 bg-gradient-to-br from-green-50 to-white">
      <CardHeader>
        <CardTitle className="text-lg text-sembrala-blue">
          Valor de tu Inventario
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Soja Section */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sembrala-blue">Soja (Cosechada)</h3>
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <Label htmlFor="soyaTons" className="text-sm">Toneladas</Label>
              <Input
                id="soyaTons"
                type="number"
                placeholder="0"
                value={soyaTons || ''}
                onChange={(e) => handleSoyaChange(Number(e.target.value) || 0)}
                className="h-10"
                min="0"
                step="0.1"
              />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Precio/tn</p>
              <p className="text-lg font-bold text-sembrala-green">
                {formatCurrency(soyaPrice)}/tn
              </p>
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total Soja:</p>
            <p className="text-xl font-bold text-sembrala-green">
              {formatCurrency(soyaTotal)}
            </p>
          </div>
        </div>

        {/* Maíz Section */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sembrala-blue">Maíz (Cosechado)</h3>
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <Label htmlFor="cornTons" className="text-sm">Toneladas</Label>
              <Input
                id="cornTons"
                type="number"
                placeholder="0"
                value={cornTons || ''}
                onChange={(e) => handleCornChange(Number(e.target.value) || 0)}
                className="h-10"
                min="0"
                step="0.1"
              />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Precio/tn</p>
              <p className="text-lg font-bold text-sembrala-green">
                {formatCurrency(cornPrice)}/tn
              </p>
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Total Maíz:</p>
            <p className="text-xl font-bold text-sembrala-green">
              {formatCurrency(cornTotal)}
            </p>
          </div>
        </div>

        {/* Grand Total */}
        <div className="border-t border-gray-200 pt-4">
          <div className="bg-sembrala-green/10 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-700 mb-1">Tenencias Totales:</p>
            <p className="text-3xl font-bold text-sembrala-blue">
              {formatCurrency(grandTotal)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryCard;
