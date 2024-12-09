import React, { useEffect, useState } from 'react';
import { AdAccount, metaAdsService } from '../../services/metaAdsService';
import { Card } from '../ui/Card/Card';

interface AdAccountSelectorProps {
  accessToken: string;
  onSelect: (account: AdAccount) => void;
}

export const AdAccountSelector: React.FC<AdAccountSelectorProps> = ({
  accessToken,
  onSelect,
}) => {
  const [accounts, setAccounts] = useState<AdAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await metaAdsService.getAdAccounts(accessToken);
        setAccounts(data);
      } catch (err) {
        setError('Failed to load ad accounts');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [accessToken]);

  if (loading) return <div>Loading accounts...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <Card
          key={account.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onSelect(account)}
        >
          <div className="p-4">
            <h3 className="font-semibold text-lg">{account.name}</h3>
            <p className="text-sm text-gray-600">ID: {account.id}</p>
            <p className="text-sm text-gray-600">
              Status: {account.account_status === 1 ? 'Active' : 'Inactive'}
            </p>
            <p className="text-sm text-gray-600">
              Currency: {account.currency}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};