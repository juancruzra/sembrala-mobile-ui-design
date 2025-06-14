
import React from 'react';
import CropInput from './CropInput';
import { CropInventory } from '@/hooks/useInventoryData';

interface CurrentTenenciasSectionProps {
  crops: CropInventory;
  currentPrices: Record<string, number | null>;
  onCropChange: (cropKey: string, value: number) => void;
  formatCurrency: (amount: number) => string;
}

const CurrentTenenciasSection: React.FC<CurrentTenenciasSectionProps> = ({
  crops,
  currentPrices,
  onCropChange,
  formatCurrency,
}) => {
  const cropLabels = {
    soja: 'Soja',
    maiz: 'Maíz',
    trigo: 'Trigo',
    girasol: 'Girasol',
  };
  
  const currentCrops = ['soja', 'maiz', 'trigo', 'girasol'];
  
  const currentTotal = currentCrops.reduce((sum, crop) => {
    const cropKey = `${crop}_actual` as keyof CropInventory;
    const price = currentPrices[crop as keyof typeof currentPrices] || 0;
    return sum + (crops[cropKey] * price);
  }, 0);

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-sembrala-blue text-sm border-b border-gray-200 pb-1">
        Tenencias Actuales
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {currentCrops.map((crop) => {
          const cropKey = `${crop}_actual` as keyof CropInventory;
          const price = currentPrices[crop as keyof typeof currentPrices];
          return (
            <CropInput
              key={cropKey}
              cropKey={cropKey}
              cropName={cropLabels[crop as keyof typeof cropLabels]}
              quantity={crops[cropKey]}
              price={price}
              onQuantityChange={onCropChange}
              formatCurrency={formatCurrency}
            />
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
  );
};

export default CurrentTenenciasSection;
