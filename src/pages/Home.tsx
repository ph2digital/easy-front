import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaChartLine } from 'react-icons/fa';
import './styles/Home.css';
import Sidebar from '../components/Sidebar';
// import Header from '../components/Header';

interface Campaign {
  id: number;
  name: string;
  platform: string;
  objective: string;
  budget: string;
  status: string;
  startDate: string;
  endDate: string;
}

const mockCampaigns: Campaign[] = [
  { id: 1, name: 'Black Friday Sales', platform: 'Google Ads', objective: 'Conversions', budget: '$1,000', status: 'Active', startDate: '01/11/2024', endDate: '30/11/2024' },
  { id: 2, name: 'Holiday Campaign', platform: 'Meta Ads', objective: 'Traffic', budget: '$2,500', status: 'Paused', startDate: '01/12/2024', endDate: '31/12/2024' },
  { id: 3, name: 'New Year Promo', platform: 'TikTok Ads', objective: 'Engagement', budget: '$500', status: 'Scheduled', startDate: '01/01/2025', endDate: '31/01/2025' },
];

const Home: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simula a chamada à API com um mockup
    setTimeout(() => {
      setCampaigns(mockCampaigns);
    }, 1000);
  }, []);

  const handleEdit = (id: number) => {
    console.log(`Editando campanha ${id}`);
  };

  const handleViewReports = (id: number) => {
    console.log(`Visualizando relatórios da campanha ${id}`);
  };

  const handleCampaignClick = (id: number) => {
    navigate(`/configurations/${id}`);
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);



  return (


    <div className="home-content">
<div className='side-and-content'>
    <Sidebar isOpen={isSidebarOpen} toggleSidebar={function (): void {
    setIsSidebarOpen(!isSidebarOpen);
  } } />
<div >      <h2 className="page-title">Campanhas de Tráfego Pago</h2>

      <table className="campaign-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Campanha</th>
            <th>Plataforma</th>
            <th>Objetivo</th>
            <th>Orçamento</th>
            <th>Status</th>
            <th>Período</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.id}>
              <td>{campaign.id}</td>
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
              <td>
                <button className="action-button edit" onClick={() => handleEdit(campaign.id)}>
                  <FaEdit /> Editar
                </button>
                <button className="action-button report" onClick={() => handleViewReports(campaign.id)}>
                  <FaChartLine /> Relatórios
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div></div></div>

  );
};

export default Home;
