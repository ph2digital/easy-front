import React from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface IntegrationCardProps {
  name: string;
  status: 'active' | 'inactive';
  lastUpdated: string;
  tokenExpiry: string;
  onRefresh: () => void;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  name,
  status,
  lastUpdated,
  tokenExpiry,
  onRefresh,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {status === 'active' ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <h3 className="font-semibold">{name}</h3>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Atualizar token"
        >
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      <div className="mt-3 space-y-1">
        <p className="text-sm text-gray-600">
          Última atualização: {lastUpdated}
        </p>
        <p className="text-sm text-gray-600">
          Expiração do token: {tokenExpiry}
        </p>
      </div>
      
      <div className="mt-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {status === 'active' ? 'Ativo' : 'Inativo'}
        </span>
      </div>
    </div>
  );
};

export default IntegrationCard;