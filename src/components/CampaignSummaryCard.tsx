import React from 'react';
import { Campaign } from '../types';

interface CampaignSummaryCardProps {
  campaigns: Campaign[];
}

const CampaignSummaryCard: React.FC<CampaignSummaryCardProps> = ({ campaigns }) => {
  return (
    <div className="campaign-summary-card">
      <h3>Campaign Summary</h3>
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="campaign-summary-item">
          <h4>{campaign.name}</h4>
          <p>Status: {campaign.status}</p>
          <p>Budget: {campaign.budget}</p>
          <p>Clicks: {campaign.clicks}</p>
          <p>Impressions: {campaign.impressions}</p>
        </div>
      ))}
    </div>
  );
};

export default CampaignSummaryCard;