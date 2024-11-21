import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaChartLine, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './styles/Home.css';
import Sidebar from '../components/Sidebar';
import { RootState } from '../store';
import { checkAdsAccounts, fetchGoogleAdsAccounts, fetchFacebookAdAccounts, activateAccount, fetchMetaAdsCampaigns, fetchMetaAdsAdsets, fetchMetaAdsAds } from '../services/authService';
import { setIsCustomerLinked } from '../store/authSlice';
import { signInWithGoogle, linkMetaAds } from '../services/authService';
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
  const accessToken: string | null = useSelector((state: RootState) => state.auth.accessToken);
  const userId: string | undefined = useSelector((state: RootState) => state.auth.user?.id);
  const isCustomerLinked = useSelector((state: RootState) => state.auth.isCustomerLinked);
  const [showPopup, setShowPopup] = useState(false);
  const [loadingGoogleAccounts, setLoadingGoogleAccounts] = useState(true);
  const [loadingFacebookAccounts, setLoadingFacebookAccounts] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const storedActiveCustomers = JSON.parse(localStorage.getItem('activeCustomers') || '[]');
      setActiveCustomers(storedActiveCustomers);

      if (storedActiveCustomers.length > 0) {
        const campaignsData: Campaign[] = [];
        for (const customer of storedActiveCustomers) {
          if (customer.type === 'meta_ads') {
            if (accessToken) {
              try {
                const campaignsResponse = await fetchMetaAdsCampaigns(accessToken, customer.customer_id);

                const campaignsWithDetails = campaignsResponse.map((campaign: any) => ({
                  id: campaign.id,
                  name: campaign.name,
                  platform: 'Meta Ads',
                  objective: campaign.objective,
                  budget: 'N/A',
                  status: campaign.status,
                  startDate: campaign.created_time,
                  endDate: campaign.updated_time,
                }));

                campaignsData.push(...campaignsWithDetails);
              } catch (error) {
                console.error('Error fetching campaigns:', error);
              }
            }
          }
        }
        setCampaigns(campaignsData);
      }
    };

    fetchCampaigns();
  }, [accessToken, isCustomerLinked]);

  const handleFacebookLogin = () => {
    console.log('Iniciando login com Facebook...');
    linkMetaAds(false);
  };

  const checkActiveCustomers = async () => {
    if (accessToken && userId) {
      try {
        console.log('Checking active customers...');
        const response = await checkAdsAccounts(accessToken, userId);
        console.log('Active customers:', response);
        localStorage.setItem('activeCustomers', JSON.stringify(response.linked_customers));
        return response.linked_customers.length > 0;
      } catch (error) {
        console.error('Error checking active customers:', error);
        return false;
      }
    }
    return false;
  };

  const fetchLinkedAccountsGoogle = async () => {
    if (accessToken && userId) {
      try {
        console.log('Fetching Google Ads accounts...');
        const googleAdsAccounts = await fetchGoogleAdsAccounts(accessToken, userId);
        console.log('Google Ads accounts fetched:', googleAdsAccounts);
        setGoogleAccounts(googleAdsAccounts.customerIds.map((customerId: string) => ({
          customer_id: customerId,
          type: 'Google Ads',
          is_active: true
        })));
        localStorage.setItem('googleAccounts', JSON.stringify(googleAdsAccounts.customerIds));
      } catch (error) {
        console.error('Error fetching linked accounts:', error);
      } finally {
        setLoadingGoogleAccounts(false);
      }
    }
  };

  const fetchLinkedAccountsMeta = async () => {
    if (accessToken && userId) {
      try {
        console.log('Fetching Facebook Ad accounts...');
        const facebookAdAccounts = await fetchFacebookAdAccounts(accessToken, userId);
        console.log('Facebook Ad accounts fetched:', facebookAdAccounts);
        setFacebookAccounts(facebookAdAccounts.adAccounts);
        localStorage.setItem('facebookAccounts', JSON.stringify(facebookAdAccounts.adAccounts));
      } catch (error) {
        console.error('Error fetching linked accounts:', error);
      } finally {
        setLoadingFacebookAccounts(false);
      }
    }
  };

  useEffect(() => {
    const checkLinkedAccounts = async () => {
      const hasActiveCustomers = await checkActiveCustomers();

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
    console.log(`Editando campanha ${id}`);
  };

  const handleViewReports = (id: string) => {
    console.log(`Visualizando relatórios da campanha ${id}`);
  };

  const handleCampaignClick = (id: string) => {
    navigate(`/campaign-details/${id}`);
  };

  const handleActivateAccount = async (accountId: string, platform: string) => {
    console.log(`Ativando conta ${accountId} na plataforma ${platform}`);
    try {
      const response = await activateAccount(accessToken!, accountId, platform);
      console.log('Account activated:', response);
      
      // Check active customers after activating an account
      const hasActiveCustomers = await checkActiveCustomers();
      if (hasActiveCustomers) {
        setShowPopup(false);
        dispatch(setIsCustomerLinked(true));
      }
    } catch (error) {
      console.error('Error activating account:', error);
    }
  };

  const toggleCampaign = (campaignId: string) => {
    setExpandedCampaigns((prev) =>
      prev.includes(campaignId) ? prev.filter((id) => id !== campaignId) : [...prev, campaignId]
    );
  };

  const toggleAdset = async (adsetId: string, campaignId: string) => {
    if (!expandedAdsets.includes(adsetId)) {
      try {
        const adsetsResponse = await fetchMetaAdsAdsets(accessToken!, campaignId);
        const adsResponse = await fetchMetaAdsAds(accessToken!, campaignId);

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
        console.error('Error fetching adsets:', error);
      }
    }

    setExpandedAdsets((prev) =>
      prev.includes(adsetId) ? prev.filter((id) => id !== adsetId) : [...prev, adsetId]
    );
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                <button onClick={signInWithGoogle}>Vincular Google Ads</button>
              )}
              {!loadingFacebookAccounts && facebookAccounts.length === 0 && (
                <button onClick={handleFacebookLogin}>Vincular Facebook Ads</button>
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
                <th>ID</th>
                <th>Campanha</th>
                <th>Plataforma</th>
                <th>Objetivo</th>
                <th>Orçamento</th>
                <th>Status</th>
                <th>Período</th>
                <th>Ações</th>
                <th>Expandir</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <React.Fragment key={campaign.id}>
                  <tr>
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
                    <td>
                      <button onClick={() => toggleCampaign(campaign.id)}>
                        {expandedCampaigns.includes(campaign.id) ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </td>
                  </tr>
                  {expandedCampaigns.includes(campaign.id) && campaign.adsets && campaign.adsets.map((adset) => (
                    <React.Fragment key={adset.id}>
                      <tr className="adset-row">
                        <td colSpan={9}>
                          <div className="adset-details">
                            <div className="adset-header" onClick={() => toggleAdset(adset.id, campaign.id)}>
                              <span>{adset.name}</span>
                              <span>{adset.status}</span>
                              <span>{adset.dailyBudget}</span>
                              <span>{adset.startDate} - {adset.endDate}</span>
                              <button>
                                {expandedAdsets.includes(adset.id) ? <FaChevronUp /> : <FaChevronDown />}
                              </button>
                            </div>
                            {expandedAdsets.includes(adset.id) && adset.ads && (
                              <div className="ads-details">
                                <table>
                                  <thead>
                                    <tr>
                                      <th>ID</th>
                                      <th>Nome</th>
                                      <th>Status</th>
                                      <th>Criado em</th>
                                      <th>Atualizado em</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {adset.ads.map((ad) => (
                                      <tr key={ad.id}>
                                        <td>{ad.id}</td>
                                        <td>{ad.name}</td>
                                        <td>{ad.status}</td>
                                        <td>{ad.createdTime}</td>
                                        <td>{ad.updatedTime}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
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
