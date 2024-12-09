import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickAccessPanel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="quick-access-panel">
      <h3>Quick Access</h3>
      <button onClick={() => navigate('/create-campaign')}>Create Campaign</button>
      <button onClick={() => navigate('/dashboard')}>View Dashboard</button>
      <button onClick={() => navigate('/settings')}>Settings</button>
    </div>
  );
};

export default QuickAccessPanel;