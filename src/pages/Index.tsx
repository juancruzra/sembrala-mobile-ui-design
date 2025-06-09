
import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import Dashboard from '@/components/dashboard/Dashboard';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already authenticated (you might check localStorage, cookies, etc.)
  useEffect(() => {
    const authStatus = localStorage.getItem('sembrala_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
    localStorage.setItem('sembrala_authenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sembrala_authenticated');
  };

  if (!isAuthenticated) {
    return <Auth onAuthenticated={handleAuthentication} />;
  }

  return (
    <div className="min-h-screen bg-sembrala-light-gray">
      <Dashboard />
    </div>
  );
};

export default Index;
