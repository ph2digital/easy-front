
import React from 'react';
import './styles/EngagementReports.css';
import StatisticsChart from '../components/StatisticsChart';

const mockEngagementData = [
  { name: 'Jan', value: 1000 },
  { name: 'Feb', value: 1200 },
  { name: 'Mar', value: 1500 },
  { name: 'Apr', value: 1700 },
  { name: 'May', value: 2000 },
];

const EngagementReports: React.FC = () => {
  return (
    <div className="engagement-reports" id="engagement-reports-page">
      <h1 className="engagement-reports-title">Relatórios de Engajamento</h1>
      <div className="engagement-chart">
        <StatisticsChart data={mockEngagementData} />
      </div>
      <div className="engagement-filters">
        <select className="engagement-filter">
          <option value="7days">Últimos 7 dias</option>
          <option value="1month">Último mês</option>
        </select>
        <button className="export-report-button">Exportar Relatório</button>
      </div>
    </div>
  );
};

export default EngagementReports;