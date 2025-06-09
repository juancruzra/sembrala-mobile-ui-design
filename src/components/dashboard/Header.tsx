
import React from 'react';
import { Bell, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-sembrala-green rounded-full flex items-center justify-center mr-2">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <h1 className="text-xl font-bold text-sembrala-blue">Sembrala</h1>
      </div>
      <div className="flex items-center space-x-3">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-6 h-6 text-sembrala-blue" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <User className="w-6 h-6 text-sembrala-blue" />
        </button>
      </div>
    </header>
  );
};

export default Header;
