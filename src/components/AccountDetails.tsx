
import React from 'react';

interface AccountDetailsProps {
  account: any;
}

const formatCurrency = (amount: string, currency: string) => {
  const number = parseFloat(amount) / 100; // Assuming the amount is in cents
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(number);
};

const AccountDetails: React.FC<AccountDetailsProps> = ({ account }) => {
  return (
    <div className="account-details">
      <h2>Detalhes da Conta</h2>
      <p><strong>ID:</strong> {account.customer_id || account.account_id}</p>
      <p><strong>Tipo:</strong> {account.type || 'Facebook Ads'}</p>
      {account.accountDetails && (
        <>
          <p><strong>Nome:</strong> {account.accountDetails.name}</p>
          <p><strong>Nome da Empresa:</strong> {account.accountDetails.business_name}</p>
          <p><strong>Valor Gasto:</strong> {formatCurrency(account.accountDetails.amount_spent, account.accountDetails.currency)}</p>
        </>
      )}
    </div>
  );
};

export default AccountDetails;