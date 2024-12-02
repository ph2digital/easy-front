import React, { useState } from 'react';
import { RiDashboardLine, RiMoneyDollarCircleLine, RiFocusLine, RiLineChartFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './styles/Sidebar.css';
import { FaBars, FaSignOutAlt, FaUserCircle, FaCogs, FaLayerGroup, FaWallet, FaPlus, FaUsers } from 'react-icons/fa';
import { logoutUser } from '../services/api';
import { selectProfileImage } from '../store/authSlice';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const profileImage = useSelector(selectProfileImage);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser(dispatch);
    navigate('/login'); // Redireciona para a página de login após o logout
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'expanded' : 'collapsed'}`}>
      {/* Botão de Colapso */}
      <div className="sidebar-header">
        <button onClick={toggleSidebar} className="toggle-btn">
          <FaBars />
        </button>
      </div>

      {/* Imagem de Perfil e Menu Interativo */}
      <div className="profile-container">
        <div className="profile-image-wrapper" onClick={toggleMenu}>
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-image" />
          ) : (
            <span className="placeholder-icon">👤</span>
          )}
        </div>
        {isMenuOpen && (
          <ul className="profile-menu">
            <li>
              <Link to="/new-project">
                <FaLayerGroup className="dropdown-icon" /> Trocar workspace
              </Link>
            </li>
            <li>
              <Link to="/accounts">
                <FaWallet className="dropdown-icon" /> Cadastrar contas
              </Link>
            </li>
            <li>
              <Link to="/settings">
                <FaCogs className="dropdown-icon" /> Settings
              </Link>
            </li>
            <li>
              <Link to="/profile">
                <FaUserCircle className="dropdown-icon" /> Profile
              </Link>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button onClick={handleLogout} className="logout-button">
                <FaSignOutAlt className="dropdown-icon" /> Sign out
              </button>
            </li>
          </ul>
        )}
      </div>

      {/* Seção do Menu */}
      <div className="menu-section">
        <Link to="/dashboard" className="menu-item">
          <RiDashboardLine className="sidebar-icon" />
          {isOpen && <span>Painel</span>}
        </Link>
        <Link to="/dashboard" className="menu-item">
          <RiLineChartFill className="sidebar-icon" />
          {isOpen && <span>Dashboard</span>}
        </Link>
        <Link to="/finance" className="menu-item">
          <RiMoneyDollarCircleLine className="sidebar-icon" />
          {isOpen && <span>Financeiro</span>}
        </Link>
        <Link to="/tracking" className="menu-item">
          <RiFocusLine className="sidebar-icon" />
          {isOpen && <span>Rastreamento</span>}
        </Link>
        <Link to="/create-campaign" className="menu-item">
          <FaPlus className="sidebar-icon" />
          {isOpen && <span>Criar Campanha</span>}
        </Link>
        <Link to="/create-custom-audience" className="menu-item">
          <FaUsers className="sidebar-icon" />
          {isOpen && <span>Criar Público</span>}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
