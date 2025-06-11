
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTotals } from '@/hooks/useTotals';
import { useClickTracking } from '@/hooks/useClickTracking';

const CashFlowCard = () => {
  const { 
    currentTenencias,
    totalTenencias, 
    upcomingPayments, 
    futureSaldo, 
    projectedFutureSaldo, 
    loading, 
    formatCurrency 
  } = useTotals();

  const { trackClick } = useClickTracking();

  const handlePlanSales = () => {
    trackClick('ventas');
    // Aquí se puede agregar la funcionalidad de planificación de ventas en el futuro
  };

  if (loading) {
    return (
      <Card className="mx-4 mb-6">
        <CardContent className="p-6">
          <div className="text-center">Cargando flujo de caja...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-4 mb-6">
      <CardHeader>
        <CardTitle className="text-lg text-sembrala-blue">
          Tu Flujo de Caja
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumen de cálculo */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Tenencias Actuales:</span>
            <span className="font-semibold text-sembrala-green">
              {formatCurrency(currentTenencias)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Próximos Vencimientos:</span>
            <span className="font-semibold text-red-600">
              -{formatCurrency(upcomingPayments)}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Resultado:</span>
              <span className={`font-bold ${futureSaldo >= 0 ? 'text-sembrala-green' : 'text-red-600'}`}>
                {formatCurrency(futureSaldo)}
              </span>
            </div>
          </div>
        </div>

        {/* Saldo Futuro */}
        <div className="bg-sembrala-green/10 p-6 rounded-lg text-center">
          <p className="text-sm text-gray-700 mb-2">Saldo Futuro</p>
          <p className={`text-3xl font-bold ${futureSaldo >= 0 ? 'text-sembrala-green' : 'text-red-600'}`}>
            {formatCurrency(futureSaldo)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            (Tenencias actuales - Vencimientos pendientes)
          </p>
        </div>

        {/* Saldo Futuro Proyectado */}
        <div className="bg-blue-50 p-6 rounded-lg text-center">
          <p className="text-sm text-gray-700 mb-2">Saldo Futuro Proyectado</p>
          <p className={`text-3xl font-bold ${projectedFutureSaldo >= 0 ? 'text-sembrala-blue' : 'text-red-600'}`}>
            {formatCurrency(projectedFutureSaldo)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            (Incluye tenencias proyectadas)
          </p>
        </div>
        
        <div className="pt-2">
          <Button 
            onClick={handlePlanSales}
            className="w-full bg-sembrala-green hover:bg-sembrala-green/90"
          >
            Planificar Ventas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashFlowCard;
