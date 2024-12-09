// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard';
import InsightsPanel from '../components/InsightsPanel';
import { Campaign } from '../types';
import { fetchMetaAdsCampaignDetails, fetchPageComments } from '../services/api';
import './styles/Dashboard.css';
import PerformanceChart from '../components/PerformanceChart';
import EngagementGraph from '../components/EngagementGraph';
import { mockChartData, mockCampaignPerformance } from '../mockData';

const renderCampaignPerformance = (data: any) => {
  return data.map((campaign: any, index: any) => (
    <li key={index} className="campaign-performance-item" id={`campaign-performance-item-${index}`}>
      {campaign.name}: {campaign.clicks} clicks, {campaign.impressions} impressions, {campaign.ctr}% CTR
    </li>
  ));
};

const Dashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      try {
        const campaignDetails = await fetchMetaAdsCampaignDetails('', id);
        if (campaignDetails) {
          const completeCampaignDetails: Campaign = {
            ...campaignDetails,
            userId: '',
            mode: 'automatic',
            status: campaignDetails.status as 'active' | 'paused' | 'completed',
            budget: campaignDetails.budget,
            clicks: Number(campaignDetails.insights?.data[0]?.clicks) || 0,
            impressions: Number(campaignDetails.insights?.data[0]?.impressions) || 0,
            platform: campaignDetails.platform || '',
            ctr: Number(campaignDetails.insights?.data[0]?.ctr).toString() || '0',
            cpc: Number(campaignDetails.insights?.data[0]?.cpc) || 0,
            cpm: Number(campaignDetails.insights?.data[0]?.cpm) || 0,
            reach: Number(campaignDetails.insights?.data[0]?.reach) || 0,
            frequency: Number(campaignDetails.insights?.data[0]?.frequency) || 0,
            specialAdCategories: campaignDetails.specialAdCategories || [],
            ads: campaignDetails.ads || [],
            spend: campaignDetails.spend ? campaignDetails.spend.toString() : '0',
            adsets: campaignDetails.adsets || []
          };
          setSelectedCampaign(completeCampaignDetails);
        }
      } catch (error) {
        console.error('Error fetching campaign details:', error);
      }
    };

    fetchCampaign();
  }, [id]);

  const handleFetchPageComments = async () => {
    const pageId = 'mockPageId';
    const accessToken = 'mockAccessToken';
    const comments = await fetchPageComments(pageId, accessToken);
    console.log('Fetched page comments:', comments);
    alert(`Fetched comments: ${comments.map((comment: any) => comment.message).join(', ')}`);
  };

  return (
    <div className="dashboard" id="dashboard-page">
      <h1 className="dashboard-title">Dashboard</h1>
      <div className="campaigns">
        {selectedCampaign && <CampaignCard campaign={selectedCampaign} />}
      </div>
      <div className="dashboard-charts">
        <InsightsPanel />
        <PerformanceChart data={mockChartData} />
        <EngagementGraph data={mockCampaignPerformance} />
        <div className="campaign-performance">
          <h2 className="campaign-performance-title">Campaign Performance</h2>
          <ul className="campaign-performance-list">
            {renderCampaignPerformance(mockCampaignPerformance)}
          </ul>
        </div>
      </div>
      <div className="dashboard-filters">
        <select className="dashboard-filter">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <button onClick={handleFetchPageComments}>Fetch Page Comments</button>
    </div>
  );
};

export default Dashboard;
