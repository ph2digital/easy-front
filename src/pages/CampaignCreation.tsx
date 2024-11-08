// src/pages/CampaignCreation.tsx
import React, { useState } from 'react';
import CampaignCreationForm from '../components/CampaignCreationForm';

const CampaignCreation: React.FC = () => {
    const [mode, setMode] = useState<string>('manual');

    return (
        <div>
            <h2>Criar Campanha</h2>
            <button onClick={() => setMode('auto')}>Automático</button>
            <button onClick={() => setMode('guided')}>Guiado</button>
            <button onClick={() => setMode('manual')}>Manual</button>
            <CampaignCreationForm mode={mode as 'manual' | 'guided' | 'automatic'} />
        </div>
    );
};

export default CampaignCreation;
