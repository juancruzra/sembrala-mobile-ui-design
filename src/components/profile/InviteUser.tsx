
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Copy, Share } from 'lucide-react';

const InviteUser = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copying, setCopying] = useState(false);

  const inviteCode = user?.id || '';
  const inviteText = `Hola, te mando un código de invitación para que pruebes Sembrala sin cargo: 
  ${inviteCode}
  https://sembrala-mobile-ui-design.vercel.app/`;

  const copyToClipboard = async () => {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(inviteText);
      toast({
        title: "¡Copiado!",
        description: "El texto se ha copiado al portapapeles",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive",
      });
    } finally {
      setCopying(false);
    }
  };

  const shareInvite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Invitación a Sembrala',
          text: inviteText,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback para dispositivos que no soportan Web Share API
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(inviteText)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-sembrala-blue">
          Invitar Usuario
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 p-3 bg-gray-50 rounded-md border text-sm">
            {inviteText}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            disabled={copying}
            className="shrink-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          onClick={shareInvite}
          className="w-full bg-sembrala-green hover:bg-sembrala-green/90"
        >
          <Share className="w-4 h-4 mr-2" />
          Compartir
        </Button>
      </CardContent>
    </Card>
  );
};

export default InviteUser;
