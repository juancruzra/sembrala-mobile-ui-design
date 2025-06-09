
import React, { useState } from 'react';
import Header from './Header';
import WalletCard from './WalletCard';
import InventoryCard from './InventoryCard';
import UpcomingPaymentsCard from './UpcomingPaymentsCard';
import CashFlowCard from './CashFlowCard';
import BottomNavigation from './BottomNavigation';
import FloatingActionButton from './FloatingActionButton';
import ExpenseForm from '../forms/ExpenseForm';
import ProfileSection from './ProfileSection';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaveExpense = (expense: any) => {
    console.log('Saved expense:', expense);
    // Trigger a refresh of the upcoming payments component
    setRefreshKey(prev => prev + 1);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="pb-20">
            <WalletCard />
            <InventoryCard />
            <UpcomingPaymentsCard key={refreshKey} />
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
      case 'credits':
        return (
          <div className="pb-20 p-4 text-center">
            <h2 className="text-xl font-bold text-sembrala-blue mb-4">Créditos</h2>
            <p className="text-gray-600">Gestión y Calificación de Créditos en desarrollo...</p>
          </div>
        );
      case 'profile':
        return <ProfileSection />;
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
