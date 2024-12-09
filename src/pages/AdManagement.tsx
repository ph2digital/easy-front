import React, { useState } from 'react';
import './styles/AdManagement.css';
import { createPagePost } from '../services/api'; // Import createPagePost

const mockCampaigns = [
  { id: '1', name: 'Campaign 1', budget: '$1000', status: 'active' },
  { id: '2', name: 'Campaign 2', budget: '$2000', status: 'paused' },
  { id: '3', name: 'Campaign 3', budget: '$3000', status: 'completed' },
];

const AdManagement: React.FC = () => {
  const [campaigns, setCampaigns] = useState(mockCampaigns);

  const handleCreateCampaign = () => {
    console.log('Create new campaign');
    const newCampaign = { id: '4', name: 'Campaign 4', budget: '$4000', status: 'active' };
    setCampaigns([...campaigns, newCampaign]);
  };

  const handleCreatePagePost = async () => {
    const pageId = 'mockPageId'; // Replace with actual page ID
    const postData = { message: 'Hello, world!' }; // Replace with actual post data
    const accessToken = 'mockAccessToken'; // Replace with actual access token
    const response = await createPagePost(pageId, postData, accessToken);
    console.log('Created page post:', response);
    alert('Mock post created successfully!');
  };

  return (
    <div className="ad-management" id="ad-management-page">
      <h1 className="ad-management-title">Gerenciamento de Anúncios</h1>
      <ul className="campaign-list">
        {campaigns.map((campaign) => (
          <li key={campaign.id} className="campaign-item" id={`campaign-item-${campaign.id}`}>
            <span className="campaign-name">{campaign.name}</span> - <span className="campaign-budget">{campaign.budget}</span> - <span className="campaign-status">{campaign.status}</span>
          </li>
        ))}
      </ul>
      <button className="create-campaign-button" onClick={handleCreateCampaign}>Criar Nova Campanha</button>
      <button onClick={handleCreatePagePost}>Create Page Post</button>
    </div>
  );
};

export default AdManagement;