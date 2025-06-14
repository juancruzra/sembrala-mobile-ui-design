
import React from 'react';
import CropInput from './CropInput';
import { CropInventory } from '@/hooks/useInventoryData';

interface ProjectedTenenciasSectionProps {
  crops: CropInventory;
  projectedPrices: Record<string, number>;
  onCropChange: (cropKey: string, value: number) => void;
  formatCurrency: (amount: number) => string;
}

const ProjectedTenenciasSection: React.FC<ProjectedTenenciasSectionProps> = ({
  crops,
  projectedPrices,
  onCropChange,
  formatCurrency,
}) => {
  const cropLabels = {
    soja: 'Soja',
    maiz: 'Maíz',
    trigo: 'Trigo',
    girasol: 'Girasol',
  };
  
  const projectedCrops = ['soja', 'maiz', 'trigo', 'girasol'];
  
  const projectedTotal = projectedCrops.reduce((sum, crop) => {
    const cropKey = `${crop}_proyectada` as keyof CropInventory;
    return sum + (crops[cropKey] * projectedPrices[crop as keyof typeof projectedPrices]);
  }, 0);

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-sembrala-blue text-sm border-b border-gray-200 pb-1">
        Tenencias Proyectadas
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {projectedCrops.map((crop) => {
          const cropKey = `${crop}_proyectada` as keyof CropInventory;
          const price = projectedPrices[crop as keyof typeof projectedPrices];
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
      <div className="bg-blue-50 p-3 rounded-lg text-center">
        <p className="text-xs text-gray-700 mb-1">Subtotal Proyectadas:</p>
        <p className="text-lg font-bold text-sembrala-blue">
          {formatCurrency(projectedTotal)}
        </p>
      </div>
    </div>
  );
};

export default ProjectedTenenciasSection;
