// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import CampaignCard from '../components/CampaignCard';
import InsightsPanel from '../components/InsightsPanel';
import StatisticsChart from '../components/StatisticsChart';
import { Campaign } from '../types';

const Dashboard: React.FC = () => {
    const [campaigns] = useState<Campaign[]>([]);

    useEffect(() => {
        // Buscar campanhas e métricas aqui
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                {campaigns.map(campaign => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
            </div>
            <InsightsPanel />
            <StatisticsChart data={[]} />
        </div>
    );
};

export default Dashboard;
