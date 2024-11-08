// src/pages/CreativeManagement.tsx
import React from 'react';
import CreativeRequestList from '../components/CreativeRequestList';

const CreativeManagement: React.FC = () => (
    <div>
        <h2>Gestão de Solicitações de Criativos</h2>
        <CreativeRequestList requests={[]} />
    </div>
);

export default CreativeManagement;
