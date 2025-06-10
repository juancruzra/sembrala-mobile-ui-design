
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <div className="fixed bottom-20 right-4 z-40">
      <Button
        onClick={onClick}
        className="w-14 h-14 rounded-full bg-sembrala-green hover:bg-sembrala-green/90 shadow-lg"
        size="icon"
      >
        <Plus className="w-6 h-6" />
        <span className="sr-only">Agregar Gasto</span>
      </Button>
      <div className="absolute -top-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
        Agregar Gasto
      </div>
    </div>
  );
};

export default FloatingActionButton;
