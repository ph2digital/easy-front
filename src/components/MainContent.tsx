// MainContent.tsx
import React from 'react';
import './styles/MainContent.css';

const MainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main className="main-content-container">
      {children} {/* Renderiza o conteúdo da rota atual aqui */}
    </main>
  );
};

export default MainContent;
