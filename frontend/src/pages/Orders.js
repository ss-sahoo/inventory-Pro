import React, { useState, useEffect } from 'react';
import { ordersAPI, productsAPI, customersAPI } from '../api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    customer_id: '',
    items: [{ product_id: '', quantity: 1 }],
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchCustomers();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getAll();
      setCustomers(response.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        ...formData,
        customer_id: parseInt(formData.customer_id),
        items: formData.items.map(item => ({
          product_id: parseInt(item.product_id),
          quantity: parseInt(item.quantity),
        })),
      };

      await ordersAPI.create(orderData);
      setSuccess('✅ Order created successfully');
      resetForm();
      fetchOrders();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create order');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await ordersAPI.delete(id);
        setSuccess('✅ Order cancelled successfully');
        fetchOrders();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to cancel order');
        setTimeout(() => setError(''), 5000);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      customer_id: '',
      items: [{ product_id: '', quantity: 1 }],
    });
    setShowForm(false);
    setError('');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_id: '', quantity: 1 }],
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      const product = products.find(p => p.id === parseInt(item.product_id));
      if (product) {
        return total + (product.price * item.quantity);
      }
      return total;
    }, 0);
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-low-stock';
      default: return 'status-pending';
    }
  };

  const canCreateOrder = products.length > 0 && customers.length > 0;

  return (
    <div className="orders-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-subtitle">
            {orders.length} total orders • Total value: ${orders.reduce((sum, o) => sum + o.total_amount, 0).toFixed(2)}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
          disabled={!canCreateOrder}
          title={!canCreateOrder ? "You need at least one product and one customer to create orders" : ""}
        >
          {showForm ? '❌ Cancel' : '🛍️ Create Order'}
        </button>
      </div>

      {error && <div className="message message-error">⚠️ {error}</div>}
      {success && <div className="message message-success">{success}</div>}

      {!canCreateOrder && (
        <div className="message message-info">
          💡 You need at least one product and one customer to create orders.
        </div>
      )}

      {showForm && canCreateOrder && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">🛍️ Create New Order</h3>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Customer *</label>
              <select
                name="customer_id"
                className="form-select"
                value={formData.customer_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.full_name} ({customer.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="order-items">
              <label className="form-label">Order Items *</label>
              {formData.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="order-item-product">
                    <label className="form-label">Product</label>
                    <select
                      className="form-select"
                      value={item.product_id}
                      onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - ${product.price} (Stock: {product.quantity})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="order-item-quantity">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-input"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      min="1"
                      required
                      placeholder="Qty"
                    />
                  </div>
                  
                  {formData.items.length > 1 && (
                    <div className="order-item-remove">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="remove-item-btn"
                        title="Remove item"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="btn btn-secondary btn-sm add-item-btn"
              >
                ➕ Add Another Item
              </button>
            </div>

            <div className="order-total">
              <strong>Total: ${calculateTotal().toFixed(2)}</strong>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn btn-success">
                🛍️ Create Order
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
          <h3 className="card-title">📋 Order History</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Revenue: ${orders.reduce((sum, o) => sum + o.total_amount, 0).toFixed(2)}
            </span>
          </div>
        </div>
        
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            Loading orders...
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td data-label="Order">
                      <div>
                        <strong>#{order.id.toString().padStart(4, '0')}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </td>
                    <td data-label="Customer">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea, #764ba2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.875rem'
                        }}>
                          {order.customer?.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{order.customer?.full_name}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {order.customer?.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td data-label="Items">
                      <div style={{ fontSize: '0.875rem' }}>
                        {order.items?.slice(0, 2).map((item, idx) => (
                          <div key={idx} style={{ marginBottom: '0.25rem' }}>
                            {item.product?.name} (×{item.quantity})
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                            +{order.items.length - 2} more items
                          </div>
                        )}
                      </div>
                    </td>
                    <td data-label="Total">
                      <strong>${order.total_amount.toFixed(2)}</strong>
                    </td>
                    <td data-label="Status">
                      <span className={`status-badge ${getOrderStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td data-label="Date">
                      {new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setSelectedOrder(order)}
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(order.id)}
                          title="Cancel Order"
                        >
                          ❌
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {orders.length === 0 && !loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            color: '#64748b' 
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
            <h3>No orders found</h3>
            <p style={{ marginBottom: '2rem' }}>
              {canCreateOrder 
                ? "Start processing orders by creating your first order."
                : "Add products and customers first, then you can create orders."
              }
            </p>
            {canCreateOrder ? (
              <button 
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                🛍️ Create Your First Order
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => window.location.href = '/products'}
                >
                  📦 Add Products
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => window.location.href = '/customers'}
                >
                  👤 Add Customers
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Details Modal (if selectedOrder) */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', margin: 0 }}>
            <div className="card-header">
              <h3 className="card-title">Order #{selectedOrder.id.toString().padStart(4, '0')} Details</h3>
              <button 
                className="btn btn-sm btn-secondary"
                onClick={() => setSelectedOrder(null)}
              >
                ❌ Close
              </button>
            </div>
            <div>
              <p><strong>Customer:</strong> {selectedOrder.customer?.full_name}</p>
              <p><strong>Email:</strong> {selectedOrder.customer?.email}</p>
              <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
              <p><strong>Status:</strong> <span className={`status-badge ${getOrderStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
              
              <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Items:</h4>
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '0.5rem 0',
                  borderBottom: '1px solid #f1f5f9'
                }}>
                  <span>{item.product?.name} (×{item.quantity})</span>
                  <span>${(item.unit_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '1rem 0',
                borderTop: '2px solid #e2e8f0',
                marginTop: '1rem',
                fontSize: '1.25rem',
                fontWeight: 'bold'
              }}>
                <span>Total:</span>
                <span>${selectedOrder.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;