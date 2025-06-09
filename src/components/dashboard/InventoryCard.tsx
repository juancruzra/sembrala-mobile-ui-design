
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const InventoryCard = () => {
  const [soyaTons, setSoyaTons] = useState(0);
  const [cornTons, setCornTons] = useState(0);
  
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
                onChange={(e) => setSoyaTons(Number(e.target.value) || 0)}
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
                onChange={(e) => setCornTons(Number(e.target.value) || 0)}
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
