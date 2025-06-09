
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy } from 'lucide-react';

const WalletCard = () => {
  return (
    <Card className="mx-4 mb-6 bg-gradient-to-br from-gray-50 to-gray-100 border-dashed border-2 border-gray-300">
      <CardHeader>
        <CardTitle className="text-lg text-sembrala-blue flex items-center">
          Mi Billetera Sembrala
          <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            Próximamente
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-400">$ --,--</p>
          <p className="text-sm text-gray-500">Saldo disponible</p>
        </div>
        
        <Button 
          disabled 
          className="w-full bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300"
        >
          Transferir Dinero
        </Button>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Tu Alias:</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">[Activa tu cuenta para verlo]</span>
              <Copy className="w-4 h-4 text-gray-300" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Tu CVU:</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">[Activa tu cuenta para verlo]</span>
              <Copy className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <Button className="w-full bg-sembrala-green hover:bg-sembrala-green/90 text-white font-semibold">
            Activar mi Billetera Gratis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
