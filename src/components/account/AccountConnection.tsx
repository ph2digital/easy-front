import React, { useState } from 'react';
import { connectPage } from '../../services/mockData';

interface AccountConnectionProps {
  pages: any[];
  onConnectPage: () => void;
}

const AccountConnection: React.FC<AccountConnectionProps> = ({ pages, onConnectPage }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [newPageIcon, setNewPageIcon] = useState('');

  const handleConnectPageClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleConnectNewPage = () => {
    const newPage = { id: `${pages.length + 1}`, name: newPageName, icon: newPageIcon };
    connectPage(newPage);
    onConnectPage();
    setShowPopup(false);
  };

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
      <button className="connect-page-button" onClick={handleConnectPageClick}>Conectar Página</button>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Conectar Nova Página</h3>
            <input
              type="text"
              placeholder="Nome da Página"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
            />
            <input
              type="text"
              placeholder="URL do Ícone"
              value={newPageIcon}
              onChange={(e) => setNewPageIcon(e.target.value)}
            />
            <button onClick={handleConnectNewPage}>Conectar</button>
            <button onClick={handleClosePopup}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountConnection;