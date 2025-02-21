import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProfileImage } from '../store/authSlice';
import './styles/AccountSidebar.css';
import GoogleAdsLogo from '../assets/Logo Google Ads.svg';
import GoogleAdsLogoIluminado from '../assets/Logo Google Ads-iluminado.svg';
import MetaAdsLogo from '../assets/Logo Meta Ads.svg';
import MetaAdsLogoIluminado from '../assets/Logo Meta Ads-iluminado.svg';
import { Settings, Plus, User, ChevronRight } from 'lucide-react';
import axios from 'axios';

interface Customer {
  id: string;
  customer_id: string;
  type: 'google_ads' | 'meta_ads';
  is_active: boolean;
  accountdetails_name: string | null;
  accountdetails_business_name: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface AccountSidebarProps {
  selectedAccount: string | null;
  setSelectedAccount: (customer_id: string) => void;
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({ selectedAccount, setSelectedAccount }) => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [hoveredAccountName, setHoveredAccountName] = useState<string | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({
    google: 0,
    facebook: 0
  });
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/accounts/customers/3893aa0b-650d-430a-b6db-62da3be1633a', {
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        setCustomers(response.data.linked_customers || []);
      } catch (error) {
        console.error('Erro ao buscar customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const googleAccounts = customers.filter(account => account.type === 'google_ads' && account.is_active);
  const facebookAccounts = customers.filter(account => account.type === 'meta_ads' && account.is_active);

  const handleNextPage = (channel: string) => {
    const accounts = channel === 'google' ? googleAccounts : facebookAccounts;
    const maxPage = Math.ceil(accounts.length / ITEMS_PER_PAGE) - 1;
    setCurrentPage(prev => ({
      ...prev,
      [channel]: prev[channel] >= maxPage ? 0 : prev[channel] + 1
    }));
  };

  const getPageAccounts = (accounts: Customer[], channel: string) => {
    const startIndex = currentPage[channel] * ITEMS_PER_PAGE;
    return accounts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const handleAccountClick = (customer_id: string) => {
    setSelectedAccount(customer_id);
    localStorage.setItem('selectedCustomer', customer_id);
  };

  const getAccountInitials = (account: Customer): string => {
    const name = account.accountdetails_name || account.accountdetails_business_name || account.customer_id;
    return name.substring(0, 2).toUpperCase();
  };

  const getAccountName = (account: Customer): string => {
    return account.accountdetails_name || account.accountdetails_business_name || account.customer_id;
  };

  const handleMouseEnter = (accountName: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setHoveredAccountName(accountName);
    setTooltipPosition({ top: rect.top, left: rect.left + rect.width + 8 });
    
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    
    tooltipTimeoutRef.current = setTimeout(() => {
      setTooltipVisible(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setTooltipVisible(false);
  };

  const openProfileSettings = () => {
    alert('Abrir configurações de perfil');
  };

  const openSystemSettings = () => {
    alert('Abrir configurações do sistema');
  };

  const addNewAccount = () => {
    alert('Adicionar nova conta');
  };

  const profileImage = useSelector(selectProfileImage);

  return (
    <div className="account-sidebar">
      <div className="account-list">
        {/* Google Ads Channel */}
        <div className="channel-section">
          <div 
            className={`channel-button ${selectedChannel === 'google' ? 'active' : ''}`}
            onClick={() => setSelectedChannel(prev => prev === 'google' ? null : 'google')}
            aria-label="Toggle Google Ads Accounts"
            role="button"
          >
            <img 
              src={selectedChannel === 'google' ? GoogleAdsLogoIluminado : GoogleAdsLogo} 
              alt="Google Ads" 
              className="channel-logo" 
            />
          </div>
          {selectedChannel === 'google' && (
            <div className="channel-content">
              <div 
                className="account-grid" 
                aria-label="Google Ads Accounts"
              >
                {getPageAccounts(googleAccounts, 'google').map((account) => (
                  <div
                    key={`google-${account.id}`}
                    className={`account-square ${selectedAccount === account.customer_id ? 'selected' : ''}`}
                    onMouseEnter={(event) => handleMouseEnter(getAccountName(account), event)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleAccountClick(account.customer_id)}
                    aria-label={`Select Google Ads Account ${account.customer_id}`}
                    role="button"
                  >
                    <div className="account-content">
                      <span className="account-initials">{getAccountInitials(account)}</span>
                    </div>
                  </div>
                ))}
              </div>
              {googleAccounts.length > ITEMS_PER_PAGE && (
                <button 
                  className="nav-button"
                  onClick={() => handleNextPage('google')}
                  aria-label="Next page of Google Ads accounts"
                >
                  <ChevronRight />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Facebook Ads Channel */}
        <div className="channel-section">
          <div 
            className={`channel-button ${selectedChannel === 'facebook' ? 'active' : ''}`}
            onClick={() => setSelectedChannel(prev => prev === 'facebook' ? null : 'facebook')}
            aria-label="Toggle Meta Ads Accounts"
            role="button"
          >
            <img 
              src={selectedChannel === 'facebook' ? MetaAdsLogoIluminado : MetaAdsLogo} 
              alt="Meta Ads" 
              className="channel-logo" 
            />
          </div>
          {selectedChannel === 'facebook' && (
            <div className="channel-content">
              <div 
                className="account-grid" 
                aria-label="Meta Ads Accounts"
              >
                {getPageAccounts(facebookAccounts, 'facebook').map((account) => (
                  <div
                    key={`facebook-${account.id}`}
                    className={`account-square ${selectedAccount === account.customer_id ? 'selected' : ''}`}
                    onMouseEnter={(event) => handleMouseEnter(getAccountName(account), event)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleAccountClick(account.customer_id)}
                    aria-label={`Select Meta Ads Account ${account.customer_id}`}
                    role="button"
                  >
                    <div className="account-content">
                      <span className="account-initials">{getAccountInitials(account)}</span>
                    </div>
                  </div>
                ))}
              </div>
              {facebookAccounts.length > ITEMS_PER_PAGE && (
                <button 
                  className="nav-button"
                  onClick={() => handleNextPage('facebook')}
                  aria-label="Next page of Meta Ads accounts"
                >
                  <ChevronRight />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {tooltipVisible && hoveredAccountName && (
        <div className="tooltip" style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
          {hoveredAccountName}
        </div>
      )}
      <div className="account-sidebar-footer">
        <button className="action-button" onClick={addNewAccount} aria-label="Add new account">
          <Plus size={20} />
        </button>
        <button className="action-button" onClick={openSystemSettings} aria-label="System settings">
          <Settings size={20} />
        </button>
        <button className="action-button" onClick={openProfileSettings} aria-label="Profile settings">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-image" />
          ) : (
            <User size={20} />
          )}
        </button>
      </div>
    </div>
  );
};

export default AccountSidebar;