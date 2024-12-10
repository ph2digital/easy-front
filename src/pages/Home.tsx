import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Home.css';
import Sidebar from '../components/Sidebar';
import AccountSidebar from '../components/account/AccountSidebar';
import CampaignTable from '../components/Campaign/CampaignTable';
import AccountDetails from '../components/account/AccountDetails';
import RightSidebar from '../components/RightSidebar';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { Campaign } from '../types'; // Import Campaign type
import { predefinedCampaigns, getMockGoogleAdsAccounts, getMockFacebookAdAccounts, getMockCampaigns } from '../services/mockData'; // Import mock data

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
  const [showPopup, setShowPopup] = useState(true); // Show popup on load
  const [loadingGoogleAccounts, setLoadingGoogleAccounts] = useState(true);
  const [loadingFacebookAccounts, setLoadingFacebookAccounts] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedAccount) {
      console.log(`Selected account changed: ${selectedAccount}`);
      localStorage.setItem('selectedAccount', selectedAccount);
      const account = googleAccounts.find(acc => acc.customer_id === selectedAccount) ||
                      facebookAccounts.find(acc => acc.customer_id === selectedAccount);
      setSelectedAccountDetails(account);
      const storedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '{}');
      const accountCampaigns = storedCampaigns[selectedAccount] || getMockCampaigns(selectedAccount);
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

  useEffect(() => {
    // Load mock accounts on component mount
    const googleAdsAccounts = getMockGoogleAdsAccounts().customerIds.map(id => ({ customer_id: id.customer_id, type: id.type, is_active: id.is_active }));
    const facebookAdsAccounts = getMockFacebookAdAccounts().customerIds.map(id => ({ customer_id: id.customer_id, type: id.type, is_active: id.is_active }));
    setGoogleAccounts(googleAdsAccounts);
    setFacebookAccounts(facebookAdsAccounts);
    setLoadingGoogleAccounts(false);
    setLoadingFacebookAccounts(false);
  }, []);

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

  const handleActivateAccount = async (accountId: string, platform: string) => {
    console.log(`handleActivateAccount - Ativando conta ${accountId} na plataforma ${platform}`);
    // Simulated activation logic
    alert(`Conta ${accountId} ativada na plataforma ${platform}`);
    setShowPopup(false); // Close the popup
  };

  const handleLinkAccount = async (platform: string) => {
    console.log(`handleLinkAccount - Vinculando conta na plataforma ${platform}`);
    // Simulated linking logic
    alert(`Conta vinculada na plataforma ${platform}`);
  };

  const handleFacebookLogin = async () => {
    console.log('handleFacebookLogin - Iniciando login com Facebook...');
    // Simulated Facebook login logic
    alert('Login com Facebook iniciado');
  };


  return (
    <div className="home-content">
      <div className="header">
        <div id="tutorial-title" className="title">Campanhas de Tráfego Pago</div>
        <button id="tutorial-start-tutorial-button" className="tutorial-button" onClick={startTutorial}>Start Tutorial</button>
        <button id="tutorial-copilot-button" className="copilot-button" onClick={() => setIsRightSidebarOpen(true)}>Open Copilot</button>
        <button className="privacy-policy-button" onClick={() => navigate('/privacy-policy')}>Política de Privacidade</button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-button" onClick={() => setShowPopup(false)}>X</button>
            <h2>Vincule Suas Contas de Anúncios</h2>
            <p>Por favor, vincule suas contas do Google Ads ou Facebook Ads para continuar.</p>
            {googleAccounts.length > 0 && (
              <div>
                <h3>Contas do Google Ads</h3>
                <ul>
                  {googleAccounts.map((account) => (
                    <li key={account.customer_id}>
                      <div>ID do Cliente: {account.customer_id}</div>
                      <div>Tipo: {account.type}</div>
                      <div>Está Ativo: {account.is_active ? 'Sim' : 'Não'}</div>
                      <button onClick={() => handleActivateAccount(account.customer_id, 'google_ads')}>Ativar</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {facebookAccounts.length > 0 && (
              <div>
                <h3>Contas do Facebook Ads</h3>
                <table className="account-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tipo</th>
                      <th>Está Ativo</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facebookAccounts.map((account) => (
                      <tr key={account.customer_id}>
                        <td>{account.customer_id}</td>
                        <td>{account.type}</td>
                        <td>{account.is_active ? 'Sim' : 'Não'}</td>
                        <td>
                          <button onClick={() => handleActivateAccount(account.customer_id, 'meta_ads')}>Ativar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="link-buttons">
              {!loadingGoogleAccounts && googleAccounts.length === 0 && (
                <button onClick={() => handleLinkAccount('google_ads')}>Vincular Google Ads</button>
              )}
              {!loadingFacebookAccounts && facebookAccounts.length === 0 && (
                <button onClick={() => handleFacebookLogin()}>Vincular Facebook Ads</button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className='side-and-content'>
        <div id="tutorial-sidebar">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>
        <div id="tutorial-account-sidebar">
          <AccountSidebar
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

