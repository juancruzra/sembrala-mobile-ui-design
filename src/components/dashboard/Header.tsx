
import React from 'react';
import { Bell, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
      <div className="flex items-center">
        <img src="logo.png" alt="Logo Sembrala" className="mx-auto h-20 w-auto" />
        </div>
      <div className="flex items-center space-x-3">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-6 h-6 text-sembrala-blue" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors
  onClick={goToProfile}">
          <User className="w-6 h-6 text-sembrala-blue" />
        </button>
      </div>
    </header>
  );
};

export default Header;
