
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ExpenseFormProps {
  onClose: () => void;
  onSave: (expense: {
    concept: string;
    amount: number;
    dueDate: string;
    category: string;
  }) => void;
}

const ExpenseForm = ({ onClose, onSave }: ExpenseFormProps) => {
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const categories = [
    'Insumos',
    'Combustible',
    'Labores',
    'Servicios',
    'Alquileres',
    'Honorarios Profesionales',
    'Sueldos',
    'Gastos Personales',
    'Maquinaria',
    'Crédito',
    'Tarjeta',
    'Costo total de cultivo',
    'Otros',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept || !amount || !dueDate || !category) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Debes estar autenticado para guardar vencimientos",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('vencimientos')
        .insert({
          user_id: user.id,
          concepto: concept,
          monto: parseFloat(amount),
          fecha_vencimiento: dueDate,
          categoria: category,
        });

      if (error) {
        console.error('Error saving vencimiento:', error);
        toast({
          title: "Error",
          description: "No se pudo guardar el vencimiento",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Éxito",
        description: "Vencimiento guardado correctamente",
      });

      // Call the original onSave callback for any additional functionality
      onSave({
        concept,
        amount: parseFloat(amount),
        dueDate,
        category,
      });

      // Reset form
      setConcept('');
      setAmount('');
      setDueDate('');
      setCategory('');
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="mobile-container">
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="text-xl text-sembrala-blue">
              Registrar Vencimiento
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-100"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="concept" className="text-base font-medium">
                  Concepto
                </Label>
                <Input
                  id="concept"
                  type="text"
                  placeholder="Ej: Cheque insumos agro"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  className="h-12 text-base"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-base font-medium">
                  Monto
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-12 text-base"
                  inputMode="numeric"
                  min="0"
                  step="0.01"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-base font-medium">
                  Fecha de Vencimiento
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-12 text-base"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Categoría</Label>
                <Select value={category} onValueChange={setCategory} required disabled={loading}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border shadow-lg z-50">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-base py-3">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Fixed bottom button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <div className="max-w-sm mx-auto">
            <Button
              onClick={handleSubmit}
              className="w-full h-12 bg-sembrala-green hover:bg-sembrala-green/90 text-base font-semibold"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Vencimiento"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
