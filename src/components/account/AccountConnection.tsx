import React from 'react';

interface AccountConnectionProps {
  pages: any[];
  onConnectPage: () => void;
}

const AccountConnection: React.FC<AccountConnectionProps> = ({ pages, onConnectPage }) => {
  return (
    <div className="pages-section">
      <h2 className="pages-title">Páginas Conectadas</h2>
      <ul className="pages-list">
        {pages.map((page) => (
          <li key={page.id} className="page-item" id={`page-item-${page.id}`}>
            <img src={page.icon} alt={page.name} className="page-icon" />
            <span className="page-name">{page.name}</span>
          </li>
        ))}
      </ul>
      <button className="connect-page-button" onClick={onConnectPage}>Conectar Página</button>
    </div>
  );
};

export default AccountConnection;