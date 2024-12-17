import React, { useEffect, useState } from 'react';
import { FaEdit, FaChartLine, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './styles/CampaignTable.css';

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
  cpc: string;
  cpm: string;
  reach: string;
  frequency: string;
  device: string;
  date: string;
  adsets?: Adset[];
  customer_id: string;
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
  expandedCampaigns: string[];
  toggleCampaign: (campaignId: string) => void;
  handleCampaignClick: (id: string) => void;
  handleEdit: (id: string) => void;
  handleViewReports: (id: string) => void;
}

const CampaignTable: React.FC<CampaignTableProps> = ({
  expandedCampaigns,
  toggleCampaign,
  handleCampaignClick,
  handleEdit,
  handleViewReports,
}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCampaigns = JSON.parse(sessionStorage.getItem('campaigns') || '{}');
    const campaignsArray: Campaign[] = [];

    Object.keys(storedCampaigns).forEach(customerId => {
      Object.keys(storedCampaigns[customerId]).forEach(campaignId => {
        const campaignData = storedCampaigns[customerId][campaignId];
        if (Array.isArray(campaignData)) {
          campaignsArray.push(...campaignData);
        } else {
          console.error(`Campaign data for ${campaignId} is not an array`);
        }
      });
    });

    setCampaigns(campaignsArray);
  }, []);

  const groupedCampaigns = campaigns.reduce((acc: any, campaign) => {
    if (!acc[campaign.customer_id]) {
      acc[campaign.customer_id] = {};
    }
    if (!acc[campaign.customer_id][campaign.id]) {
      acc[campaign.customer_id][campaign.id] = [];
    }
    acc[campaign.customer_id][campaign.id].push(campaign);
    return acc;
  }, {});

  return (
    <div className="campaign-table">
      {Object.keys(groupedCampaigns).length === 0 ? (
        <div className="no-campaigns">
          <p>Nenhuma campanha encontrada.</p>
          <button onClick={() => navigate('/create-campaign')}>Criar Primeira Campanha</button>
        </div>
      ) : (
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
              <th>Clicks</th>
              <th>Gastos</th>
              <th>CTR</th>
              <th>CPC</th>
              <th>CPM</th>
              <th>Device</th>
              <th>Date</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedCampaigns).map((customerId) => (
              Object.keys(groupedCampaigns[customerId]).map((campaignId) => (
                <React.Fragment key={`campaign-${campaignId}`}>
                  {groupedCampaigns[customerId][campaignId].map((campaign: Campaign, index: number) => (
                    <tr key={`campaign-${campaign.id}-${index}`}>
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
                      <td>{campaign.clicks}</td>
                      <td>{campaign.spend}</td>
                      <td>{campaign.ctr}</td>
                      <td>{campaign.cpc}</td>
                      <td>{campaign.cpm}</td>
                      <td>{campaign.device}</td>
                      <td>{campaign.date}</td>
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
                  ))}
                  {expandedCampaigns.includes(campaignId) && (
                    <tr key={`expanded-${campaignId}`}>
                      <td colSpan={15}>
                        <div className="expanded-content">
                          {groupedCampaigns[customerId][campaignId].map((campaign: Campaign, index: number) => (
                            <div key={`expanded-content-${campaign.id}-${index}`}>
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
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CampaignTable;
