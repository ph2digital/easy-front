import React from 'react';
import './styles/Finance.css';
import StatisticsChart from '../components/StatisticsChart';

const mockFinanceData = [
  { id: '1', name: 'Revenue', amount: 5000 },
  { id: '2', name: 'Expenses', amount: 2000 },
  { id: '3', name: 'Profit', amount: 3000 },
  { id: '4', name: 'Investments', amount: 1500 },
  { id: '5', name: 'Savings', amount: 1000 },
  { id: '6', name: 'Debt', amount: 500 },
  { id: '7', name: 'Loans', amount: 2500 },
  { id: '8', name: 'Insurance', amount: 800 },
  { id: '9', name: 'Taxes', amount: 1200 },
  { id: '10', name: 'Miscellaneous', amount: 400 },
];

const mockChartData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 7000 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 6500 },
  { name: 'Jul', value: 7000 },
  { name: 'Aug', value: 7500 },
  { name: 'Sep', value: 8000 },
  { name: 'Oct', value: 8500 },
  { name: 'Nov', value: 9000 },
  { name: 'Dec', value: 9500 },
];

const renderFinanceItems = (data) => {
  return data.map((item) => (
    <div key={item.id} className="finance-item" id={`finance-item-${item.id}`}>
      <span className="finance-item-name">{item.name}</span>
      <span className="finance-item-amount">${item.amount}</span>
    </div>
  ));
};

const Finance: React.FC = () => {
  return (
    <div className="finance" id="finance-page">
      <h1 className="finance-title">Finance</h1>
      <div className="finance-summary">
        {renderFinanceItems(mockFinanceData)}
      </div>
      <div className="finance-filters">
        <select className="finance-filter">
          <option value="all">All</option>
          <option value="revenue">Revenue</option>
          <option value="expenses">Expenses</option>
          <option value="profit">Profit</option>
        </select>
      </div>
      <StatisticsChart data={mockChartData} />
    </div>
  );
};

export default Finance;
