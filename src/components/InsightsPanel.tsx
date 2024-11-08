// src/components/InsightsPanel.tsx
import React from 'react';

const InsightsPanel: React.FC = () => {
    // Dados fictícios para exemplo
    const insights = [
        { id: 1, text: 'Aumente o orçamento da campanha para aumentar a visibilidade' },
        { id: 2, text: 'Tente segmentar um público mais específico para melhorar o CTR' },
    ];

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
