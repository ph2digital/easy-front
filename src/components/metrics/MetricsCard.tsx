import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, change, icon, color }) => {
  const isPositive = change >= 0;
  
  return (
    <div className={`bg-${color}-50 p-4 rounded-lg`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`text-${color}-600`}>{icon}</div>
        <span className={`text-sm text-${color}-600`}>{title}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <div className="flex items-center gap-1">
        {isPositive ? (
          <TrendingUp className="w-4 h-4 text-green-600" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-600" />
        )}
        <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? '+' : ''}{change}% vs. último período
        </span>
      </div>
    </div>
  );
};

export default MetricsCard;