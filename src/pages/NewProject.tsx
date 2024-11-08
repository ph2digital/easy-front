// src/pages/NewProject.tsx
import React from 'react';

const NewProject: React.FC = () => {
    return (
        <div>
            <h1>Trocar Workspace</h1>
            <p>Selecione o workspace que deseja acessar:</p>
            {/* Simulação de listagem de workspaces */}
            <ul>
                <li>Workspace 1</li>
                <li>Workspace 2</li>
                <li>Workspace 3</li>
            </ul>
            <button>Confirmar Troca</button>
        </div>
    );
};

export default NewProject;
