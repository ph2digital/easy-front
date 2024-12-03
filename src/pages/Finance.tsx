import React from 'react';
import './styles/Finance.css';
import StatisticsChart from '../components/StatisticsChart';

const Finance: React.FC = () => {
  const mockFinanceData = [
    { id: '1', name: 'Revenue', amount: 5000 },
    { id: '2', name: 'Expenses', amount: 2000 },
    { id: '3', name: 'Profit', amount: 3000 },
    { id: '4', name: 'Investments', amount: 1500 },
    { id: '5', name: 'Savings', amount: 1000 },
    { id: '6', name: 'Debt', amount: 500 },
  ];

  const mockChartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 7000 },
    { name: 'May', value: 6000 },
  ];

  return (
    <div className="finance">
      <h1>Finance</h1>
      <div className="finance-summary">
        {mockFinanceData.map((item) => (
          <div key={item.id} className="finance-item">
            <span className="finance-item-name">{item.name}</span>
            <span className="finance-item-amount">${item.amount}</span>
          </div>
        ))}
      </div>
      <StatisticsChart data={mockChartData} />
    </div>
  );
};

export default Finance;
