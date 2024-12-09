import React, { useState } from 'react';
import './styles/IntegrationSummary.css';
import { fetchPageComments } from '../services/api'; // Import fetchPageComments
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const mockIntegrations = [
  { id: '1', name: 'Google Ads', status: 'active' },
  { id: '2', name: 'Facebook Ads', status: 'inactive' },
  { id: '3', name: 'Instagram Ads', status: 'active' },
];

const mockPostCreation = () => {
  console.log('Mock post created');
  alert('Post created successfully!');
};

const IntegrationSummary: React.FC = () => {
  const [integrations] = useState(mockIntegrations);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleUpdateToken = (id: string) => {
    console.log('Update token for integration:', id);
  };

  const handleConnectNewAccount = () => {
    console.log('Connect new account');
  };

  const handleFetchPageComments = async () => {
    const pageId = 'mockPageId'; // Replace with actual page ID
    const accessToken = 'mockAccessToken'; // Replace with actual access token
    const comments = await fetchPageComments(pageId, accessToken);
    console.log('Fetched page comments:', comments);
    alert(`Fetched comments: ${comments.map((comment: any) => comment.message).join(', ')}`);
  };

  return (
    <div className="integration-summary" id="integration-summary-page">
      <h1 className="integration-summary-title">Resumo de Integrações</h1>
      <ul className="integration-list">
        {integrations.map((integration) => (
          <li key={integration.id} className="integration-item" id={`integration-item-${integration.id}`}>
            <span className="integration-name">{integration.name}</span> - <span className="integration-status">{integration.status}</span>
            <button className="update-token-button" onClick={() => handleUpdateToken(integration.id)}>Atualizar Token</button>
          </li>
        ))}
      </ul>
      <button className="connect-new-account-button" onClick={handleConnectNewAccount}>Conectar Nova Conta</button>
      <button onClick={handleFetchPageComments}>Fetch Page Comments</button>
      <button onClick={() => navigate('/create-post')}>Create New Post</button> {/* Add button to navigate */}
      <button className="create-post-button" onClick={mockPostCreation}>Create New Post</button> {/* Mock post creation */}
    </div>
  );
};

export default IntegrationSummary;