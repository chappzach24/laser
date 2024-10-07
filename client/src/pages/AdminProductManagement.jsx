import React, { useState, useEffect } from 'react';

const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stockQuantity: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingFile, setEditingFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // console.log('Fetched products:', data);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products. Please try again.');
    }
  };

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingProduct({ ...editingProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleFileChange = (e, isEditing = false) => {
    if (isEditing) {
      setEditingFile(e.target.files[0]);
    } else {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newProduct).forEach(key => formData.append(key, newProduct[key]));
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts([...products, data]);
      setNewProduct({ name: '', description: '', price: '', category: '', stockQuantity: '' });
      setSelectedFile(null);
      // console.log('Product added successfully:', data);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setProducts(products.filter(product => product._id !== id));
      // console.log('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct({ ...product });
    setEditingFile(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    // console.log('Starting update process for product:', editingProduct._id);
    
    const formData = new FormData();
    Object.keys(editingProduct).forEach(key => {
      if (key !== '_id' && key !== '__v' && key !== 'imageUrl') {
        formData.append(key, editingProduct[key]);
        // console.log(`Appending ${key}:`, editingProduct[key]);
      }
    });
    
    if (editingFile) {
      formData.append('image', editingFile);
      // console.log('Appending new image file');
    }

    try {
      // console.log('Sending PUT request to:', `http://localhost:5000/api/products/${editingProduct._id}`);
      const response = await fetch(`http://localhost:5000/api/products/${editingProduct._id}`, {
        method: 'PUT',
        body: formData
      });
      
      // console.log('Received response:', response);
      // console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const updatedProduct = await response.json();
      // console.log('Received updated product:', updatedProduct);
      
      setProducts(prevProducts => {
        const newProducts = prevProducts.map(p => p._id === updatedProduct._id ? updatedProduct : p);
        // console.log('New products state:', newProducts);
        return newProducts;
      });
      
      setEditingProduct(null);
      setEditingFile(null);
      // console.log('Product updated successfully:', updatedProduct);
    } catch (error) {
      // console.error('Error updating product:', error);
      alert(`Failed to update product. Error: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditingFile(null);
  };

  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <div className="card-header">
          <h2 className="mb-0">Add New Product</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                required
                rows="3"
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                id="category"
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="stockQuantity" className="form-label">Stock Quantity</label>
              <input
                type="number"
                className="form-control"
                id="stockQuantity"
                name="stockQuantity"
                value={newProduct.stockQuantity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Product Image</label>
              <input
                type="file"
                className="form-control"
                id="image"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Product</button>
          </form>
        </div>
      </div>

      <h2 className="mb-3">Existing Products</h2>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product._id}>
            <div className="card">
              <div className="card-body">
                {editingProduct && editingProduct._id === product._id ? (
                  <form onSubmit={handleUpdate}>
                    <div className="mb-3">
                      <label htmlFor="edit-name" className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit-name"
                        name="name"
                        value={editingProduct.name}
                        onChange={(e) => handleInputChange(e, true)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="edit-description" className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        id="edit-description"
                        name="description"
                        value={editingProduct.description}
                        onChange={(e) => handleInputChange(e, true)}
                        required
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="edit-price" className="form-label">Price</label>
                      <input
                        type="number"
                        className="form-control"
                        id="edit-price"
                        name="price"
                        value={editingProduct.price}
                        onChange={(e) => handleInputChange(e, true)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="edit-category" className="form-label">Category</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit-category"
                        name="category"
                        value={editingProduct.category}
                        onChange={(e) => handleInputChange(e, true)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="edit-stockQuantity" className="form-label">Stock Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        id="edit-stockQuantity"
                        name="stockQuantity"
                        value={editingProduct.stockQuantity}
                        onChange={(e) => handleInputChange(e, true)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="edit-image" className="form-label">Product Image</label>
                      <input
                        type="file"
                        className="form-control"
                        id="edit-image"
                        onChange={(e) => handleFileChange(e, true)}
                        accept="image/*"
                      />
                      {editingProduct.imageUrl && !editingFile && (
                        <img src={editingProduct.imageUrl} alt="Current product image" className="mt-2" style={{maxHeight: "100px"}} />
                      )}
                    </div>
                    <button type="submit" className="btn btn-primary me-2">Save</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                  </form>
                ) : (
                  <>
                    <img src={product.imageUrl} alt={product.name} className="card-img-top mb-3" style={{maxHeight: "200px", objectFit: "cover"}} />
                    <h3 className="card-title">{product.name}</h3>
                    <p className="card-text">{product.description}</p>
                    <p className="card-text">Price: ${product.price}</p>
                    <p className="card-text">Category: {product.category}</p>
                    <p className="card-text">Stock: {product.stockQuantity}</p>
                    <button
                      onClick={() => handleEdit(product)}
                      className="btn btn-primary me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductManagement;