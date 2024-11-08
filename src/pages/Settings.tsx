// src/pages/Settings.tsx
import React from 'react';

const Settings: React.FC = () => {
    return (
        <div>
            <h1>Configurações</h1>
            <p>Ajuste as preferências da sua conta:</p>
            <ul>
                <li>
                    <label>
                        <input type="checkbox" /> Notificações por e-mail
                    </label>
                </li>
                <li>
                    <label>
                        <input type="checkbox" /> Relatórios mensais
                    </label>
                </li>
            </ul>
            <button>Salvar Configurações</button>
        </div>
    );
};

export default Settings;
  