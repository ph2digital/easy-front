import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaChartLine } from 'react-icons/fa';
import './styles/Home.css';
import Sidebar from '../components/Sidebar';
import { RootState } from '../store';
import { checkAdsAccounts, checkFacebookAdAccounts, fetchGoogleAdsAccounts, fetchFacebookAdAccounts, activateAccount } from '../services/authService';
import { setIsCustomerLinked } from '../store/authSlice';
import './styles/Login.css';
import { setUser, setTokens } from '../store/authSlice';
import { signInWithGoogle, linkMetaAds } from '../services/authService'; // Ensure this path is correct
import easyAdsImage from '../assets/easy.jpg'; // Correct image import

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

const formatCurrency = (amount: string, currency: string) => {
  const number = parseFloat(amount) / 100; // Assuming the amount is in cents
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(number);
};

const Home: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [googleAccounts, setGoogleAccounts] = useState<any[]>([]);
  interface FacebookAccount {
    id: string;
    name: string;
  }
  
  const [facebookAccounts, setFacebookAccounts] = useState<any[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const isCustomerLinked = useSelector((state: RootState) => state.auth.isCustomerLinked);
  const [showPopup, setShowPopup] = useState(false);
  const [loadingGoogleAccounts, setLoadingGoogleAccounts] = useState(true);
  const [loadingFacebookAccounts, setLoadingFacebookAccounts] = useState(true);

  useEffect(() => {
    // Simula a chamada à API com um mockup
    setTimeout(() => {
      setCampaigns(mockCampaigns);
    }, 1000);
  }, []);

  const handleFacebookLogin = () => {
    console.log('Iniciando login com Facebook...');
    linkMetaAds(false);
  };
  
  const checkActiveCustomers = async () => {
    if (accessToken && userId) {
      try {
        console.log('Checking active customers...');
        const response = await checkAdsAccounts(accessToken,userId);
        console.log('Active customers:', response);
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

  const fetchLinkedAccountsMeta= async () => {
    if (accessToken&&userId) {
      try {
        console.log('Fetching Facebook Ad accounts...');
        const facebookAdAccounts = await fetchFacebookAdAccounts(accessToken,userId);
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

  const handleEdit = (id: number) => {
    console.log(`Editando campanha ${id}`);
  };

  const handleViewReports = (id: number) => {
    console.log(`Visualizando relatórios da campanha ${id}`);
  };

  const handleCampaignClick = (id: number) => {
    navigate(`/configurations/${id}`);
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
        </div>
      </div>
    </div>
  );
};

export default Home;
