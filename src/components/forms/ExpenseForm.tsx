
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

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

  const categories = [
    'Insumos',
    'Combustible',
    'Labores',
    'Servicios',
    'Honorarios Profesionales',
    'Sueldos',
    'Gastos Personales',
    'Maquinaria',
    'Crédito',
    'Tarjeta',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept || !amount || !dueDate || !category) {
      alert('Por favor completa todos los campos');
      return;
    }

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
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Categoría</Label>
                <Select value={category} onValueChange={setCategory} required>
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
            >
              Guardar Vencimiento
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
