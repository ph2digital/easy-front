import React from 'react';
import './styles/CreateCampaign.css';

const CreateCampaign: React.FC = () => {
  const mockCampaignData = [
    { id: '1', name: 'Campaign 1', budget: '$1000' },
    { id: '2', name: 'Campaign 2', budget: '$2000' },
    { id: '3', name: 'Campaign 3', budget: '$3000' },
  ];

  return (
    <div className="create-campaign">
      <h1>Create Campaign</h1>
      <ul>
        {mockCampaignData.map((campaign) => (
          <li key={campaign.id}>
            {campaign.name} - {campaign.budget}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateCampaign;
