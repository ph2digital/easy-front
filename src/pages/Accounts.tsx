// src/components/Accounts.tsx

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { selectAccessToken, logout } from '../store/authSlice';
import { updateAccount } from '../store/accountSlice'; // Ensure this path is correct
import { RootState, AppDispatch } from '../store';
import { addCustomer, removeCustomer, setCustomers } from '../store/selectedCustomersSlice';
import { setUser, setTokens } from '../store/authSlice';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

interface Account {
  customerId: string;
  descriptiveName: string;
  currencyCode: string;
  timeZone: string;
  campaigns?: Campaign[];
}

interface Campaign {
  id: string;
  name: string;
  status: string;
  servingStatus: string;
  startDate: string;
  endDate: string;
}

const Accounts: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [adGroups, setAdGroups] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [accountName, setAccountName] = useState('');
  const [platform, setPlatform] = useState('');
  const selectedCustomers = useSelector((state: RootState) => (state.selectedCustomers as any).selectedCustomers);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);

  const fetchGoogleAdsAccounts = async () => {
    if (!accessToken) {
      console.error('AccessToken não encontrado');
      return;
    }

    setLoading(true);
    try {
      console.log('Iniciando requisição para buscar contas do Google Ads');
      console.log('AccessToken atual:', accessToken);

      const response = await fetch('http://localhost:8080/api/accounts/google-ads/accounts', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Erro ao buscar contas: ${response.status} - ${response.statusText}`);
        throw new Error(`Erro ao buscar contas: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Contas obtidas do Google Ads:', data);

      const accountsData = data.customerIds.map((customerId: string) => ({
        customerId,
        descriptiveName: `Conta ${customerId}`,
        currencyCode: 'BRL',
        timeZone: 'America/Sao_Paulo',
      }));

      setAccounts(accountsData);
    } catch (error) {
      console.error('Erro ao buscar contas do Google Ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGoogleAdsData = async (endpoint: string, setData: React.Dispatch<React.SetStateAction<any[]>>) => {
    if (!accessToken) {
      console.error('AccessToken não encontrado');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/google-ads/${endpoint}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Erro ao buscar ${endpoint}: ${response.status} - ${response.statusText}`);
        throw new Error(`Erro ao buscar ${endpoint}: ${response.statusText}`);
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(`Erro ao buscar ${endpoint}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetaAdsData = async (endpoint: string, setData: React.Dispatch<React.SetStateAction<any[]>>) => {
    if (!accessToken) {
      console.error('AccessToken não encontrado');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/meta-ads/${endpoint}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Erro ao buscar ${endpoint}: ${response.status} - ${response.statusText}`);
        throw new Error(`Erro ao buscar ${endpoint}: ${response.statusText}`);
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(`Erro ao buscar ${endpoint}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const linkMetaAds = () => {
    const clientId = process.env.REACT_APP_FACEBOOK_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_FACEBOOK_REDIRECT_URI;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user.id;
  
    if (!clientId || !redirectUri || !id) {
      console.error('Facebook OAuth environment variables are not set: ',clientId, redirectUri, id);
      return;
    }
  
    const metaOAuthURL = `https://www.facebook.com/v10.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}?id=${id}&response_type=code&scope=ads_management`;
    const newWindow = window.open(metaOAuthURL, 'metaOAuth', 'width=600,height=400');
  
    const checkWindowClosed = setInterval(() => {
      if (newWindow?.closed) {
        clearInterval(checkWindowClosed);
        fetchFacebookOAuthStatus();
      }
    }, 1000);
  
    const checkFacebookOAuthStatusInterval = setInterval(() => {
      fetchFacebookOAuthStatus();
    }, 60000); // Check every 1 minute
  
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;
  
      const { accessToken, user } = event.data;
      if (accessToken && user) {
        console.log('Facebook OAuth successful:', event.data);
        // Save the response data in the frontend
        dispatch(setTokens({ accessToken, refreshToken: '' }));
        dispatch(setUser({ user, profileImage: user.picture.data.url }));
        localStorage.setItem('user', JSON.stringify(user));
        setSession(accessToken, '');
        clearInterval(checkFacebookOAuthStatusInterval);
        if (newWindow) {
          newWindow.close();
        }
      }
    });
  };
  
  const fetchFacebookOAuthStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/facebook-oauth-status`);
      if (response.data.accessToken) {
        console.log('Facebook OAuth successful:', response.data);
        // Save the response data in the frontend
        dispatch(setTokens({ accessToken: response.data.accessToken, refreshToken: '' }));
        dispatch(setUser({ user: response.data.user, profileImage: response.data.user.picture.data.url }));
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setSession(response.data.accessToken, '');
      } else {
        console.error('Facebook OAuth failed or not completed');
      }
    } catch (error) {
      console.error('Error fetching Facebook OAuth status:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateAccount({ accountName, platform }));
  };

  const handleCustomerSelection = (customerId: string) => {
    if (selectedCustomers.includes(customerId)) {
        dispatch(removeCustomer(customerId));
    } else {
        dispatch(addCustomer(customerId));
    }
  };

  const fetchGoogleAdsDataForSelectedCustomers = async (endpoint: string, setData: React.Dispatch<React.SetStateAction<any[]>>) => {
    if (!accessToken) {
        console.error('AccessToken não encontrado');
        return;
    }

    setLoading(true);
    try {
        const data: any[] = await Promise.all(selectedCustomers.map(async (customerId: string): Promise<any[]> => {
            const response: Response = await fetch(`http://localhost:8080/api/google-ads/accounts/${customerId}/${endpoint}`, {
          method: 'GET',
          headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
          },
            });

            if (!response.ok) {
          console.error(`Erro ao buscar ${endpoint} para a conta ${customerId}: ${response.status} - ${response.statusText}`);
          return [];
            }

            return await response.json();
        }));

        setData(data.flat());
    } catch (error) {
        console.error(`Erro ao buscar ${endpoint}:`, error);
    } finally {
        setLoading(false);
    }
  };

  const handleFetchUserEmail = () => {
    const email = getUserEmailFromSession();
    if (email) {
      alert(`User email: ${email}`);
    } else {
      alert('No user email found');
    }
  };

  useEffect(() => {
    console.log('AccessToken verificado no useEffect:', accessToken);
    if (accessToken) {
      fetchGoogleAdsAccounts();
    }
  }, [accessToken]);

  useEffect(() => {
    const storedCustomers = localStorage.getItem('selected-customers');
    if (storedCustomers) {
        dispatch(setCustomers(JSON.parse(storedCustomers)));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('selected-customers', JSON.stringify(selectedCustomers));
  }, [selectedCustomers]);

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.name}</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <h1>Please log in</h1>
      )}
      <h1>Contas do Google Ads</h1>
      {loading && <p>Carregando dados...</p>}
      {!loading && accounts.length === 0 && <p>Nenhuma conta encontrada.</p>}
      <div>
        <button onClick={linkMetaAds}>Vincular Meta Ads</button>
        <button onClick={() => fetchGoogleAdsDataForSelectedCustomers('campaigns', setCampaigns)}>Buscar Campanhas</button>
        <button onClick={() => fetchGoogleAdsDataForSelectedCustomers('ad-groups', setAdGroups)}>Buscar Grupos de Anúncios</button>
        <button onClick={() => fetchGoogleAdsDataForSelectedCustomers('ads', setAds)}>Buscar Anúncios</button>
        <button onClick={() => fetchGoogleAdsDataForSelectedCustomers('keywords', setKeywords)}>Buscar Palavras-chave</button>
        <button onClick={() => fetchGoogleAdsDataForSelectedCustomers('locations', setLocations)}>Buscar Localizações</button>
        <button onClick={() => fetchGoogleAdsDataForSelectedCustomers('devices', setDevices)}>Buscar Dispositivos</button>
        <button onClick={() => fetchMetaAdsData('campaigns', setCampaigns)}>Buscar Campanhas Meta Ads</button>
        <button onClick={() => fetchMetaAdsData('adsets', setAdGroups)}>Buscar Conjuntos de Anúncios Meta Ads</button>
        <button onClick={() => fetchMetaAdsData('ads', setAds)}>Buscar Anúncios Meta Ads</button>
        <button onClick={handleFetchUserEmail}>Fetch User Email</button>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Account Name"
          />
          <input
            type="text"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder="Platform"
          />
          <button type="submit">Update Account</button>
        </form>
        <ul>
          {accounts.map((account) => (
            <li key={account.customerId}>
              <input
                  type="checkbox"
                  checked={selectedCustomers.includes(account.customerId)}
                  onChange={() => handleCustomerSelection(account.customerId)}
              />
              <strong>{account.descriptiveName}</strong> - ID: {account.customerId}
              <p>Moeda: {account.currencyCode}</p>
              <p>Fuso horário: {account.timeZone}</p>
              {account.campaigns && (
                <ul>
                  {account.campaigns.map((campaign) => (
                    <li key={campaign.id}>
                      <strong>{campaign.name}</strong> - Status: {campaign.status}
                      <p>Servindo: {campaign.servingStatus}</p>
                      <p>Início: {campaign.startDate}</p>
                      <p>Fim: {campaign.endDate}</p>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <h2>Campanhas</h2>
        <ul>
          {campaigns.map((campaign) => (
            <li key={campaign.id}>
              <strong>{campaign.name}</strong> - Status: {campaign.status}
              <p>Servindo: {campaign.servingStatus}</p>
              <p>Início: {campaign.startDate}</p>
              <p>Fim: {campaign.endDate}</p>
            </li>
          ))}
        </ul>
        <h2>Grupos de Anúncios</h2>
        <ul>
          {adGroups.map((adGroup) => (
            <li key={adGroup.id}>
              <strong>{adGroup.name}</strong> - Status: {adGroup.status}
            </li>
          ))}
        </ul>
        <h2>Anúncios</h2>
        <ul>
          {ads.map((ad) => (
            <li key={ad.id}>
              <strong>{ad.name}</strong> - Status: {ad.status}
            </li>
          ))}
        </ul>
        <h2>Palavras-chave</h2>
        <ul>
          {keywords.map((keyword) => (
            <li key={keyword.id}>
              <strong>{keyword.text}</strong> - Status: {keyword.status}
            </li>
          ))}
        </ul>
        <h2>Localizações</h2>
        <ul>
          {locations.map((location) => (
            <li key={location.id}>
              <strong>{location.name}</strong> - Status: {location.status}
            </li>
          ))}
        </ul>
        <h2>Dispositivos</h2>
        <ul>
          {devices.map((device) => (
            <li key={device.id}>
              <strong>{device.name}</strong> - Status: {device.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Accounts;
function getUserEmailFromSession(): string | null {
  const session = sessionStorage.getItem('userSession');
  if (session) {
    const userSession = JSON.parse(session);
    return userSession.email || null;
  }
  return null;
}

function setSession(accessToken: string, refreshToken: string) {
  sessionStorage.setItem('accessToken', accessToken);
  sessionStorage.setItem('refreshToken', refreshToken);
}


