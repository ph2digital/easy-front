import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaChartLine, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './styles/Home.css';
import Sidebar from '../components/Sidebar';
import { RootState } from '../store';
import { checkAdsAccounts, fetchGoogleAdsAccounts, fetchFacebookAdAccounts, activateAccount, fetchMetaAdsCampaigns, fetchMetaAdsAdsets, fetchMetaAdsAds, linkMetaAds, linkAccountFromHome, getSessionFromLocalStorage } from '../services/api';
import { setIsCustomerLinked } from '../store/authSlice';
import easyAdsImage from '../assets/easy.jpg'; // Correct image import

interface Campaign {
  id: string;
  name: string;
  platform: string;
  objective: string;
  budget: string;
  status: string;
  startDate: string;
  endDate: string;
  impressions: string;
  clicks: string;
  spend: string;
  ctr: string;
  cpc: string;
  cpm: string;
  reach: string;
  frequency: string;
  adsets?: Adset[];
}

interface Adset {
  id: string;
  name: string;
  status: string;
  dailyBudget: string;
  startDate: string;
  endDate: string;
  ads?: Ad[];
}

interface Ad {
  id: string;
  name: string;
  status: string;
  createdTime: string;
  updatedTime: string;
}

const formatCurrency = (amount: string, currency: string) => {
  const number = parseFloat(amount) / 100; // Assuming the amount is in cents
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(number);
};

const Home: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [googleAccounts, setGoogleAccounts] = useState<any[]>([]);
  const [facebookAccounts, setFacebookAccounts] = useState<any[]>([]);
  const [activeCustomers, setActiveCustomers] = useState<any[]>([]);
  const [expandedCampaigns, setExpandedCampaigns] = useState<string[]>([]);
  const [expandedAdsets, setExpandedAdsets] = useState<string[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const isCustomerLinked = useSelector((state: RootState) => state.auth.isCustomerLinked);
  const [showPopup, setShowPopup] = useState(false);
  const [loadingGoogleAccounts, setLoadingGoogleAccounts] = useState(true);
  const [loadingFacebookAccounts, setLoadingFacebookAccounts] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      console.log('fetchCampaigns - Início');
      const storedActiveCustomers = JSON.parse(localStorage.getItem('activeCustomers') || '[]');
      console.log('fetchCampaigns - storedActiveCustomers:', storedActiveCustomers);
      setActiveCustomers(storedActiveCustomers);

      if (storedActiveCustomers.length > 0) {
        const campaignsData: Campaign[] = [];
        for (const customer of storedActiveCustomers) {
          if (customer.type === 'meta_ads') {
            if (accessToken) {
              try {
                console.log('fetchCampaigns - Fetching campaigns for customer:', customer);
                const campaignsResponse = await fetchMetaAdsCampaigns(accessToken, customer.customer_id);
                console.log('fetchCampaigns - campaignsResponse:', campaignsResponse);

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

                campaignsData.push(...campaignsWithDetails);
              } catch (error) {
                console.error('fetchCampaigns - Error fetching campaigns:', error);
              }
            }
          }
        }
        setCampaigns(campaignsData);
      }
    };

    fetchCampaigns();
  }, [accessToken, isCustomerLinked]);

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

    checkLinkedAccounts();
  }, [accessToken, userId, dispatch]);

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

  const toggleAdset = async (adsetId: string, campaignId: string) => {
    console.log(`toggleAdset - Toggling adset ${adsetId} for campaign ${campaignId}`);
    if (!expandedAdsets.includes(adsetId)) {
      try {
        const adsetsResponse = await fetchMetaAdsAdsets(accessToken!, campaignId);
        const adsResponse = await fetchMetaAdsAds(accessToken!, campaignId);
        console.log('toggleAdset - adsetsResponse:', adsetsResponse);
        console.log('toggleAdset - adsResponse:', adsResponse);

        const adsetsWithDetails = adsetsResponse.filter((adset: any) => adset.campaign_id === campaignId).map((adset: any) => ({
          id: adset.id,
          name: adset.name,
          status: adset.status,
          dailyBudget: adset.daily_budget,
          startDate: adset.created_time,
          endDate: adset.updated_time,
          ads: adsResponse.filter((ad: any) => ad.adset_id === adset.id).map((ad: any) => ({
            id: ad.id,
            name: ad.name,
            status: ad.status,
            createdTime: ad.created_time,
            updatedTime: ad.updated_time,
          })),
        }));

        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.id === campaignId
              ? { ...campaign, adsets: adsetsWithDetails }
              : campaign
          )
        );
      } catch (error) {
        console.error('toggleAdset - Error fetching adsets:', error);
      }
    }

    setExpandedAdsets((prev) =>
      prev.includes(adsetId) ? prev.filter((id) => id !== adsetId) : [...prev, adsetId]
    );
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  return (
    <div className="home-content">
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
        <div>
          <h2 className="page-title">Campanhas de Tráfego Pago</h2>
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
                <React.Fragment key={campaign.id}>
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
                    <tr>
                      <td colSpan={8}>
                        <div className="expanded-content">
                          <p><strong>Gastos:</strong> {campaign.spend}</p>
                          <p><strong>CTR:</strong> {campaign.ctr}</p>
                          <p><strong>CPC:</strong> {campaign.cpc}</p>
                          <p><strong>CPM:</strong> {campaign.cpm}</p>
                          <p><strong>Alcance:</strong> {campaign.reach}</p>
                          <p><strong>Frequência:</strong> {campaign.frequency}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;

