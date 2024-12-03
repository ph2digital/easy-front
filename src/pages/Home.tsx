import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './styles/Home.css';
import Sidebar from '../components/Sidebar';
import AccountSidebar from '../components/AccountSidebar';
import CampaignTable from '../components/CampaignTable';
import AccountDetails from '../components/AccountDetails';
import RightSidebar from '../components/RightSidebar';
import { RootState } from '../store';
import checkAdsAccounts, { fetchGoogleAdsAccounts, fetchFacebookAdAccounts, fetchMetaAdsCampaigns, linkMetaAds, linkAccountFromHome, getSessionFromLocalStorage } from '../services/api';
import { setIsCustomerLinked } from '../store/authSlice';
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

const Home: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [googleAccounts, setGoogleAccounts] = useState<any[]>([]);
  const [facebookAccounts, setFacebookAccounts] = useState<any[]>([]);
  const [] = useState<any[]>([]);
  const [expandedCampaigns, setExpandedCampaigns] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loadingGoogleAccounts, setLoadingGoogleAccounts] = useState(true);
  const [loadingFacebookAccounts, setLoadingFacebookAccounts] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(localStorage.getItem('selectedAccount'));
  const [selectedAccountDetails, setSelectedAccountDetails] = useState<any | null>(null);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const fetchCampaignsForAccount = async (account: any) => {
    console.log('fetchCampaignsForAccount - Início', account);
    if (account.type === 'Meta Ads' && accessToken) {
      try {
        console.log('fetchCampaignsForAccount - Fetching campaigns for account:', account);
        const campaignsResponse = await fetchMetaAdsCampaigns(accessToken, account.customer_id || account.account_id);
        console.log('fetchCampaignsForAccount - campaignsResponse:', campaignsResponse);

        const campaignsWithDetails = campaignsResponse.map((campaign: any) => {
          const insights = campaign.insights?.data?.[0] || {};
          return {
            id: campaign.id,
            name: campaign.name,
            platform: 'Meta Ads',
            objective: campaign.objective,
            budget: campaign.budget ? `$${campaign.budget}` : 'N/A',
            status: campaign.status,
            startDate: campaign.start_time ? new Date(campaign.start_time).toLocaleDateString() : 'N/A',
            endDate: campaign.updated_time ? new Date(campaign.updated_time).toLocaleDateString() : 'N/A',
            impressions: insights.impressions || 'N/A',
            clicks: insights.clicks || 'N/A',
            spend: insights.spend || 'N/A',
            ctr: insights.ctr || 'N/A',
            cpc: insights.cpc || 'N/A',
            cpm: insights.cpm || 'N/A',
            reach: insights.reach || 'N/A',
            frequency: insights.frequency || 'N/A',
            accountId: account.customer_id || account.account_id,
          };
        });

        setCampaigns(prevCampaigns => {
          const updatedCampaigns = [...prevCampaigns, ...campaignsWithDetails];
          const storedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '{}');
          storedCampaigns[account.customer_id || account.account_id] = campaignsWithDetails.map((campaign: any) => ({
            ...campaign,
            startDate: campaign.startDate !== 'N/A' ? new Date(campaign.startDate).toLocaleDateString() : 'N/A',
            endDate: campaign.endDate !== 'N/A' ? new Date(campaign.endDate).toLocaleDateString() : 'N/A',
          }));
          localStorage.setItem('campaigns', JSON.stringify(storedCampaigns));
          return updatedCampaigns;
        });
      } catch (error) {
        console.error('fetchCampaignsForAccount - Error fetching campaigns:', error);
      }
    }
  };

  const fetchCampaigns = async () => {
    console.log('fetchCampaigns - Início');
    const allAccounts = [
      ...googleAccounts.map(account => ({ ...account, type: 'Google Ads' })),
      ...facebookAccounts.map(account => ({ ...account, type: 'Meta Ads' }))
    ];
    console.log('fetchCampaigns - allAccounts:', allAccounts);

    if (allAccounts.length > 0) {
      for (const account of allAccounts) {
        await fetchCampaignsForAccount(account);
      }
    }
  };

  const checkActiveCustomers = async () => {
    const session = getSessionFromLocalStorage();
    const userId = session?.user?.id;
    if (accessToken && userId) {
      try {
        console.log('checkActiveCustomers - Checking active customers...');
        const response = await checkAdsAccounts(accessToken, userId);
        console.log('checkActiveCustomers - Active customers:', response);
        localStorage.setItem('activeCustomers', JSON.stringify(response.data.linked_customers));
        return response.data.linked_customers.length > 0;
      } catch (error) {
        console.error('checkActiveCustomers - Error checking active customers:', error);
        return false;
      }
    }
    return false;
  };

  const fetchLinkedAccountsGoogle = async () => {
    const session = getSessionFromLocalStorage();
    const userId = session?.user?.id;
    if (accessToken && userId) {
      try {
        console.log('fetchLinkedAccountsGoogle - Fetching Google Ads accounts...');
        const googleAdsAccounts = await fetchGoogleAdsAccounts(accessToken, userId);
        console.log('fetchLinkedAccountsGoogle - Google Ads accounts fetched:', googleAdsAccounts);
        setGoogleAccounts(googleAdsAccounts.customerIds.map((customerId: string) => ({
          customer_id: customerId,
          type: 'Google Ads',
          is_active: true
        })));
        localStorage.setItem('googleAccounts', JSON.stringify(googleAdsAccounts.customerIds));
      } catch (error) {
        console.error('fetchLinkedAccountsGoogle - Error fetching linked accounts:', error);
      } finally {
        setLoadingGoogleAccounts(false);
      }
    } else {
      console.log('fetchLinkedAccountsGoogle - Missing accessToken or userId');
    }
  };

  const fetchLinkedAccountsMeta = async () => {
    console.log('fetchLinkedAccountsMeta - Fetching Meta Ads accounts...');
    const session = getSessionFromLocalStorage();
    const userId = session?.user?.id;
    console.log('fetchLinkedAccountsMeta - userId:', userId, 'accessToken:', accessToken, 'session:', session);
    if (accessToken && userId) {
      try {
        console.log('fetchLinkedAccountsMeta - Fetching Facebook Ad accounts...');
        const facebookAdAccounts = await fetchFacebookAdAccounts(accessToken, userId);
        console.log('fetchLinkedAccountsMeta - Facebook Ad accounts fetched:', facebookAdAccounts);
        setFacebookAccounts(facebookAdAccounts.adAccounts);
        localStorage.setItem('facebookAccounts', JSON.stringify(facebookAdAccounts.adAccounts));
      } catch (error) {
        console.error('fetchLinkedAccountsMeta - Error fetching linked accounts:', error);
      } finally {
        setLoadingFacebookAccounts(false);
      }
    } else {
      console.log('fetchLinkedAccountsMeta - Missing accessToken or userId');
    }
  };

  useEffect(() => {
    const checkLinkedAccounts = async () => {
      console.log('checkLinkedAccounts - Início');
      const hasActiveCustomers = await checkActiveCustomers();
      console.log('checkLinkedAccounts - hasActiveCustomers:', hasActiveCustomers);

      if (!hasActiveCustomers) {
        setShowPopup(true);
        await fetchLinkedAccountsGoogle();
        await fetchLinkedAccountsMeta();
      } else {
        setShowPopup(false);
        dispatch(setIsCustomerLinked(true));
      }
    };

    if (accessToken && userId) {
      checkLinkedAccounts();
    }
  }, [accessToken, userId, dispatch]);

  useEffect(() => {
    if (googleAccounts.length > 0 || facebookAccounts.length > 0) {
      fetchCampaigns();
    }
  }, [googleAccounts, facebookAccounts]);

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

    // Mocking active customers check to always return true
    dispatch(setIsCustomerLinked(true));
  }, []);

  useEffect(() => {
    console.log('Google Accounts:', googleAccounts);
    console.log('Facebook Accounts:', facebookAccounts);
  }, [googleAccounts, facebookAccounts]);

  const handleFacebookLogin = async () => {
    console.log('handleFacebookLogin - Iniciando login com Facebook...');

    linkMetaAds();

    const checkWindowClosed = setInterval(() => {
      if (window && window.closed) {
        clearInterval(checkWindowClosed);
        console.log('handleFacebookLogin - Janela fechada, recarregando a página...');
        window.location.reload();
      }
    }, 500);
  };

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

  const handleActivateAccount = async (accountId: string, platform: string) => {
    console.log(`handleActivateAccount - Ativando conta ${accountId} na plataforma ${platform}`);
    try {
      // Simulate account activation
      if (platform === 'google_ads') {
        setGoogleAccounts((prevAccounts) =>
          prevAccounts.map((account) =>
            account.customer_id === accountId ? { ...account, is_active: true } : account
          )
        );
      } else if (platform === 'meta_ads') {
        setFacebookAccounts((prevAccounts) =>
          prevAccounts.map((account) =>
            account.account_id === accountId ? { ...account, is_active: true } : account
          )
        );
      }

      // Check active customers after activating an account
      const hasActiveCustomers = true; // Mocked to always have active customers
      console.log('handleActivateAccount - hasActiveCustomers:', hasActiveCustomers);
      if (hasActiveCustomers) {
        setShowPopup(false);
        dispatch(setIsCustomerLinked(true));
      }
    } catch (error) {
      console.error('handleActivateAccount - Error activating account:', error);
    }
  };

  const toggleCampaign = (campaignId: string) => {
    console.log(`toggleCampaign - Toggling campaign ${campaignId}`);
    setExpandedCampaigns((prev) =>
      prev.includes(campaignId) ? prev.filter((id) => id !== campaignId) : [...prev, campaignId]
    );
  };


  const handleLinkAccount = async (platform: string) => {
    try {
      console.log('handleLinkAccount - Início');
      const session = getSessionFromLocalStorage();
      console.log('handleLinkAccount - Session:', session);
      const userId = session?.user?.id;
      console.log('handleLinkAccount - userId:', userId);

      if (!userId) {
        throw new Error('User ID não encontrado na sessão');
      }

      const authUrl = await linkAccountFromHome(platform, userId);
      console.log('handleLinkAccount - authUrl:', authUrl);

      if (accessToken && userId) {
        try {
          console.log('handleFacebookLogin - Fetching Facebook Ad accounts...');
          const facebookAdAccounts = await fetchFacebookAdAccounts(accessToken, userId);
          console.log('handleFacebookLogin - Facebook Ad accounts fetched:', facebookAdAccounts);
          setFacebookAccounts(facebookAdAccounts.adAccounts);
          localStorage.setItem('facebookAccounts', JSON.stringify(facebookAdAccounts.adAccounts));
        } catch (error) {
          console.error('handleFacebookLogin - Error fetching Facebook Ad accounts:', error);
        }
      }
      window.location.href = authUrl;

    } catch (error) {
      console.error('handleLinkAccount - Erro ao vincular conta:', error);
    }
  };

  function formatCurrency(amount_spent: number, currency: string): React.ReactNode {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount_spent / 100); // Assuming amount_spent is in cents
  }

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
      </div>
      {showPopup && (
        <div id="tutorial-popup" className="popup-overlay">
          <div className="popup-content">
            <button className="close-button" onClick={() => setShowPopup(false)}>X</button>
            <h2>Vincule Suas Contas de Anúncios</h2>
            <p>Por favor, vincule suas contas do Facebook Ads para continuar.</p>
            {facebookAccounts.length > 0 && (
              <div>
                <h3>Contas do Facebook Ads</h3>
                <table className="account-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Nome da Empresa</th>
                      <th>Valor Gasto</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facebookAccounts.map((account) => (
                      <tr key={account.account_id}>
                        <td>{account.account_id}</td>
                        <td>{account.accountDetails.name}</td>
                        <td>{account.accountDetails.business_name}</td>
                        <td>{formatCurrency(account.accountDetails.amount_spent, account.accountDetails.currency)}</td>
                        <td>
                          <button onClick={() => handleActivateAccount(account.account_id, 'meta_ads')}>Ativar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="link-buttons">
              {!loadingGoogleAccounts && googleAccounts.length === 0 && (
                <button id="tutorial-link-account-button-google" onClick={() => handleLinkAccount('google_ads')}>Vincular Google Ads</button>
              )}
              {!loadingFacebookAccounts && facebookAccounts.length === 0 && (
                <button id="tutorial-link-account-button-facebook" onClick={() => handleFacebookLogin()}>Vincular Facebook Ads</button>
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

