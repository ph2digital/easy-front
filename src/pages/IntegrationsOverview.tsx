import React from 'react';
import IntegrationCard from '../components/integrations/IntegrationCard';
import IntegrationStatus from '../components/integrations/IntegrationStatus';
import { Settings } from 'lucide-react';
import { fetchUserPages } from '../services/api'; // Import fetchUserPages
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const mockIntegrations = [
  {
    name: 'Facebook Business',
    status: 'active' as const,
    lastUpdated: '15/03/2024 10:30',
    tokenExpiry: '14/04/2024',
  },
  {
    name: 'Instagram Professional',
    status: 'active' as const,
    lastUpdated: '15/03/2024 10:30',
    tokenExpiry: '14/04/2024',
  },
  {
    name: 'WhatsApp Business',
    status: 'inactive' as const,
    lastUpdated: '10/03/2024 15:45',
    tokenExpiry: 'Expirado',
  },
];


const IntegrationsOverview: React.FC = () => {
  const handleRefreshToken = () => {
    console.log('Refreshing token...');
  };

  const handleFetchUserPages = async () => {
    const accessToken = 'mockAccessToken'; // Replace with actual access token
    const pages = await fetchUserPages(accessToken);
    console.log('Fetched user pages:', pages);
    alert(`Fetched user pages: ${pages.map((page: any) => page.name).join(', ')}`);
  };

  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Integrações</h1>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Adicionar Nova Integração
        </button>
      </div>

      <div className="grid gap-4">
        {mockIntegrations.map((integration) => (
          <IntegrationCard
            key={integration.name}
            {...integration}
            onRefresh={handleRefreshToken}
          />
        ))}
      </div>

      <IntegrationStatus onFetchUserPages={handleFetchUserPages} onCreatePost={() => navigate('/create-post')} />
    </div>
  );
};

export default IntegrationsOverview;