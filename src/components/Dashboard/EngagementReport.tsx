import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, MessageSquare, Share2 } from 'lucide-react';

const mockData = [
  { date: '2024-01', reach: 1200, likes: 450, comments: 89, shares: 23 },
  { date: '2024-02', reach: 1500, likes: 580, comments: 102, shares: 35 },
  { date: '2024-03', reach: 2100, likes: 890, comments: 156, shares: 67 },
  { date: '2024-04', reach: 1800, likes: 720, comments: 134, shares: 45 },
];

const EngagementChart: React.FC<{ data: any[] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="reach" fill="#3B82F6" name="Alcance" />
      <Bar dataKey="likes" fill="#10B981" name="Curtidas" />
      <Bar dataKey="comments" fill="#8B5CF6" name="Comentários" />
      <Bar dataKey="shares" fill="#F97316" name="Compartilhamentos" />
    </BarChart>
  </ResponsiveContainer>
);

const EngagementReport: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Relatório de Engajamento</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-blue-600">Alcance Total</span>
          </div>
          <p className="text-2xl font-bold">6,600</p>
          <span className="text-sm text-green-600">+15% vs. último mês</span>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-600">Curtidas</span>
          </div>
          <p className="text-2xl font-bold">2,640</p>
          <span className="text-sm text-green-600">+22% vs. último mês</span>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-purple-600">Comentários</span>
          </div>
          <p className="text-2xl font-bold">481</p>
          <span className="text-sm text-green-600">+18% vs. último mês</span>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Share2 className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-orange-600">Compartilhamentos</span>
          </div>
          <p className="text-2xl font-bold">170</p>
          <span className="text-sm text-green-600">+25% vs. último mês</span>
        </div>
      </div>

      <div className="h-[400px]">
        <EngagementChart data={mockData} />
      </div>
    </div>
  );
};

export default EngagementReport;