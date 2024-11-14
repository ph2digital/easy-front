// src/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Header.css';
import { useSelector } from 'react-redux';
import { RootState } from '../store/index';

const Header: React.FC = () => {
  const profileImage = useSelector((state: RootState) => state.auth.profileImage);

  return (
    <header className="p-3 mb-3 header-container">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <Link to="/" className="d-flex align-items-center mb-2 mb-lg-0 text-decoration-none">
            <img
              style={{ width: 'auto', height: '40px' }}
              className="img-fluid"
              src="https://ph2digital.com/wp-content/uploads/2023/10/Logo-ph2.png"
              alt="logo"
            />
          </Link>

          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li><Link to="/campaigns" className="nav-link px-2 link-secondary">Campanhas</Link></li>
            <li><Link to="/reports" className="nav-link px-2 link-body-emphasis">Relatórios</Link></li>
            <li><Link to="/gallery" className="nav-link px-2 link-body-emphasis">Galeria</Link></li>
            <li><Link to="/tips" className="nav-link px-2 link-body-emphasis">Dicas</Link></li>
          </ul>

          <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
            <input type="search" className="form-control" placeholder="Search..." aria-label="Search" />
          </form>

          <div className="dropdown text-end">
            <a
              href="#"
              className="d-block link-dark text-decoration-none dropdown-toggle"
              id="dropdownUser1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="rounded-circle profile-image" />
              ) : (
                <span className="placeholder-icon">👤</span>
              )}
            </a>
            <ul className="dropdown-menu dropdown-menu-end text-small shadow" aria-labelledby="dropdownUser1">
              <li><Link className="dropdown-item" to="/new-project">New project...</Link></li>
              <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
              <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li><Link className="dropdown-item" to="/sign-out">Sign out</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
