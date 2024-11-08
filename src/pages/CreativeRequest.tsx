// src/pages/CreativeRequest.tsx
import React from 'react';
import UploadForm from '../components/UploadForm';
import CompetitorSearch from '../components/CompetitorSearch';

const CreativeRequest: React.FC = () => (
    <div>
        <h2>Solicitação de Criativos</h2>
        <UploadForm />
        <CompetitorSearch />
    </div>
);

export default CreativeRequest;
