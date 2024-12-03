import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Home.css';
import Sidebar from '../components/Sidebar';
import AccountSidebar from '../components/AccountSidebar';
import CampaignTable from '../components/CampaignTable';
import AccountDetails from '../components/AccountDetails';
import RightSidebar from '../components/RightSidebar';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

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

const predefinedCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Campanha 1',
    platform: 'Meta Ads',
    objective: 'Conversões',
    budget: '$1000',
    status: 'Ativa',
    startDate: '01/01/2023',
    endDate: '31/12/2023',
    impressions: 10000,
    clicks: 500,
    spend: '$800',
    ctr: '5%',
    cpc: 1.6,
    cpm: 80,
    reach: 8000,
    frequency: 1.25,
    adsets: [],
  },
  {
    id: '2',
    name: 'Campanha 2',
    platform: 'Google Ads',
    objective: 'Tráfego',
    budget: '$500',
    status: 'Pausada',
    startDate: '01/02/2023',
    endDate: '30/11/2023',
    impressions: 5000,
    clicks: 200,
    spend: '$300',
    ctr: '4%',
    cpc: 1.5,
    cpm: 60,
    reach: 4000,
    frequency: 1.25,
    adsets: [],
  },
];

const Home: React.FC = () => {
  const [campaigns] = useState<Campaign[]>(predefinedCampaigns);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [googleAccounts, setGoogleAccounts] = useState<any[]>([]);
  const [facebookAccounts, setFacebookAccounts] = useState<any[]>([]);
  const [expandedCampaigns, setExpandedCampaigns] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(localStorage.getItem('selectedAccount'));
  const [selectedAccountDetails, setSelectedAccountDetails] = useState<any | null>(null);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedAccount) {
      console.log(`Selected account changed: ${selectedAccount}`);
      localStorage.setItem('selectedAccount', selectedAccount);
      const account = googleAccounts.find(acc => acc.customer_id === selectedAccount) ||
                      facebookAccounts.find(acc => acc.account_id === selectedAccount);
      setSelectedAccountDetails(account);
      const storedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '{}');
      const accountCampaigns = storedCampaigns[selectedAccount] || [];
      setFilteredCampaigns(accountCampaigns);
      console.log('Filtered campaigns for selected account:', accountCampaigns);
    } else {
      setSelectedAccountDetails(null);
      setFilteredCampaigns(campaigns);
    }
  }, [selectedAccount, googleAccounts, facebookAccounts, campaigns]);

  useEffect(() => {
    const storedGoogleAccounts = JSON.parse(localStorage.getItem('googleAccounts') || '[]');
    const storedFacebookAccounts = JSON.parse(localStorage.getItem('facebookAccounts') || '[]');
    setGoogleAccounts(storedGoogleAccounts);
    setFacebookAccounts(storedFacebookAccounts);
  }, []);

  useEffect(() => {
    console.log('Google Accounts:', googleAccounts);
    console.log('Facebook Accounts:', facebookAccounts);
  }, [googleAccounts, facebookAccounts]);

  const handleEdit = (id: string) => {
    console.log(`handleEdit - Editando campanha ${id}`);
    navigate(`/campaign-details`);
  };

  const handleViewReports = (id: string) => {
    console.log(`handleViewReports - Visualizando relatórios da campanha ${id}`);
    navigate(`/dashboard`);
  };

  const handleCampaignClick = (id: string) => {
    console.log(`handleCampaignClick - Navegando para detalhes da campanha ${id}`);
    navigate(`/campaign-details`);
  };

  const toggleCampaign = (campaignId: string) => {
    console.log(`toggleCampaign - Toggling campaign ${campaignId}`);
    setExpandedCampaigns((prev) =>
      prev.includes(campaignId) ? prev.filter((id) => id !== campaignId) : [...prev, campaignId]
    );
  };


  const startTutorial = () => {
    const driverObj = driver({
      showProgress: true,
      steps: [
        {
          element: '#tutorial-copilot-button',
          popover: {
            title: 'Botão Copilot',
            description: 'Clique aqui para abrir o Copilot, que oferece assistência e sugestões para otimizar suas campanhas.',
            side: 'bottom'
          }
        },
        {
          element: '#tutorial-sidebar',
          popover: {
            title: 'Barra Lateral',
            description: 'Esta é a barra lateral onde você pode navegar entre diferentes paginas do Easy Ads. Aqui você terá acesso a Dashboard, financeiro, configurações, criar publico e criar campanha.',
            side: 'right'
          }
        },
        {
          element: '#tutorial-account-sidebar',
          popover: {
            title: 'Barra Lateral de Contas',
            description: 'Aqui você pode gerenciar suas contas de anúncios vinculadas.',
            side: 'right'
          }
        },
        {
          element: '#tutorial-main-content',
          popover: {
            title: 'Conteúdo Principal',
            description: 'Esta área exibe o conteúdo principal da página, incluindo detalhes das campanhas e inshits.',
            side: 'top'
          }
        },
        {
          element: '#tutorial-campaign-table',
          popover: {
            title: 'Tabela de Campanhas',
            description: 'Aqui você pode ver todas as suas campanhas de anúncios, incluindo métricas e status.',
            side: 'top'
          }
        },
        {
          element: '#tutorial-account-details',
          popover: {
            title: 'Detalhes da Conta',
            description: 'Esta seção mostra os detalhes da conta de anúncios selecionada. Exemplo: "Nome da Conta", "Valor Gasto".',
            side: 'top'
          }
        }
      ]
    });

    driverObj.drive();
  };

  return (
    <div className="home-content">
      <div className="header">
        <div id="tutorial-title" className="title">Campanhas de Tráfego Pago</div>
        <button id="tutorial-start-tutorial-button" className="tutorial-button" onClick={startTutorial}>Start Tutorial</button>
        <button id="tutorial-copilot-button" className="copilot-button" onClick={() => setIsRightSidebarOpen(true)}>Open Copilot</button>
        <button className="privacy-policy-button" onClick={() => navigate('/privacy-policy')}>Política de Privacidade</button>
      </div>

      <div className='side-and-content'>
        <div id="tutorial-sidebar">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>
        <div id="tutorial-account-sidebar">
          <AccountSidebar
            googleAccounts={googleAccounts}
            facebookAccounts={facebookAccounts}
            selectedAccount={selectedAccount}
            setSelectedAccount={(accountId: string) => {
              console.log(`Account selected: ${accountId}`);
              setSelectedAccount(accountId);
            }}
          />
        </div>
        <div id="tutorial-main-content" className="main-content">
          {selectedAccountDetails && <AccountDetails account={selectedAccountDetails} />}
          <CampaignTable
            campaigns={filteredCampaigns}
            expandedCampaigns={expandedCampaigns}
            toggleCampaign={toggleCampaign}
            handleCampaignClick={handleCampaignClick}
            handleEdit={handleEdit}
            handleViewReports={handleViewReports}
          />
        </div>
      </div>

      <RightSidebar isOpen={isRightSidebarOpen} onClose={() => setIsRightSidebarOpen(false)} />
    </div>
  );
};

export default Home;

