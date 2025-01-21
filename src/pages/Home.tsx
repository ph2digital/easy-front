import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './styles/Home.css';
import Sidebar from '../components/Sidebar';
import AccountSidebar from '../components/AccountSidebar';
import CampaignTable from '../components/CampaignTable';
import AccountDetails from '../components/AccountDetails';
import RightSidebar from '../components/RightSidebar';
import AccountPopup from '../components/AccountPopup';
import { RootState } from '../store';
import { checkAdsAccounts, fetchGoogleAdsAccounts, fetchMetaAdsCampaigns, linkMetaAds, getSessionFromLocalStorage, listLinkedAccounts, fetchGoogleAdsCampaigns, listAccessibleCustomers, identifyManagerAccount } from '../services/api';
import { setToSessionStorage, getFromSessionStorage } from '../utils/storage';

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
  customer_id: string; // Add this line
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
  const [expandedCampaigns, setExpandedCampaigns] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loadingGoogleAccounts, setLoadingGoogleAccounts] = useState(true);
  const [loadingFacebookAccounts, setLoadingFacebookAccounts] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(localStorage.getItem('selectedAccount'));
  const [selectedAccountDetails, setSelectedAccountDetails] = useState<any | null>(null);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [activeCustomers, setActiveCustomers] = useState<any[]>([]);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessTokenGoogle = useSelector((state: RootState) => state.auth.googleAccessToken);
  const accessTokenMeta = useSelector((state: RootState) => state.auth.metaAccessToken);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  console.log('campaigns:', campaigns);
  console.log('isSidebarOpen:', isSidebarOpen);
  console.log('googleAccounts:', googleAccounts);
  console.log('facebookAccounts:', facebookAccounts);
  console.log('expandedCampaigns:', expandedCampaigns);
  console.log('showPopup:', showPopup);
  console.log('loadingGoogleAccounts:', loadingGoogleAccounts);
  console.log('loadingFacebookAccounts:', loadingFacebookAccounts);
  console.log('selectedAccount:', selectedAccount);
  console.log('selectedAccountDetails:', selectedAccountDetails);
  console.log('filteredCampaigns:', filteredCampaigns);
  console.log('isRightSidebarOpen:', isRightSidebarOpen);
  console.log('activeCustomers:', activeCustomers);
  console.log('accessTokenGoogle:', accessTokenGoogle);
  console.log('accessTokenMeta:', accessTokenMeta);
  console.log('userId:', userId);

  const fetchCampaignsForAccount = async (account: any) => {
    const storedFacebookAccounts = JSON.parse(localStorage.getItem('facebookAccounts') || '[]');
    const accessTokenMeta = storedFacebookAccounts.find((acc: any) => acc.user_id === account.user_id)?.access_token;

    const storedGoogleAccounts = JSON.parse(localStorage.getItem('googleAccounts') || '[]');
    const accessTokenGoogle = storedGoogleAccounts.find((acc: any) => acc.user_id === account.user_id)?.access_token;
    console.log('Fetching campaigns for account:', account, accessTokenMeta);
    if (account.type === 'meta_ads' && accessTokenMeta) {
      try {
        const campaignsResponse = await fetchMetaAdsCampaigns(accessTokenMeta, account.customer_id || account.account_id);
        console.log('Campaigns response:', campaignsResponse);

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
            impressions: insights.impressions || 0,
            clicks: insights.clicks || 0,
            spend: insights.spend || 'N/A',
            ctr: insights.ctr || 'N/A',
            cpc: insights.cpc || 'N/A',
            cpm: insights.cpm || 'N/A',
            reach: insights.reach || 'N/A',
            frequency: insights.frequency || 'N/A',
            device: 'N/A',
            date: 'N/A',
            customer_id: account.customer_id || account.account_id
          } as Campaign;
        });

        setCampaigns(prevCampaigns => {
          const updatedCampaigns = [...prevCampaigns, ...campaignsWithDetails];
          const storedCampaigns: { [key: string]: { [key: string]: Campaign[] } } = JSON.parse(localStorage.getItem('campaigns') || '{}');
          if (!storedCampaigns[account.customer_id || account.account_id]) {
            storedCampaigns[account.customer_id || account.account_id] = {};
          }
          campaignsWithDetails.forEach((campaign: Campaign) => {
            if (!storedCampaigns[account.customer_id || account.account_id][campaign.id]) {
              storedCampaigns[account.customer_id || account.account_id][campaign.id] = [];
            }
            storedCampaigns[account.customer_id || account.account_id][campaign.id].push(campaign);
          });
          setToSessionStorage('campaigns', updatedCampaigns);
          return updatedCampaigns;
        });
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    } else if (account.type === 'google_ads' && accessTokenGoogle) {
      try {
        const campaignsResponse = await fetchGoogleAdsCampaigns(accessTokenGoogle, account.customer_id, 'LAST_7_DAYS', 'TODAY');
        console.log('Campaigns response:', campaignsResponse);
        const storedCampaigns: { [key: string]: { [key: string]: Campaign[] } } = JSON.parse(localStorage.getItem('campaigns') || '{}');

        campaignsResponse.forEach((campaignData: { campaign: any; metrics: any; campaignBudget: any; segments: { device: any; date: any; }; }) => {
          const campaign = campaignData.campaign;
          const metrics = campaignData.metrics || {};
          const campaignBudget = campaignData.campaignBudget || {};
          const resourceName = campaign.resourceName;
          const [customer_id, campaign_id] = resourceName.split('/').filter((_: any, i: number) => i === 1 || i === 3);
      
          // Formata os dados da campanha
          const formattedCampaign: Campaign = {
            id: campaign_id,
            name: campaign.name,
            platform: 'Google Ads',
            objective: campaign.biddingStrategyType || 'N/A',
            budget: ((parseInt(campaignBudget.amountMicros || '0') / 1000000) || 0).toFixed(2),
            status: campaign.status,
            startDate: campaign.startDate || 'N/A',
            endDate: campaign.endDate || 'N/A',
            impressions: metrics.impressions || 0,
            clicks: metrics.clicks || 0,
            spend: ((parseInt(metrics.costMicros || '0') / 1000000) || 0).toFixed(2),
            ctr: metrics.ctr || 'N/A',
            cpc: ((metrics.averageCpc || 0) / 1000000).toFixed(2),
            cpm: 'N/A',
            reach: 'N/A',
            frequency: 'N/A',
            device: campaignData.segments?.device || 'UNKNOWN',
            date: campaignData.segments?.date || 'N/A',
            customer_id: customer_id
          };

          console.log("dados:",resourceName,customer_id, campaign_id,campaign,'Formatted campaign:', formattedCampaign);
      
          // Insere os dados formatados na estrutura
          if (!storedCampaigns[customer_id]) {
            storedCampaigns[customer_id] = {};
          }
          if (!storedCampaigns[customer_id][campaign_id]) {
            storedCampaigns[customer_id][campaign_id] = [];
          }
          storedCampaigns[customer_id][campaign_id].push(formattedCampaign);
        });
      
        // Armazena na session storage
        setToSessionStorage('campaigns', Object.values(storedCampaigns).flat());
        console.log('Campaigns successfully saved to session storage.');
  
              } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    }
  };

  const fetchCampaigns = async () => {
    console.log('Fetching campaigns for selected account', selectedAccount);
  
    if (selectedAccount) {
      const account = activeCustomers.find((acc: any) => acc.customer_id === selectedAccount);
      if (account) {
        await fetchCampaignsForAccount(account);
      }
    }
  };

  const checkActiveCustomers = async () => {
    console.log('Checking active customers');
    const session = getSessionFromLocalStorage();
    const userId = session?.user?.id;
    if (accessTokenGoogle && userId) {
      try {
        const response = await checkAdsAccounts(accessTokenGoogle, userId);
        console.log('Active customers response:', response);
        localStorage.setItem('activeCustomers', JSON.stringify(response.linked_customers));
        return response.linked_customers.length > 0;
      } catch (error) {
        console.error('Error checking active customers:', error);
        return false;
      }
    }
    return false;
  };

  const fetchLinkedAccounts = async () => {
    console.log('Fetching linked accounts');
    const session = getSessionFromLocalStorage();
    const userId = session?.user?.id;
    if (accessTokenGoogle && userId) {
      try {
        const linkedAccounts = await listLinkedAccounts(accessTokenGoogle, userId);
        console.log('Linked accounts:', linkedAccounts);

        const googleAccountsData = linkedAccounts.data
          .filter((account: any) => account.account_type === 'google_ads')
          .map((account: any) => ({
            account_id: account.account_id,
            type: 'Google Ads',
            is_active: account.is_active,
            access_token: account.access_token,
            user_id: account.user_id
          }));

        const facebookAccountsData = linkedAccounts.data
          .filter((account: any) => account.account_type === 'meta_ads')
          .map((account: any) => ({
            account_id: account.account_id,
            type: 'Meta Ads',
            is_active: account.is_active,
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            user_id: account.user_id
          }));

        setGoogleAccounts(googleAccountsData);
        setFacebookAccounts(facebookAccountsData);

        localStorage.setItem('googleAccounts', JSON.stringify(googleAccountsData));
        localStorage.setItem('facebookAccounts', JSON.stringify(facebookAccountsData));
      } catch (error) {
        console.error('Error fetching linked accounts:', error);
      } finally {
        setLoadingGoogleAccounts(false);
        setLoadingFacebookAccounts(false);
      }
    } else {
      console.log('Missing accessToken or userId');
    }
  };

  const fetchAccessibleCustomersAndManagerAccount = async () => {
    const session = getSessionFromLocalStorage();
    const accessToken = session?.google?.access_token;
    const userId = session?.user?.id;
  
    if (accessToken && userId) {
      try {
        console.log('Fetching accessible customers');
        const accessibleCustomers = await listAccessibleCustomers(accessToken);
        console.log('Accessible customers:', accessibleCustomers);
  
        console.log('Identifying manager account');
        const customerGestor = await identifyManagerAccount(accessToken, userId);
        console.log('Manager account:', customerGestor);
  
        // Store the accessible customers and manager account in local storage or state
        localStorage.setItem('accessibleCustomers', JSON.stringify(accessibleCustomers));
        localStorage.setItem('customerGestor', customerGestor);
  
        // Fetch campaigns only after identifying the manager account
        await fetchCampaigns();
      } catch (error) {
        console.error('Error fetching accessible customers and manager account:', error);
      }
    }
  };

  useEffect(() => {
    console.log('Loading active customers from localStorage');
    const storedActiveCustomers = JSON.parse(localStorage.getItem('activeCustomers') || '[]');
    setActiveCustomers(storedActiveCustomers);

    const storedSelectedCustomer = localStorage.getItem('selectedCustomer');
    if (storedSelectedCustomer) {
      setSelectedAccount(storedSelectedCustomer);
    } else if (storedActiveCustomers.length > 0) {
      setSelectedAccount(storedActiveCustomers[0].customer_id);
    } else {
      setShowPopup(true);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data');
      await fetchLinkedAccounts();
      const hasActiveCustomers = await checkActiveCustomers();
      if (hasActiveCustomers) {
        if (selectedAccount) {
          await fetchCampaignsForAccount({ customer_id: selectedAccount });
        }
      }
    };

    fetchData();
  }, [accessTokenGoogle, userId, dispatch, AccountDetails, selectedAccount]);

  useEffect(() => {
    console.log('Fetching Google Ads accounts');
    const session = getSessionFromLocalStorage();
    const userId = session?.user?.id;
    if (accessTokenGoogle && userId) {
      fetchGoogleAdsAccounts(accessTokenGoogle, userId);
    }
  }, [accessTokenGoogle]);

  useEffect(() => {
    console.log('Fetching campaigns for Google and Facebook accounts');
    if (googleAccounts.length > 0 || facebookAccounts.length > 0) {
      fetchCampaigns();
    }
  }, [googleAccounts, facebookAccounts]);

  useEffect(() => {
    const updateSelectedAccountDetails = async () => {
      console.log('Updating selected account details and filtered campaigns');
      if (selectedAccount) {
        localStorage.setItem('selectedAccount', selectedAccount);
        const account = googleAccounts.find(acc => acc.customer_id === selectedAccount) ||
                        facebookAccounts.find(acc => acc.account_id === selectedAccount);
        setSelectedAccountDetails(account);
        const storedCampaigns = getFromSessionStorage('campaigns');
        const accountCampaigns = storedCampaigns.filter((campaign: Campaign) => campaign.customer_id === selectedAccount);
        setFilteredCampaigns(accountCampaigns);
      } else {
        setSelectedAccountDetails(null);
        setFilteredCampaigns([]);
      }
    };

    updateSelectedAccountDetails();
  }, [selectedAccount, googleAccounts, facebookAccounts]);

  useEffect(() => {
    fetchAccessibleCustomersAndManagerAccount();
  }, []);

  const handleFacebookLogin = async () => {
    console.log('Handling Facebook login');
    const session = getSessionFromLocalStorage();
    const userId = session?.user?.id;

    const newWindow = linkMetaAds(userId);

    const checkWindowClosed = setInterval(() => {
      if (newWindow && newWindow.closed) {
        clearInterval(checkWindowClosed);
        window.location.reload();
      }
    }, 500);
  };

  const handleEdit = (id: string) => {
    console.log('Editing campaign:', id);
    navigate(`/campaign-details/${id}?edit=true`);
  };

  const handleViewReports = (id: string) => {
    console.log('Viewing reports for campaign:', id);
  };

  const handleCampaignClick = (id: string) => {
    console.log('Campaign clicked:', id);
    navigate(`/campaign-details/${id}`);
  };

  const toggleCampaign = (campaignId: string) => {
    console.log('Toggling campaign:', campaignId);
    setExpandedCampaigns((prev) =>
      prev.includes(campaignId) ? prev.filter((id) => id !== campaignId) : [...prev, campaignId]
    );
  };


  const handleAccountClick = async (accountId: string) => {
    console.log('Account clicked:', accountId);
    setSelectedAccount(accountId);
    await fetchCampaignsForAccount({ customer_id: accountId });
    // localStorage.setItem('selectedCustomer', accountId);
  };

  return (
    <div className="home-content">
      <div className="header">
        <div className="title">Campanhas de Tráfego Pago</div>
        <button className="chat-button" onClick={() => navigate('/chat')}>Ir pro Chat</button>
        <button className="copilot-button" onClick={() => setIsRightSidebarOpen(true)}>Open Copilot</button>
      </div>
      {showPopup && (
        <AccountPopup
          googleAccounts={googleAccounts}
          facebookAccounts={facebookAccounts}
          handleAccountClick={handleAccountClick}
          handleFacebookLogin={handleFacebookLogin}
          loadingGoogleAccounts={loadingGoogleAccounts}
          loadingFacebookAccounts={loadingFacebookAccounts}
        />
      )}
      <div className='side-and-content'>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <AccountSidebar
          selectedAccount={selectedAccount}
          setSelectedAccount={handleAccountClick}
          activeCustomers={activeCustomers}
        />
        <div className="main-content">
          <CampaignTable
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
