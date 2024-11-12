// src/components/Accounts.tsx

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAccessToken } from '../store/authSlice';

interface Account {
  customerId: string;
  descriptiveName: string;
  currencyCode: string;
  timeZone: string;
}

const Accounts: React.FC = () => {
  const accessToken = useSelector(selectAccessToken);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);

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
      setAccounts(data.accounts || []);
    } catch (error) {
      console.error('Erro ao buscar contas do Google Ads:', error);
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

  return (
    <div>
      <h1>Contas do Google Ads</h1>
      {loading && <p>Carregando contas...</p>}
      {!loading && accounts.length === 0 && <p>Nenhuma conta encontrada.</p>}
      <ul>
        {accounts.map((account) => (
          <li key={account.customerId}>
            <strong>{account.descriptiveName}</strong> - ID: {account.customerId}
            <p>Moeda: {account.currencyCode}</p>
            <p>Fuso horário: {account.timeZone}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Accounts;
