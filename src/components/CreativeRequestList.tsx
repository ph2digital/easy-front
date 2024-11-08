// src/components/CreativeRequestList.tsx
import React from 'react';

interface CreativeRequest {
    id: string;
    description: string;
    type: 'image' | 'video' | 'copy';
    status: 'pending' | 'in_progress' | 'completed';
}

interface CreativeRequestListProps {
    requests: CreativeRequest[];
}

const CreativeRequestList: React.FC<CreativeRequestListProps> = ({ requests }) => {
    return (
        <div className="creative-request-list">
            <h3>Solicitações de Criativos</h3>
            <ul>
                {requests.map(request => (
                    <li key={request.id}>
                        <p>Descrição: {request.description}</p>
                        <p>Tipo: {request.type}</p>
                        <p>Status: {request.status}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CreativeRequestList;
    