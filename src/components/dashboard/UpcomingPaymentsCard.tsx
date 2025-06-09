
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UpcomingPaymentsCard = () => {
  const payments = [
    {
      id: 1,
      concept: "Cheque-Insumos Agro",
      daysUntilDue: 4,
      amount: 12500000,
    },
    {
      id: 2,
      concept: "Combustible - YPF",
      daysUntilDue: 7,
      amount: 850000,
    },
    {
      id: 3,
      concept: "Servicios Técnicos",
      daysUntilDue: 12,
      amount: 320000,
    },
    {
      id: 4,
      concept: "Alquiler Campo",
      daysUntilDue: 18,
      amount: 2100000,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDaysText = (days: number) => {
    if (days === 1) return '1 día';
    return `${days} días`;
  };

  return (
    <Card className="mx-4 mb-6">
      <CardHeader>
        <CardTitle className="text-lg text-sembrala-blue">
          Próximos Vencimientos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {payments.slice(0, 4).map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <p className="font-medium text-sembrala-blue text-sm">
                {payment.concept}
              </p>
              <p className="text-xs text-gray-600">
                Vence en {getDaysText(payment.daysUntilDue)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-sembrala-red">
                {formatCurrency(payment.amount)}
              </p>
            </div>
          </div>
        ))}
        
        <div className="pt-3 border-t border-gray-200">
          <button className="text-sembrala-green hover:underline text-sm font-medium">
            Ver todos los vencimientos
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingPaymentsCard;
