import React from 'react';
import { FaEdit, FaChartLine } from 'react-icons/fa';
interface Campaign {
    id: string;
    name: string;
    platform: string;
    objective: string;
    budget: string;
    status: string;
    startDate: string;
    endDate: string;
    impressions: number;
    clicks: number;
    spend: string;
    ctr: string;
    cpc: number;
    cpm: number;
    reach: number;
    frequency: number;
    adsets?: Adset[];
  }
  
  interface Adset {
    id: string;
    name: string;
    status: string;
    dailyBudget: string;
    startDate: string;
    endDate: string;
    ads: Ad[];
  }
  
  interface Ad {
    id: string;
    name: string;
    status: string;
    createdTime: string;
    updatedTime: string;
  }
  

interface CampaignTableProps {
  campaigns: Campaign[];
  expandedCampaigns: string[];
  toggleCampaign: (campaignId: string) => void;
  handleCampaignClick: (id: string) => void;
  handleEdit: (id: string) => void;
  handleViewReports: (id: string) => void;
}

const CampaignTable: React.FC<CampaignTableProps> = ({
  campaigns,
  expandedCampaigns,
  toggleCampaign,
  handleCampaignClick,
  handleEdit,
  handleViewReports,
}) => {
  function handleTurboBoost(id: string): void {
    console.log(`Turbo boost activated for campaign with id: ${id}`);
    // Implement the logic to turbo boost the campaign
    // This could involve making an API call to update the campaign's status or budget
    // For example:
    // api.updateCampaign(id, { turboBoost: true })
    //   .then(response => {
    //     console.log('Campaign turbo boosted successfully', response);
    //   })
    //   .catch(error => {
    //     console.error('Error turbo boosting campaign', error);
    //   });

    // Add sparkle effect
    const button = document.getElementById(`turbo-button-${id}`);
    if (button) {
      button.classList.add('sparkle');
      setTimeout(() => {
        button.classList.remove('sparkle');
      }, 1000);
    }
  }

  return (
    <table className="campaign-table">
      <thead>
        <tr>
          <th>Campanha</th>
          <th>Plataforma</th>
          <th>Objetivo</th>
          <th>Orçamento</th>
          <th>Status</th>
          <th>Impressões</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {campaigns.map((campaign) => (
          <React.Fragment key={`campaign-${campaign.id}`}>
            <tr>
              <td onClick={() => handleCampaignClick(campaign.id)} className="campaign-name">
                {campaign.name}
              </td>
              <td>{campaign.platform}</td>
              <td>{campaign.objective}</td>
              <td>{campaign.budget || 'N/A'}</td>
              <td>
                <span className={`status ${campaign.status.toLowerCase()}`}>{campaign.status}</span>
              </td>
              <td>{campaign.impressions}</td>
              <td>
                <button className="action-button edit" onClick={() => handleEdit(campaign.id)}>
                  <FaEdit /> Editar
                </button>
                <button className="action-button report" onClick={() => handleViewReports(campaign.id)}>
                  <FaChartLine /> Relatórios
                </button>
              <button onClick={() => toggleCampaign(campaign.id)}>
{expandedCampaigns.includes(campaign.id) ? (
  <>
    <i className="ai-icon" /> IA Insights
  </>
) : (
<>
<i className="ai-icon" /> IA Insights
</>)}
              </button>
              </td>
            </tr>
            {expandedCampaigns.includes(campaign.id) && (
              <tr key={`expanded-${campaign.id}`}>
                <td colSpan={8}>
                  <div className="expanded-content">
                  <div className="ai-insights">
                  <p><strong>Insights da IA:</strong></p>
                  <p>{`A campanha "${campaign.name}" teve um CTR de ${campaign.ctr}, o que é ${campaign.ctr > '2%' ? 'excelente' : 'abaixo da média'}. Considere ajustar o público-alvo para melhorar o desempenho.`}</p>
                  <p>{`O CPC está em ${campaign.cpc}, ${campaign.cpc < 1 ? 'o que é ótimo' : 'o que pode ser otimizado'}. Tente ajustar os lances para reduzir o custo.`}</p>
                  <p>{`O CPM de ${campaign.cpm} indica que ${campaign.cpm < 10 ? 'você está alcançando muitas pessoas a um custo baixo' : 'o custo por mil impressões está alto'}. Considere revisar a segmentação.`}</p>
                    <button
                      id={`turbo-button-${campaign.id}`}
                      className="action-button turbo large-gold"
                      onClick={() => handleTurboBoost(campaign.id)}
                    >
                      <i className="turbo-icon" /> Turbinar
                    </button>
                  </div>

                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default CampaignTable;
