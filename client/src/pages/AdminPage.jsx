import React, { useState } from 'react';

const AdminPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    stockQuantity: ''
  });

  const [imageFile, setImageFile] = useState(null); // Add state to hold image file
  const [isEditing, setIsEditing] = useState(false);
  const [productId, setProductId] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle image file change
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload image to Cloudinary
    if (imageFile) {
      const formDataForImage = new FormData();
      formDataForImage.append('image', imageFile);

      try {
        const cloudinaryResponse = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formDataForImage
        });
        const cloudinaryData = await cloudinaryResponse.json();

        // Add image URL to formData
        setFormData((prevFormData) => ({
          ...prevFormData,
          imageUrl: cloudinaryData.imageUrl // Use Cloudinary URL
        }));
      } catch (err) {
        console.error('Image upload failed:', err);
        return;
      }
    }

    const url = isEditing
      ? `http://localhost:5000/api/products/${productId}`
      : 'http://localhost:5000/api/products';

    const method = isEditing ? 'PUT' : 'POST';

    // Submit product data
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
        
        {/* Image Upload */}
        <input type="file" name="image" onChange={handleImageChange} />
        
        <input type="number" name="stockQuantity" placeholder="Stock Quantity" value={formData.stockQuantity} onChange={handleChange} required />
        <button type="submit">{isEditing ? 'Update' : 'Add'} Product</button>
      </form>
    </div>
  );
};

export default AdminPage;
