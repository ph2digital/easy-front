import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EngagementGraphProps {
  data: { name: string; clicks: number; impressions: number; ctr: number }[];
}

const EngagementGraph: React.FC<EngagementGraphProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="clicks" fill="#8884d8" />
        <Bar dataKey="impressions" fill="#82ca9d" />
        <Bar dataKey="ctr" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EngagementGraph;