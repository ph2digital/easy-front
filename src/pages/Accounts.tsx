// src/pages/Accounts.tsx
import React, { useState, useEffect } from 'react';
import supabase from '../services/supabaseClient';
import './styles/Accounts.css';

// Defina o tipo Account com todos os campos retornados pelo Supabase
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
  const [platform, setPlatform] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountId, setAccountId] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para buscar contas de anúncios do Supabase
  const fetchAccounts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar contas:', error.message);
    } else {
      setAccounts(data as unknown as Account[]); // Conversão explícita para Account[]
    }
    setLoading(false);
  };


  // Função para adicionar uma nova conta de anúncio
  const addAccount = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) {
      console.error('Erro: usuário não autenticado.');
      setLoading(false);
      return;
    }

    // Inserir uma nova conta no Supabase
    const { error } = await supabase.from('accounts').insert([
      {
        user_id: user.id,
        platform,
        account_name: accountName,
        account_id: accountId,
      },
    ]);

    if (error) {
      console.error('Erro ao adicionar conta:', error.message);
    } else {
      setPlatform('');
      setAccountName('');
      setAccountId('');
      fetchAccounts(); // Atualiza a lista de contas após adicionar
    }
    setLoading(false);
  };
  const linkGoogleAds = () => {
    window.location.href = 'http://localhost:8080/api/oauth/google';
  };

  const linkFacebookAds = () => {
    window.location.href = 'http://localhost:8080/api/oauth/facebook';
  };

  const linkTikTokAds = () => {
    window.location.href = 'http://localhost:8080/api/oauth/tiktok';
  };

  // Função para excluir uma conta de anúncio
  const deleteAccount = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from('accounts').delete().match({ id });

    if (error) {
      console.error('Erro ao excluir conta:', error.message);
    } else {
      fetchAccounts(); // Atualiza a lista de contas após exclusão
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div>
      <h1>Cadastrar Contas de Anúncio</h1>

      {/* Formulário para adicionar uma nova conta */}
      <div>
        <h2>Adicionar Nova Conta</h2>
        <label>
          Plataforma:
          <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="">Selecione a plataforma</option>
            <option value="Meta Ads">Meta Ads</option>
            <option value="Google Ads">Google Ads</option>
            <option value="TikTok Ads">TikTok Ads</option>
          </select>
        </label>
        <label>
          Nome da Conta:
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Ex: Conta Principal"
          />
        </label>
        <label>
          ID da Conta:
          <input
            type="text"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            placeholder="ID para vinculação API"
          />
        </label>
        <button onClick={addAccount} disabled={loading}>
          {loading ? 'Adicionando...' : 'Adicionar Conta'}
        </button>
      </div>

      {/* Lista de contas cadastradas */}
      <div>
        <h2>Contas Cadastradas</h2>
        {loading && <p>Carregando...</p>}
        {!loading && accounts.length === 0 && <p>Nenhuma conta cadastrada.</p>}
        <ul>
          {accounts.map((account) => (
            <li key={account.id}>
              <strong>{account.platform}</strong> - {account.account_name} (ID: {account.account_id})
              <button onClick={() => deleteAccount(account.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      </div>
      <h1>Cadastrar Contas de Anúncio</h1>
      <button onClick={linkGoogleAds} disabled={loading}>
        Vincular Conta do Google Ads
      </button>
      <div>
      <h1>Cadastrar Contas de Anúncio</h1>
      <button onClick={linkGoogleAds}>Vincular Conta do Google Ads</button>
      <button onClick={linkFacebookAds}>Vincular Conta do Facebook Ads</button>
      <button onClick={linkTikTokAds}>Vincular Conta do TikTok Ads</button>
    </div>
    </div>
  );
};

export default Accounts;
