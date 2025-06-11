import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useClickTracking } from '@/hooks/useClickTracking';

const CropCostCalculator = () => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [hectares, setHectares] = useState('');
  const navigate = useNavigate();
  const { trackClick } = useClickTracking();

  const cropCosts = {
    'Soja 25/26': { costUSD: 418, status: 'available' },
    'Maíz 25/26': { costUSD: 562, status: 'available' },
    'Trigo 25': { costUSD: 265, status: 'available' },
    'Girasol 25': { costUSD: 403, status: 'available' },
    'Sorgo': { costUSD: 0, status: 'próximamente' },
  };

  const usdToArsRate = 1182;

  const calculateTotals = () => {
    if (!selectedCrop || !hectares || cropCosts[selectedCrop as keyof typeof cropCosts].status !== 'available') {
      return { totalUSD: 0, totalARS: 0 };
    }

    const costPerHectare = cropCosts[selectedCrop as keyof typeof cropCosts].costUSD;
    const totalUSD = costPerHectare * Number(hectares);
    const totalARS = totalUSD * usdToArsRate;

    return { totalUSD, totalARS };
  };

  const { totalUSD, totalARS } = calculateTotals();

  const formatCurrency = (amount: number, currency: 'USD' | 'ARS') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    } else {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }
  };

  const handleRequestReport = () => {
    trackClick('costos');
    navigate('/report-request');
  };

  return (
    <Card className="mx-4 mb-6">
      <CardHeader>
        <CardTitle className="text-lg text-sembrala-blue">
          Costos de Cultivo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-base font-medium">Cultivo</Label>
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Selecciona un cultivo" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              {Object.keys(cropCosts).map((crop) => (
                <SelectItem key={crop} value={crop} className="text-base py-3">
                  {crop}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCrop && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Costo USD/ha:</span>
                <span className="font-semibold text-sembrala-blue">
                  {cropCosts[selectedCrop as keyof typeof cropCosts].status === 'available' 
                    ? `${formatCurrency(cropCosts[selectedCrop as keyof typeof cropCosts].costUSD, 'USD')}/ha`
                    : cropCosts[selectedCrop as keyof typeof cropCosts].status
                  }
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hectares" className="text-base font-medium">
                Hectáreas
              </Label>
              <Input
                id="hectares"
                type="number"
                placeholder="Ingresa las hectáreas"
                value={hectares}
                onChange={(e) => setHectares(e.target.value)}
                className="h-12 text-base"
                min="0"
                step="0.1"
              />
            </div>

            {hectares && cropCosts[selectedCrop as keyof typeof cropCosts].status === 'available' && (
              <div className="space-y-3">
                <div className="bg-sembrala-green/10 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">Total:</p>
                  <div className="space-y-1">
                    <p className="text-xl font-bold text-sembrala-blue">
                      USD: {formatCurrency(totalUSD, 'USD')}
                    </p>
                    <p className="text-lg font-semibold text-sembrala-green">
                      Pesos hoy: {formatCurrency(totalARS, 'ARS')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-50 p-3 rounded text-xs text-gray-600">
          <p className="font-medium mb-1">Aclaración:</p>
          <p>Costo aproximado de: Labores (Siembra, Aplicaciones, Cosecha) + Semilla + Agroquímicos.</p>
          <p className="mt-1"><strong>No incluye:</strong> Alquiler, fertilizante, fertilizaciones, gerenciamiento.</p>
        </div>

        <div className="border-t pt-4 mt-6">
          <div className="bg-sembrala-blue/5 p-4 rounded-lg">
            <p className="text-sm text-gray-700 mb-3">
              Solicitá un análisis de costos y resultados proyectados detallado y personalizado.
            </p>
            <Button 
              onClick={handleRequestReport}
              className="w-full bg-sembrala-blue hover:bg-sembrala-blue/90 text-white"
            >
              Solicitar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CropCostCalculator;
