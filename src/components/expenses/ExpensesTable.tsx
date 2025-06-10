
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Expense {
  id: string;
  concepto: string;
  monto: number;
  fecha_vencimiento: string;
  categoria: string;
  estado: string;
  created_at: string;
}

const ExpensesTable = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR');
  };

  useEffect(() => {
    loadExpenses();

    // Suscribirse a cambios en tiempo real
    const channel = supabase
      .channel('expenses-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vencimientos'
        },
        () => {
          console.log('Expenses changed, reloading...');
          loadExpenses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadExpenses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('vencimientos')
        .select('*')
        .eq('user_id', user.id)
        .order('fecha_vencimiento', { ascending: true });

      if (error) {
        console.error('Error loading expenses:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los gastos",
          variant: "destructive",
        });
        return;
      }

      setExpenses(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="mx-4 mb-6">
        <CardContent className="p-6">
          <div className="text-center">Cargando gastos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-4 mb-6">
      <CardHeader>
        <CardTitle className="text-lg text-sembrala-blue">
          Gastos Registrados
        </CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No hay gastos registrados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.concepto}</TableCell>
                    <TableCell>{expense.categoria}</TableCell>
                    <TableCell>{formatCurrency(Number(expense.monto))}</TableCell>
                    <TableCell>{formatDate(expense.fecha_vencimiento)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        expense.estado === 'Pendiente' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {expense.estado}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpensesTable;
