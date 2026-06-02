import React from 'react';
import { useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
        return {
          title: 'Dashboard',
          subtitle: 'Welcome to your inventory management system'
        };
      case '/products':
        return {
          title: 'Products',
          subtitle: 'Manage your product catalog and inventory'
        };
      case '/customers':
        return {
          title: 'Customers',
          subtitle: 'Manage customer information and contacts'
        };
      case '/orders':
        return {
          title: 'Orders',
          subtitle: 'Process and track customer orders'
        };
      default:
        return {
          title: 'Inventory Management',
          subtitle: 'Professional inventory management system'
        };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <header className="top-header">
      <div className="header-content">
        <div className="header-info">
          <h1 className="header-title">{title}</h1>
          <p className="header-subtitle">{subtitle}</p>
        </div>
        
        <div className="header-actions">
          <button className="notification-btn" title="Notifications">
            🔔
          </button>
          
          <div className="user-profile">
            <div
              className="user-avatar"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;