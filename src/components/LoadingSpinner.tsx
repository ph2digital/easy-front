import React from 'react';
import './styles/LoadingSpinner.css';

const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Carregando...</p>
  </div>
);

export default LoadingSpinner;
