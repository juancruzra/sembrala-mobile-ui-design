
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTotals } from '@/hooks/useTotals';

// Precios actuales para tenencias actuales
const CURRENT_PRICES = {
  'Soja': 280,
  'Maíz': 180,
  'Girasol': 320,
  'Trigo': 250
};

// Precios proyectados para tenencias proyectadas
const PROJECTED_PRICES = {
  'Soja': 300,
  'Maíz': 200,
  'Girasol': 340,
  'Trigo': 270
};

const CompactInventoryCard = () => {
  const { 
    totalTenencias, 
    projectedTenencias, 
    loading, 
    formatCurrency 
  } = useTotals();

  // Tenencias actuales con precios actuales
  const currentTenencias = [
    { producto: 'Soja', cantidad: 150, precio: CURRENT_PRICES['Soja'] },
    { producto: 'Maíz', cantidad: 200, precio: CURRENT_PRICES['Maíz'] },
    { producto: 'Girasol', cantidad: 80, precio: CURRENT_PRICES['Girasol'] },
    { producto: 'Trigo', cantidad: 120, precio: CURRENT_PRICES['Trigo'] }
  ];

  // Tenencias proyectadas con precios proyectados
  const projectedTenenciasData = [
    { producto: 'Maíz', cantidad: 300, precio: PROJECTED_PRICES['Maíz'] },
    { producto: 'Soja', cantidad: 250, precio: PROJECTED_PRICES['Soja'] }
  ];

  const calculateValue = (tenencias: typeof currentTenencias) => {
    return tenencias.reduce((total, item) => total + (item.cantidad * item.precio), 0);
  };

  const currentValue = calculateValue(currentTenencias);
  const projectedValue = calculateValue(projectedTenenciasData);

  if (loading) {
    return (
      <Card className="mx-4 mb-6">
        <CardContent className="p-6">
          <div className="text-center">Cargando inventario...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-4 mb-6">
      <CardHeader>
        <CardTitle className="text-lg text-sembrala-blue">
          Tenencias Valorizadas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tenencias Actuales */}
        <div>
          <h3 className="font-semibold text-sembrala-blue mb-3">Tenencias Actuales</h3>
          <div className="space-y-2">
            {currentTenencias.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {item.producto}: {item.cantidad} tn × ${item.precio}
                </span>
                <span className="font-medium text-sembrala-green">
                  {formatCurrency(item.cantidad * item.precio)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Total Actual:</span>
              <span className="font-bold text-sembrala-green text-lg">
                {formatCurrency(currentValue)}
              </span>
            </div>
          </div>
        </div>

        {/* Tenencias Proyectadas */}
        <div>
          <h3 className="font-semibold text-sembrala-blue mb-3">Tenencias Proyectadas</h3>
          <div className="space-y-2">
            {projectedTenenciasData.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {item.producto}: {item.cantidad} tn × ${item.precio}
                </span>
                <span className="font-medium text-blue-600">
                  {formatCurrency(item.cantidad * item.precio)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Total Proyectado:</span>
              <span className="font-bold text-blue-600 text-lg">
                {formatCurrency(projectedValue)}
              </span>
            </div>
          </div>
        </div>

        {/* Total General */}
        <div className="bg-sembrala-green/10 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Valor Total Estimado:</span>
            <span className="font-bold text-sembrala-green text-xl">
              {formatCurrency(currentValue + projectedValue)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            (Tenencias actuales + proyectadas)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompactInventoryCard;
