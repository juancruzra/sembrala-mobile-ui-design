
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

const CashFlowCard = () => {
  const cashFlowData = [
    { month: 'Jul', balance: -800000 },
    { month: 'Ago', balance: 1200000 },
    { month: 'Sep', balance: -300000 },
    { month: 'Oct', balance: 2100000 },
    { month: 'Nov', balance: -150000 },
    { month: 'Dic', balance: 1800000 },
  ];

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    if (absAmount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    return `${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <Card className="mx-4 mb-6">
      <CardHeader>
        <CardTitle className="text-lg text-sembrala-blue">
          Tu Flujo de Caja
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cashFlowData}>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                fontSize={12}
                className="text-gray-600"
              />
              <YAxis 
                tickFormatter={formatCurrency}
                axisLine={false}
                tickLine={false}
                fontSize={12}
                className="text-gray-600"
              />
              <Bar dataKey="balance" radius={[4, 4, 0, 0]}>
                {cashFlowData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.balance >= 0 ? '#76CD7C' : '#E74C3C'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="pt-2">
          <Button className="w-full bg-sembrala-green hover:bg-sembrala-green/90">
            Planificar Ventas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashFlowCard;
