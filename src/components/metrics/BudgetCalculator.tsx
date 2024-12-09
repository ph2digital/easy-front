import React from 'react';

const BudgetCalculator: React.FC = () => {
  return (
    <div className="budget-calculator">
      <h3>Budget Calculator</h3>
      <label>Total Budget:</label>
      <input type="number" placeholder="Enter total budget" />
      <label>Daily Budget:</label>
      <input type="number" placeholder="Enter daily budget" />
    </div>
  );
};

export default BudgetCalculator;