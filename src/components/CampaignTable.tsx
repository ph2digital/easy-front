import React from 'react';
import { FaEdit, FaChartLine, FaChevronDown, FaChevronUp } from 'react-icons/fa';
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
  return (
    <table className="campaign-table">
      <thead>
        <tr>
          <th>Campanha</th>
          <th>Plataforma</th>
          <th>Objetivo</th>
          <th>Orçamento</th>
          <th>Status</th>
          <th>Período</th>
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
              <td>{campaign.budget}</td>
              <td>
                <span className={`status ${campaign.status.toLowerCase()}`}>{campaign.status}</span>
              </td>
              <td>{campaign.startDate} - {campaign.endDate}</td>
              <td>{campaign.impressions}</td>
              <td>
                <button className="action-button edit" onClick={() => handleEdit(campaign.id)}>
                  <FaEdit /> Editar
                </button>
                <button className="action-button report" onClick={() => handleViewReports(campaign.id)}>
                  <FaChartLine /> Relatórios
                </button>
                <button onClick={() => toggleCampaign(campaign.id)}>
                  {expandedCampaigns.includes(campaign.id) ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </td>
            </tr>
            {expandedCampaigns.includes(campaign.id) && (
              <tr key={`expanded-${campaign.id}`}>
                <td colSpan={8}>
                  <div className="expanded-content">
                    <p><strong>Gastos:</strong> {campaign.spend}</p>
                    <p><strong>CTR:</strong> {campaign.ctr}</p>
                    <p><strong>CPC:</strong> {campaign.cpc}</p>
                    <p><strong>CPM:</strong> {campaign.cpm}</p>
                    <p><strong>Alcance:</strong> {campaign.reach}</p>
                    <p><strong>Frequência:</strong> {campaign.frequency}</p>
                    {campaign.adsets && campaign.adsets.map((adset) => (
                      <div key={`adset-${adset.id}`}>
                        <p><strong>Adset:</strong> {adset.name}</p>
                        {adset.ads && adset.ads.map((ad) => (
                          <p key={`ad-${ad.id}`}><strong>Ad:</strong> {ad.name}</p>
                        ))}
                      </div>
                    ))}
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
