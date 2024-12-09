// src/components/InsightsPanel.tsx
import React from 'react';

interface InsightsPanelProps {
  insights: any[];
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights }) => {
  if (!Array.isArray(insights)) {
    return <div>No insights available</div>;
  }

  return (
    <div className="insights-panel">
      {insights.map((insight, index) => (
        <div key={index} className="insight-item">
          {/* Render insight details */}
          <p>{insight.metric}: {insight.value}</p>
        </div>
      ))}
    </div>
  );
};

export default InsightsPanel;
