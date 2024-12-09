import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { linkAccountFromHome, createFacebookAdAccount } from '../services/api';
import './styles/CompleteRegistration.css';

const CompleteRegistration: React.FC = () => {
  const [adAccountName, setAdAccountName] = useState('');
  const [adAccountType, setAdAccountType] = useState('facebook');
  const [linkedAccounts, setLinkedAccounts] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleLinkAccount = async () => {
    const userId = 'mockUserId'; // Replace with actual user ID
    const authUrl = await linkAccountFromHome(adAccountType, userId);
    console.log('Link account URL:', authUrl);
    alert('Mock account linked successfully!');
    setLinkedAccounts([...linkedAccounts, adAccountType]);
    localStorage.setItem('hasCompletedRegistration', 'true');
    navigate('/home');
  };

  const handleCreateAdAccount = async () => {
    const accessToken = 'mockAccessToken'; // Replace with actual access token
    const businessId = 'mockBusinessId'; // Replace with actual business ID
    const adAccountData = { name: adAccountName };
    const response = await createFacebookAdAccount(accessToken, businessId, adAccountData);
    console.log('Created ad account:', response);
    alert('Mock ad account created successfully!');
    setLinkedAccounts([...linkedAccounts, adAccountName]);
    localStorage.setItem('hasCompletedRegistration', 'true');
    navigate('/home');
  };

  return (
    <div className="complete-registration-container">
      <h1>Complete seu Cadastro</h1>
      <form className="complete-registration-form">
        <div className="form-group">
          <label htmlFor="adAccountName">Nome da Conta de Anúncio</label>
          <input
            type="text"
            id="adAccountName"
            value={adAccountName}
            onChange={(e) => setAdAccountName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="adAccountType">Tipo de Conta de Anúncio</label>
          <select
            id="adAccountType"
            value={adAccountType}
            onChange={(e) => setAdAccountType(e.target.value)}
          >
            <option value="facebook">Facebook</option>
            <option value="google">Google</option>
          </select>
        </div>
        <button type="button" onClick={handleLinkAccount}>
          Vincular Conta de Anúncio
        </button>
        <button type="button" onClick={handleCreateAdAccount}>
          Criar Nova Conta de Anúncio
        </button>
        <button type="button" onClick={() => {
          localStorage.setItem('hasCompletedRegistration', 'true');
          navigate('/home');
        }}>
          Pular
        </button>
      </form>
      {linkedAccounts.length > 0 && (
        <div className="linked-accounts">
          <h2>Contas Vinculadas</h2>
          <ul>
            {linkedAccounts.map((account, index) => (
              <li key={index}>{account}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CompleteRegistration;