
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const ReportRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    numberOfCrops: '1'
  });

  const cropPrices = {
    '1': 96900,
    '2': 136900,
    '3': 188900
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "Debes estar autenticado para enviar una solicitud",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name.trim() || !formData.whatsapp.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const cost = cropPrices[formData.numberOfCrops as keyof typeof cropPrices];
      
      const { error } = await supabase
        .from('report_requests')
        .insert({
          user_id: user.id,
          name: formData.name.trim(),
          whatsapp: formData.whatsapp.trim(),
          number_of_crops: parseInt(formData.numberOfCrops),
          cost: cost
        });

      if (error) {
        console.error('Error submitting report request:', error);
        toast({
          title: "Error",
          description: "No se pudo enviar la solicitud. Intenta nuevamente.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "¡Solicitud enviada!",
        description: "Recibirás un contacto para coordinar la llamada previa.",
      });

      // Limpiar formulario
      setFormData({
        name: '',
        whatsapp: '',
        numberOfCrops: '1'
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mobile-container min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white border-b z-10 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-sembrala-blue"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-sembrala-blue">
            Solicitar Informe Detallado
          </h1>
        </div>
      </div>

      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-sembrala-blue">
              Informe Personalizado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed">
                Pedí un informe detallado de costos, ingresos proyectados y resultado económico esperado para tus próximos cultivos.
              </p>
              <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                El informe requiere una llamada previa para entender tu situación particular y se entrega luego en PDF por mail o WhatsApp.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Costos:</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>1 cultivo</span>
                  <span className="font-medium">{formatCurrency(cropPrices['1'])}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>2 cultivos</span>
                  <span className="font-medium">{formatCurrency(cropPrices['2'])}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>3 cultivos</span>
                  <span className="font-medium">{formatCurrency(cropPrices['3'])}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="h-12 text-base"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="Ej: +54 9 11 1234-5678"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  className="h-12 text-base"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-3">
                <Label>Cantidad de cultivos a analizar</Label>
                <RadioGroup
                  value={formData.numberOfCrops}
                  onValueChange={(value) => handleInputChange('numberOfCrops', value)}
                  disabled={isSubmitting}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="crops1" />
                    <Label htmlFor="crops1" className="flex-1 cursor-pointer">
                      <div className="flex justify-between">
                        <span>1 cultivo</span>
                        <span className="font-medium">{formatCurrency(cropPrices['1'])}</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="crops2" />
                    <Label htmlFor="crops2" className="flex-1 cursor-pointer">
                      <div className="flex justify-between">
                        <span>2 cultivos</span>
                        <span className="font-medium">{formatCurrency(cropPrices['2'])}</span>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="crops3" />
                    <Label htmlFor="crops3" className="flex-1 cursor-pointer">
                      <div className="flex justify-between">
                        <span>3 cultivos</span>
                        <span className="font-medium">{formatCurrency(cropPrices['3'])}</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="bg-sembrala-green/10 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total a pagar:</span>
                  <span className="text-xl font-bold text-sembrala-blue">
                    {formatCurrency(cropPrices[formData.numberOfCrops as keyof typeof cropPrices])}
                  </span>
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full h-12 bg-sembrala-green hover:bg-sembrala-green/90 text-base font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando solicitud...' : 'Enviar Solicitud'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportRequest;
