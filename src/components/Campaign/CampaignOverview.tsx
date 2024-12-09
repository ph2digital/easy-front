import React from 'react';
import CampaignInfo from './CampaignInfo';

interface CampaignOverviewProps {
  campaign: any;
  onEditCampaign: () => void;
}

const CampaignOverview: React.FC<CampaignOverviewProps> = ({ campaign, onEditCampaign }) => {
  return (
    <div>
      <h2>Detalhes da Campanha</h2>
      <CampaignInfo
        campaign={campaign}
        isEditing={false}
        onEdit={onEditCampaign}
        onSave={() => {}}
        onEditAdset={() => {}}
      />
    </div>
  );
};

export default CampaignOverview;