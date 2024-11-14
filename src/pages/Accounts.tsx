// src/components/Accounts.tsx

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAccessToken, logout } from '../store/authSlice';
import { updateAccount } from '../store/accountSlice'; // Ensure this path is correct
import { RootState, AppDispatch } from '../store';
import { addCustomer, removeCustomer, setCustomers } from '../store/selectedCustomersSlice';

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
          Authorization: `Bearer ${accessToken}`, // Confirma que `accessToken` está correto aqui
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Erro ao buscar contas: ${response.status} - ${response.statusText}`);
        throw new Error(`Erro ao buscar contas: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Contas obtidas do Google Ads:', data);

      const accountsWithCampaigns = await Promise.all(
        (data.accounts || []).map(async (account: Account) => {
          const campaignsResponse = await fetch(`http://localhost:8080/api/google-ads/accounts/${account.customerId}/campaigns`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (!campaignsResponse.ok) {
            console.error(`Erro ao buscar campanhas para a conta ${account.customerId}: ${campaignsResponse.status} - ${campaignsResponse.statusText}`);
            return account;
          }

          const campaignsData = await campaignsResponse.json();
          return { ...account, campaigns: campaignsData };
        })
      );

      setAccounts(accountsWithCampaigns);
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

  const linkMetaAds = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/accounts/link/meta-ads', {
        method: 'GET',
        credentials: 'include',
      });
      if (response.redirected) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error('Erro ao iniciar o fluxo de autenticação do Meta Ads:', error);
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
      <button onClick={linkMetaAds}>Vincular Meta Ads</button>
      <button onClick={() => fetchGoogleAdsDataForSelectedCustomers('campaigns', setCampaigns)}>Buscar Campanhas</button>
      <button onClick={() => fetchGoogleAdsDataForSelectedCustomers('ad-groups', setAdGroups)}>Buscar Grupos de Anúncios</button>
      <button onClick={() => fetchGoogleAdsDataForSelectedCustomers('ads', setAds)}>Buscar Anúncios</button>
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
    </div>
  );
};

export default Accounts;
