import React, { useState } from 'react';
import { Facebook, Instagram, AlertCircle } from 'lucide-react';

interface Account {
  id: string;
  name: string;
  type: 'facebook' | 'instagram';
  status: 'connected' | 'disconnected';
  pageId?: string;
  accessToken?: string;
}

const AccountConnection: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([
    { id: '1', name: 'Business Page 1', type: 'facebook', status: 'connected', pageId: '123456789' },
    { id: '2', name: 'Fashion Store', type: 'instagram', status: 'connected', pageId: '987654321' },
    { id: '3', name: 'Tech Blog', type: 'facebook', status: 'disconnected' }
  ]);

  const handleConnect = (accountId: string) => {
    setAccounts(accounts.map(account => 
      account.id === accountId 
        ? { ...account, status: 'connected' } 
        : account
    ));
  };

  const handleDisconnect = (accountId: string) => {
    setAccounts(accounts.map(account => 
      account.id === accountId 
        ? { ...account, status: 'disconnected' } 
        : account
    ));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Contas Conectadas</h2>
        <p className="text-gray-600">Gerencie suas conexões com Facebook e Instagram</p>
      </div>

      <div className="grid gap-4">
        {accounts.map(account => (
          <div key={account.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {account.type === 'facebook' ? (
                <Facebook className="w-8 h-8 text-blue-600" />
              ) : (
                <Instagram className="w-8 h-8 text-pink-600" />
              )}
              <div>
                <h3 className="font-semibold">{account.name}</h3>
                <p className="text-sm text-gray-500">ID: {account.pageId || 'Não conectado'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {account.status === 'connected' ? (
                <>
                  <span className="text-green-600 text-sm">Conectado</span>
                  <button
                    onClick={() => handleDisconnect(account.id)}
                    className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                  >
                    Desconectar
                  </button>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <button
                    onClick={() => handleConnect(account.id)}
                    className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                  >
                    Conectar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="mt-6 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2">
        <span>Adicionar Nova Conta</span>
      </button>
    </div>
  );
};

export default AccountConnection;