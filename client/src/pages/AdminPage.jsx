import React, { useState, useEffect } from 'react';

const AdminPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    stockQuantity: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [productId, setProductId] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = isEditing
      ? `http://localhost:5000/api/products/${productId}`
      : 'http://localhost:5000/api/products';

    const method = isEditing ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        alert(`Product ${isEditing ? 'updated' : 'created'} successfully!`);
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          imageUrl: '',
          stockQuantity: ''
        });
        setIsEditing(false);
      })
      .catch((err) => console.error('Error:', err));
  };

  return (
    <div>
      <h1>{isEditing ? 'Edit Product' : 'Add Product'}</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required />
        <textarea name="description" placeholder="Product Description" value={formData.description} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
        <input type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} />
        <input type="number" name="stockQuantity" placeholder="Stock Quantity" value={formData.stockQuantity} onChange={handleChange} required />
        <button type="submit">{isEditing ? 'Update' : 'Add'} Product</button>
      </form>
    </div>
  );
};

export default AdminPage;
