// src/components/InsightsPanel.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InsightsPanel: React.FC = () => {
  const [insights, setInsights] = useState<{ id: number; text: string }[]>([]);

  useEffect(() => {
    // Fetch insights from API
    axios.get('/api/insights')
      .then(response => setInsights(response.data))
      .catch(error => console.error('Error fetching insights', error));
  }, []);

  return (
    <div className="insights-panel">
      <h3>Insights</h3>
      <ul>
        {insights.map((insight) => (
          <li key={insight.id}>{insight.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default InsightsPanel;
