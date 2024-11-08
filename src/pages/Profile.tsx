// src/pages/Profile.tsx
import React from 'react';

const Profile: React.FC = () => {
    return (
        <div>
            <h1>Perfil do Usuário</h1>
            <p>Veja e atualize suas informações de perfil:</p>
            <form>
                <label>
                    Nome:
                    <input type="text" placeholder="Nome Completo" />
                </label>
                <br />
                <label>
                    E-mail:
                    <input type="email" placeholder="Email" />
                </label>
                <br />
                <button>Atualizar Perfil</button>
            </form>
            <h2>Histórico de Atividades</h2>
            <ul>
                <li>Campanha criada em 01/01/2024</li>
                <li>Perfil atualizado em 05/01/2024</li>
                {/* Lista de atividades do usuário */}
            </ul>
        </div>
    );
};

export default Profile;
