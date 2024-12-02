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
import { checkAdsAccounts, fetchGoogleAdsAccounts, fetchFacebookAdAccounts, activateAccount, fetchMetaAdsCampaigns, linkMetaAds, linkAccountFromHome, getSessionFromLocalStorage } from '../services/api';
import { setIsCustomerLinked } from '../store/authSlice';

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
            budget: campaign.daily_budget,
            status: campaign.status,
            startDate: campaign.start_time,
            endDate: campaign.updated_time,
            impressions: insights.impressions || 'N/A',
            clicks: insights.clicks || 'N/A',
            spend: insights.spend || 'N/A',
            ctr: insights.ctr || 'N/A',
            cpc: insights.cpc || 'N/A',
            cpm: insights.cpm || 'N/A',
            reach: insights.reach || 'N/A',
            frequency: insights.frequency || 'N/A',
          };
        });

        setCampaigns(prevCampaigns => {
          const updatedCampaigns = [...prevCampaigns, ...campaignsWithDetails];
          const storedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '{}');
          storedCampaigns[account.customer_id || account.account_id] = campaignsWithDetails;
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
        localStorage.setItem('activeCustomers', JSON.stringify(response.linked_customers));
        return response.linked_customers.length > 0;
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
  }, []);

  useEffect(() => {
    console.log('Google Accounts:', googleAccounts);
    console.log('Facebook Accounts:', facebookAccounts);
  }, [googleAccounts, facebookAccounts]);

  const handleFacebookLogin = async () => {
    console.log('handleFacebookLogin - Iniciando login com Facebook...');
    const session = getSessionFromLocalStorage();
    const userId = session?.user?.id;

    const newWindow = linkMetaAds(userId);

    const checkWindowClosed = setInterval(() => {
      if (newWindow && newWindow.closed) {
        clearInterval(checkWindowClosed);
        console.log('handleFacebookLogin - Janela fechada, recarregando a página...');
        window.location.reload();
      }
    }, 500);
  };

  const handleEdit = (id: string) => {
    console.log(`handleEdit - Editando campanha ${id}`);
    navigate(`/campaign-details/${id}?edit=true`);
  };

  const handleViewReports = (id: string) => {
    console.log(`handleViewReports - Visualizando relatórios da campanha ${id}`);
  };

  const handleCampaignClick = (id: string) => {
    console.log(`handleCampaignClick - Navegando para detalhes da campanha ${id}`);
    navigate(`/campaign-details/${id}`);
  };

  const handleActivateAccount = async (accountId: string, platform: string) => {
    console.log(`handleActivateAccount - Ativando conta ${accountId} na plataforma ${platform}`);
    try {
      const response = await activateAccount(accessToken!, accountId, platform);
      console.log('handleActivateAccount - Account activated:', response);
      
      // Check active customers after activating an account
      const hasActiveCustomers = await checkActiveCustomers();
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

  return (
    <div className="home-content">
      <div className="header">
        <div className="title">Campanhas de Tráfego Pago</div>
        <button className="copilot-button" onClick={() => setIsRightSidebarOpen(true)}>Open Copilot</button>
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
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <AccountSidebar
          googleAccounts={googleAccounts}
          facebookAccounts={facebookAccounts}
          selectedAccount={selectedAccount}
          setSelectedAccount={(accountId: string) => {
            console.log(`Account selected: ${accountId}`);
            setSelectedAccount(accountId);
          }}
        />
        <div className="main-content">
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
