// src/pages/Accounts.tsx
import React, { useState, useEffect } from 'react';
import supabase from '../services/supabaseClient';
import './styles/Accounts.css';

interface Account {
  id: string;
  user_id: string;
  platform: string;
  account_name: string;
  account_id: string;
  created_at: string;
}

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);

  // Função para vincular a conta do Google Ads usando o Supabase
  const linkGoogleAds = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/adwords', // Escopo para Google Ads
      },
    });
    console.log(data);
    if (error) console.error('Erro ao vincular conta do Google Ads:', error.message);
  };

  // Função para buscar campanhas do Google Ads
  const fetchCampaigns = async () => {
    setLoading(true);
    const accessToken = (await supabase.auth.getSession())?.data.session?.access_token;
    
    if (!accessToken) {
      console.error('Erro: usuário não autenticado');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/google-ads/campaigns', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const campaigns = await response.json();
      console.log('Campanhas do Google Ads:', campaigns);
    } catch (error) {
      console.error('Erro ao buscar campanhas do Google Ads:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar contas:', error.message);
      } else {
        setAccounts(data as unknown as Account[]);
      }
    };
    fetchAccounts();
  }, []);

  return (
    <div>
      <h1>Contas de Anúncio do Google</h1>
      <button onClick={linkGoogleAds} disabled={loading}>
        Vincular Conta do Google Ads
      </button>

      <div>
        <h2>Contas Cadastradas</h2>
        {loading && <p>Carregando...</p>}
        {!loading && accounts.length === 0 && <p>Nenhuma conta cadastrada.</p>}
        <ul>
          {accounts.map((account) => (
            <li key={account.id}>
              <strong>{account.platform}</strong> - {account.account_name} (ID: {account.account_id})
            </li>
          ))}
        </ul>
        <button onClick={fetchCampaigns} disabled={loading}>
          Listar Campanhas
        </button>
      </div>
    </div>
  );
};

export default Accounts;
