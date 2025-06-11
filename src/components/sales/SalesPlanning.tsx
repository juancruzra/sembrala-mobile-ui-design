
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useClickTracking } from '@/hooks/useClickTracking';

const SalesPlanning = () => {
  const { trackClick } = useClickTracking();

  const handlePlanSales = () => {
    trackClick('ventas');
    // Aquí se puede agregar la funcionalidad de planificación de ventas en el futuro
  };

  return (
    <Card className="mx-4 mb-6">
      <CardHeader>
        <CardTitle className="text-lg text-sembrala-blue">
          Planificación de Ventas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Próximamente podrás planificar tus ventas y gestionar tu estrategia comercial.
        </p>
        <Button 
          onClick={handlePlanSales}
          className="w-full bg-sembrala-green hover:bg-sembrala-green/90 text-white"
        >
          Planificar Ventas
        </Button>
      </CardContent>
    </Card>
  );
};

export default SalesPlanning;
