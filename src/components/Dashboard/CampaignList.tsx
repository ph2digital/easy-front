// src/components/Dashboard/CampaignList.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const CampaignList: React.FC = () => {
  return (
    <div className="campaign-list">
      <h2>Minhas Campanhas</h2>
      {/* Renderização das campanhas com detalhes básicos */}
      <Link to="/campaign/new" className="btn btn-primary">
        Nova Campanha
      </Link>
    </div>
  );
};

export default CampaignList;
