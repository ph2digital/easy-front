// src/components/StatisticsChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatisticsChartProps {
    data: { name: string; value: number }[];
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({ data }) => {
    return (
        <div className="statistics-chart">
            <h3>Métricas da Campanha</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StatisticsChart;
