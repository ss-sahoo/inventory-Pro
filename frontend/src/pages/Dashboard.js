import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        Loading dashboard...
      </div>
    );
  }

  if (error) return <div className="message message-error">⚠️ {error}</div>;

  return (
    <div className="dashboard">
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-content">
              <div className="stat-number">{stats?.total_products || 0}</div>
              <div className="stat-label">Total Products</div>
              <div className="stat-change positive">
                <span>↗️</span> +12% from last month
              </div>
            </div>
            <div className="stat-icon">📦</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-content">
              <div className="stat-number">{stats?.total_customers || 0}</div>
              <div className="stat-label">Total Customers</div>
              <div className="stat-change positive">
                <span>↗️</span> +8% from last month
              </div>
            </div>
            <div className="stat-icon">👥</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-content">
              <div className="stat-number">{stats?.total_orders || 0}</div>
              <div className="stat-label">Total Orders</div>
              <div className="stat-change positive">
                <span>↗️</span> +24% from last month
              </div>
            </div>
            <div className="stat-icon">🛒</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-content">
              <div className="stat-number">{stats?.low_stock_products?.length || 0}</div>
              <div className="stat-label">Low Stock Alerts</div>
              <div className="stat-change negative">
                <span>⚠️</span> Requires attention
              </div>
            </div>
            <div className="stat-icon">🚨</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="quick-actions" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => window.location.href = '/products'}>
              ➕ Add New Product
            </button>
            <button className="btn btn-secondary" onClick={() => window.location.href = '/customers'}>
              👤 Add New Customer
            </button>
            <button className="btn btn-success" onClick={() => window.location.href = '/orders'}>
              🛍️ Create New Order
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>
          <div className="activity-list">
            <div className="activity-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9' }}>
              <span className="activity-icon" style={{ fontSize: '1.25rem' }}>📦</span>
              <div>
                <p style={{ margin: 0, fontWeight: '500' }}>New product added</p>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>2 minutes ago</p>
              </div>
            </div>
            <div className="activity-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9' }}>
              <span className="activity-icon" style={{ fontSize: '1.25rem' }}>🛒</span>
              <div>
                <p style={{ margin: 0, fontWeight: '500' }}>Order #1024 completed</p>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>15 minutes ago</p>
              </div>
            </div>
            <div className="activity-item" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0' }}>
              <span className="activity-icon" style={{ fontSize: '1.25rem' }}>👤</span>
              <div>
                <p style={{ margin: 0, fontWeight: '500' }}>New customer registered</p>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats?.low_stock_products?.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🚨 Low Stock Alert</h3>
            <span className="status-badge status-low-stock">
              {stats.low_stock_products.length} Items
            </span>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Current Stock</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.low_stock_products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>📦</span>
                        <strong>{product.name}</strong>
                      </div>
                    </td>
                    <td>
                      <code style={{ background: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                        {product.sku}
                      </code>
                    </td>
                    <td>
                      <span 
                        className="status-badge"
                        style={{ 
                          background: product.quantity <= 5 ? '#fee2e2' : '#fef3c7',
                          color: product.quantity <= 5 ? '#991b1b' : '#92400e'
                        }}
                      >
                        {product.quantity} units
                      </span>
                    </td>
                    <td>
                      <span className="status-badge status-low-stock">
                        {product.quantity <= 5 ? 'Critical' : 'Low'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => window.location.href = '/products'}
                      >
                        Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!stats?.total_products && !stats?.total_customers && !stats?.total_orders) && (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
          <h2 style={{ marginBottom: '1rem', color: '#1e293b' }}>Welcome to InventoryPro!</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>
            Get started by adding your first product, customer, or creating an order.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/products'}
            >
              Add Your First Product
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => window.location.href = '/customers'}
            >
              Add Your First Customer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;