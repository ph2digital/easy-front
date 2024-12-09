import React, { useState } from 'react';
import { FaEdit, FaChartLine } from 'react-icons/fa';
import { Campaign } from '../../types'; // Import types from index.ts

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
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState<string>('');

  const handleSort = (field: string) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.name.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedCampaigns = filteredCampaigns.sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField as keyof Campaign];
    const bValue = b[sortField as keyof Campaign];
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

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
    <div>
      <input
        type="text"
        placeholder="Filtrar campanhas"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="filter-input"
      />
      <table className="campaign-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Campanha</th>
            <th onClick={() => handleSort('platform')}>Plataforma</th>
            <th onClick={() => handleSort('objective')}>Objetivo</th>
            <th onClick={() => handleSort('budget')}>Orçamento</th>
            <th onClick={() => handleSort('status')}>Status</th>
            <th onClick={() => handleSort('impressions')}>Impressões</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {sortedCampaigns.map((campaign) => (
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
                      </>
                    )}
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
    </div>
  );
};

export default CampaignTable;
