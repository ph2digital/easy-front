import React from 'react';
import AdsetList from '../ads/AdsetList';

interface AnalyticsPanelProps {
  adsetDetails: any[];
  adDetails: any;
  onAdsetClick: (adsetId: string) => void;
  onAdClick: () => void;
  onCreateAd: (adSetId: string) => void;
  onEditAdset: (adset: any) => void;
  onEditAd: (ad: any) => void;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  adsetDetails,
  adDetails,
  onAdsetClick,
  onAdClick,
  onCreateAd,
  onEditAdset,
  onEditAd,
}) => {
  return (
    <div>
      <h3>Conjuntos de Anúncios</h3>
      <AdsetList
        adsets={adsetDetails}
        onAdsetClick={onAdsetClick}
        onAdClick={onAdClick}
        onCreateAd={onCreateAd}
        onEditAdset={onEditAdset}
        onEditAd={onEditAd}
        isEditing={false} // or set this to the appropriate value
      />
      {adDetails && (
        <div className="ad-info">
          <h4>Detalhes do Anúncio</h4>
          <p><strong>ID:</strong> {adDetails.id}</p>
          <p><strong>Nome:</strong> {adDetails.name}</p>
          <p><strong>Status:</strong> {adDetails.status}</p>
          <p><strong>Criado em:</strong> {adDetails.createdTime}</p>
          <p><strong>Atualizado em:</strong> {adDetails.updatedTime}</p>
          {adDetails.insights?.data?.[0] && (
            <>
              <p><strong>Gastos:</strong> {adDetails.insights.data[0].spend}</p>
              <p><strong>Impressões:</strong> {adDetails.insights.data[0].impressions}</p>
              <p><strong>Cliques:</strong> {adDetails.insights.data[0].clicks}</p>
              <p><strong>CTR:</strong> {adDetails.insights.data[0].ctr}</p>
              <p><strong>CPC:</strong> {adDetails.insights.data[0].cpc}</p>
              <p><strong>CPM:</strong> {adDetails.insights.data[0].cpm}</p>
              <p><strong>Ações:</strong> {adDetails.insights.data[0].actions?.map((action: any) => `${action.action_type}: ${action.value}`)?.join(', ')}</p>
            </>
          )}
          <p><strong>Creative:</strong> {JSON.stringify(adDetails.creative)}</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPanel;