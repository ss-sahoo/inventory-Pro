import React, { useState, useEffect } from 'react';
import { customersAPI } from '../api';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customersAPI.getAll();
      setCustomers(response.data);
    } catch (err) {
      setError('Failed to load customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customersAPI.create(formData);
      setSuccess('✅ Customer created successfully');
      resetForm();
      fetchCustomers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create customer');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customersAPI.delete(id);
        setSuccess('✅ Customer deleted successfully');
        fetchCustomers();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete customer');
        setTimeout(() => setError(''), 5000);
      }
    }
  };

  const resetForm = () => {
    setFormData({ full_name: '', email: '', phone: '' });
    setShowForm(false);
    setError('');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatPhoneNumber = (phone) => {
    // Simple phone formatting
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  return (
    <div className="customers-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">
            {customers.length} registered customers
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Cancel' : '👤 Add Customer'}
        </button>
      </div>

      {error && <div className="message message-error">⚠️ {error}</div>}
      {success && <div className="message message-success">{success}</div>}

      {showForm && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">👤 Add New Customer</h3>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="full_name"
                className="form-input"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="Enter customer's full name"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="customer@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </div>
            
            <div className="form-buttons">
              <button type="submit" className="btn btn-success">
                👤 Create Customer
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">👥 Customer Directory</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Active Customers: {customers.length}
            </span>
          </div>
        </div>
        
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            Loading customers...
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Member Since</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td data-label="Customer">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '1.125rem'
                        }}>
                          {customer.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{customer.full_name}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            ID: {customer.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td data-label="Email">
                      <a 
                        href={`mailto:${customer.email}`}
                        style={{ color: '#667eea', textDecoration: 'none' }}
                      >
                        {customer.email}
                      </a>
                    </td>
                    <td data-label="Phone">
                      <a 
                        href={`tel:${customer.phone}`}
                        style={{ color: '#667eea', textDecoration: 'none' }}
                      >
                        {formatPhoneNumber(customer.phone)}
                      </a>
                    </td>
                    <td data-label="Member Since">
                      {new Date(customer.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td data-label="Status">
                      <span className="status-badge status-in-stock">
                        Active
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => window.location.href = `/orders?customer=${customer.id}`}
                          title="View Orders"
                        >
                          📋
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(customer.id)}
                          title="Delete Customer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {customers.length === 0 && !loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            color: '#64748b' 
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👥</div>
            <h3>No customers found</h3>
            <p style={{ marginBottom: '2rem' }}>
              Start building your customer base by adding your first customer.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              👤 Add Your First Customer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Customers;