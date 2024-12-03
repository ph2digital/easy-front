// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard';
import InsightsPanel from '../components/InsightsPanel';
import StatisticsChart from '../components/StatisticsChart';
import { Campaign } from '../types';
import { fetchMetaAdsCampaignDetails } from '../services/api';
import './styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      try {
        const campaignDetails = await fetchMetaAdsCampaignDetails('', id); // Replace '' with actual accessToken if needed
        if (campaignDetails) {
          const completeCampaignDetails: Campaign = {
            ...campaignDetails,
            userId: '', // Add appropriate userId
            mode: 'automatic', // Replace 'automatic' with 'guided' or 'manual' if needed
            status: campaignDetails.status as 'active' | 'paused' | 'completed', // Ensure status is one of the allowed values
            budget: Number(campaignDetails.budget) // Convert budget to number
          };
          setSelectedCampaign(completeCampaignDetails);
        }
      } catch (error) {
        console.error('Error fetching campaign details:', error);
      }
    };

    fetchCampaign();
  }, [id]);

  const mockChartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 500 },
    { name: 'Apr', value: 700 },
    { name: 'May', value: 600 },
  ];

  const mockCampaignPerformance = [
    { name: 'Campaign 1', clicks: 100, impressions: 1000, ctr: 10 },
    { name: 'Campaign 2', clicks: 150, impressions: 1200, ctr: 12.5 },
    { name: 'Campaign 3', clicks: 200, impressions: 1500, ctr: 13.3 },
  ];

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="campaigns">
        {selectedCampaign && <CampaignCard campaign={selectedCampaign} />}
      </div>
      <div className="dashboard-charts">
        <InsightsPanel />
        <StatisticsChart data={mockChartData} />
        <div className="campaign-performance">
          <h2>Campaign Performance</h2>
          <ul>
            {mockCampaignPerformance.map((campaign, index) => (
              <li key={index}>
                {campaign.name}: {campaign.clicks} clicks, {campaign.impressions} impressions, {campaign.ctr}% CTR
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
