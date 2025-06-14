
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInventoryData } from '@/hooks/useInventoryData';
import CurrentTenenciasSection from './inventory/CurrentTenenciasSection';
import ProjectedTenenciasSection from './inventory/ProjectedTenenciasSection';

const CompactInventoryCard = () => {
  const {
    crops,
    currentPrices,
    projectedPrices,
    loading,
    handleCropChange,
  } = useInventoryData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const currentCrops = ['soja', 'maiz', 'trigo', 'girasol'];
  const projectedCrops = ['soja', 'maiz', 'trigo', 'girasol'];

  const currentTotal = currentCrops.reduce((sum, crop) => {
    const cropKey = `${crop}_actual` as keyof typeof crops;
    const price = currentPrices[crop as keyof typeof currentPrices] || 0;
    return sum + (crops[cropKey] * price);
  }, 0);

  const projectedTotal = projectedCrops.reduce((sum, crop) => {
    const cropKey = `${crop}_proyectada` as keyof typeof crops;
    return sum + (crops[cropKey] * projectedPrices[crop as keyof typeof projectedPrices]);
  }, 0);

  const grandTotal = currentTotal + projectedTotal;

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
        <CurrentTenenciasSection
          crops={crops}
          currentPrices={currentPrices}
          onCropChange={handleCropChange}
          formatCurrency={formatCurrency}
        />

        <ProjectedTenenciasSection
          crops={crops}
          projectedPrices={projectedPrices}
          onCropChange={handleCropChange}
          formatCurrency={formatCurrency}
        />

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
