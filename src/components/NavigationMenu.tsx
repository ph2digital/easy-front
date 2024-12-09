
import React from 'react';
import { Link } from 'react-router-dom';

const NavigationMenu: React.FC = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        // ...existing code...
      </ul>
    </nav>
  );
};

export default NavigationMenu;