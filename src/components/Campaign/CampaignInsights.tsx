import React, { useEffect, useState } from 'react';
import { AdInsight, metaAdsService } from '../../services/metaAdsService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface CampaignInsightsProps {
  accessToken: string;
  adAccountId: string;
}

export const CampaignInsights: React.FC<CampaignInsightsProps> = ({
  accessToken,
  adAccountId,
}) => {
  const [insights, setInsights] = useState<AdInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const data = await metaAdsService.getAdInsights(accessToken, adAccountId);
        setInsights(data);
      } catch (err) {
        setError('Failed to load insights');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [accessToken, adAccountId]);

  if (loading) return <div>Loading insights...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Campaign Performance</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={insights}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date_start" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="impressions" fill="#8884d8" name="Impressions" />
            <Bar dataKey="clicks" fill="#82ca9d" name="Clicks" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="text-sm font-medium text-blue-600">Total Reach</h3>
          <p className="text-2xl font-bold">
            {insights.reduce((sum, insight) => sum + parseInt(insight.reach), 0).toLocaleString()}
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded">
          <h3 className="text-sm font-medium text-green-600">Total Clicks</h3>
          <p className="text-2xl font-bold">
            {insights.reduce((sum, insight) => sum + parseInt(insight.clicks), 0).toLocaleString()}
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded">
          <h3 className="text-sm font-medium text-purple-600">Avg. Frequency</h3>
          <p className="text-2xl font-bold">
            {(insights.reduce((sum, insight) => sum + parseFloat(insight.frequency), 0) / insights.length).toFixed(2)}
          </p>
        </div>
        
        <div className="bg-orange-50 p-4 rounded">
          <h3 className="text-sm font-medium text-orange-600">Total Spend</h3>
          <p className="text-2xl font-bold">
            ${insights.reduce((sum, insight) => sum + parseFloat(insight.spend), 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};