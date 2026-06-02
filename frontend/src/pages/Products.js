import React, { useState, useEffect } from 'react';
import { productsAPI } from '../api';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    quantity: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct.id, productData);
        setSuccess('✅ Product updated successfully');
      } else {
        await productsAPI.create(productData);
        setSuccess('✅ Product created successfully');
      }

      resetForm();
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save product');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        setSuccess('✅ Product deleted successfully');
        fetchProducts();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete product');
        setTimeout(() => setError(''), 5000);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', sku: '', price: '', quantity: '' });
    setEditingProduct(null);
    setShowForm(false);
    setError('');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getStockStatus = (quantity) => {
    if (quantity <= 5) return { className: 'status-low-stock', text: 'Critical' };
    if (quantity <= 20) return { className: 'status-pending', text: 'Low' };
    return { className: 'status-in-stock', text: 'Good' };
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">
            {products.length} products in inventory
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Cancel' : '➕ Add Product'}
        </button>
      </div>

      {error && <div className="message message-error">⚠️ {error}</div>}
      {success && <div className="message message-success">{success}</div>}

      {showForm && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
            </h3>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">SKU/Code *</label>
                <input
                  type="text"
                  name="sku"
                  className="form-input"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="e.g., PRD-001"
                  disabled={editingProduct}
                  required
                />
                {editingProduct && (
                  <small style={{ color: '#64748b', fontSize: '0.75rem' }}>
                    SKU cannot be changed after creation
                  </small>
                )}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  className="form-input"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  className="form-input"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>
            
            <div className="form-buttons">
              <button type="submit" className="btn btn-success">
                {editingProduct ? '💾 Update Product' : '➕ Create Product'}
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
          <h3 className="card-title">📦 Product Inventory</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Total Value: ${products.reduce((sum, p) => sum + (p.price * p.quantity), 0).toFixed(2)}
            </span>
          </div>
        </div>
        
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            Loading products...
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const stockStatus = getStockStatus(product.quantity);
                  return (
                    <tr key={product.id}>
                      <td data-label="Product">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '1.5rem' }}>📦</span>
                          <div>
                            <strong>{product.name}</strong>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              Added {new Date(product.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-label="SKU">
                        <code style={{ background: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                          {product.sku}
                        </code>
                      </td>
                      <td data-label="Price">
                        <strong>${product.price.toFixed(2)}</strong>
                      </td>
                      <td data-label="Stock">
                        <span style={{ 
                          fontWeight: 'bold',
                          color: product.quantity <= 10 ? '#ef4444' : '#059669' 
                        }}>
                          {product.quantity}
                        </span>
                      </td>
                      <td data-label="Status">
                        <span className={`status-badge ${stockStatus.className}`}>
                          {stockStatus.text}
                        </span>
                      </td>
                      <td data-label="Value">
                        <strong>${(product.price * product.quantity).toFixed(2)}</strong>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleEdit(product)}
                            title="Edit Product"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(product.id)}
                            title="Delete Product"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {products.length === 0 && !loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            color: '#64748b' 
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <h3>No products found</h3>
            <p style={{ marginBottom: '2rem' }}>
              Start building your inventory by adding your first product.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              ➕ Add Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;