
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CropInputProps {
  cropKey: string;
  cropName: string;
  quantity: number;
  price: number | null;
  onQuantityChange: (cropKey: string, value: number) => void;
  formatCurrency: (amount: number) => string;
}

const CropInput: React.FC<CropInputProps> = ({
  cropKey,
  cropName,
  quantity,
  price,
  onQuantityChange,
  formatCurrency,
}) => {
  const safePrice = price || 0;
  
  return (
    <div className="space-y-2">
      <Label className="text-xs text-gray-600">
        {cropName}
      </Label>
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          placeholder="Tn"
          value={quantity || ''}
          onChange={(e) => onQuantityChange(cropKey, Number(e.target.value) || 0)}
          className="h-8 text-sm flex-1"
          min="0"
          step="0.1"
        />
        <span className="text-xs text-gray-500">
          {formatCurrency(safePrice)}/tn
        </span>
      </div>
      <div className="text-right">
        <span className="text-sm font-semibold text-sembrala-green">
          {formatCurrency(quantity * safePrice)}
        </span>
      </div>
    </div>
  );
};

export default CropInput;
