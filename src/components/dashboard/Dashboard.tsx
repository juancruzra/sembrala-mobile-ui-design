
import React, { useState } from 'react';
import Header from './Header';
import WalletCard from './WalletCard';
import InventoryCard from './InventoryCard';
import UpcomingPaymentsCard from './UpcomingPaymentsCard';
import CashFlowCard from './CashFlowCard';
import BottomNavigation from './BottomNavigation';
import FloatingActionButton from './FloatingActionButton';
import ExpenseForm from '../forms/ExpenseForm';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const handleSaveExpense = (expense: any) => {
    console.log('Saved expense:', expense);
    // Here you would typically save to a backend or state management
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="pb-20">
            <WalletCard />
            <InventoryCard />
            <UpcomingPaymentsCard />
            <CashFlowCard />
          </div>
        );
      case 'expenses':
        return (
          <div className="pb-20 p-4 text-center">
            <h2 className="text-xl font-bold text-sembrala-blue mb-4">Gastos</h2>
            <p className="text-gray-600">Sección de gastos en desarrollo...</p>
          </div>
        );
      case 'inventory':
        return (
          <div className="pb-20 p-4 text-center">
            <h2 className="text-xl font-bold text-sembrala-blue mb-4">Inventario</h2>
            <p className="text-gray-600">Gestión completa de inventario en desarrollo...</p>
          </div>
        );
      case 'profile':
        return (
          <div className="pb-20 p-4 text-center">
            <h2 className="text-xl font-bold text-sembrala-blue mb-4">Perfil</h2>
            <p className="text-gray-600">Configuración de perfil en desarrollo...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mobile-container">
      <Header />
      {renderContent()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'dashboard' && (
        <FloatingActionButton onClick={() => setShowExpenseForm(true)} />
      )}
      
      {showExpenseForm && (
        <ExpenseForm
          onClose={() => setShowExpenseForm(false)}
          onSave={handleSaveExpense}
        />
      )}
    </div>
  );
};

export default Dashboard;
