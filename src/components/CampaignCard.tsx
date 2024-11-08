// src/components/CampaignCard.tsx
import React from 'react';
import { Campaign } from '../types';

interface CampaignCardProps {
    campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
    return (
        <div className="campaign-card">
            <h3>{campaign.name}</h3>
            <p>Status: {campaign.status}</p>
            <p>Budget: ${campaign.budget}</p>
        </div>
    );
};

export default CampaignCard;
