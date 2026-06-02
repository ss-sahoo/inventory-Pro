import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="logo" onClick={onClose}>
            <div className="logo-icon">
              📦
            </div>
            <div className="logo-text">
              InventoryPro
            </div>
          </Link>
        </div>

        <nav className="nav-menu">
          <div className="nav-section">
            <ul className="nav-links">
              <li>
                <Link 
                  to="/" 
                  className={`nav-link ${isActive('/')}`}
                  onClick={onClose}
                >
                  <span className="nav-icon">📊</span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className={`nav-link ${isActive('/products')}`}
                  onClick={onClose}
                >
                  <span className="nav-icon">📦</span>
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/customers" 
                  className={`nav-link ${isActive('/customers')}`}
                  onClick={onClose}
                >
                  <span className="nav-icon">👥</span>
                  Customers
                </Link>
              </li>
              <li>
                <Link 
                  to="/orders" 
                  className={`nav-link ${isActive('/orders')}`}
                  onClick={onClose}
                >
                  <span className="nav-icon">🛒</span>
                  Orders
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;