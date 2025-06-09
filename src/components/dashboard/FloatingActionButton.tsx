
import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 w-14 h-14 bg-sembrala-green hover:bg-sembrala-green/90 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-40"
    >
      <Plus className="w-6 h-6 mx-auto" />
    </button>
  );
};

export default FloatingActionButton;
