
import React from 'react';
import ExpensesTable from '../expenses/ExpensesTable';
import CropCostCalculator from '../expenses/CropCostCalculator';

const ExpensesSection = () => {
  return (
    <div className="pb-20 space-y-6">
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold text-sembrala-blue mb-2">Gastos</h2>
      </div>
      <ExpensesTable />
      <CropCostCalculator />
    </div>
  );
};

export default ExpensesSection;
