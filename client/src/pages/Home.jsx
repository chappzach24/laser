import React, { useState, useEffect } from 'react';

const BACKEND_URL = 'http://localhost:5000';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});
  const [notification, setNotification] = useState(null);
  // Add state for user
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchProducts();
    // Get user ID from localStorage or your auth system
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // For testing purposes, you can use a hardcoded MongoDB ObjectId
      // Replace this with your actual user authentication system
      setUserId('6507890123456789abcdef12'); // Replace with a valid MongoDB ObjectId
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError('Failed to load products. Please try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    if (!userId) {
      setNotification({
        type: 'error',
        message: 'Please log in to add items to cart'
      });
      return;
    }

    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    try {
      const requestBody = {
        userId: userId, // Using the stored userId
        productId,
        quantity: 1,
      };
      console.log('Adding to cart:', requestBody);

      const response = await fetch(`${BACKEND_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        throw new Error(errorData?.message || `Failed to add item to cart: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success response:', data);

      setNotification({
        type: 'success',
        message: 'Item added to cart successfully!'
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);

    } catch (error) {
      console.error('Cart error:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Failed to add item to cart. Please try again.'
      });
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Rest of the component remains the same...
  
  return (
    <div className="container py-4">
      {!userId && (
        <div className="alert alert-warning mb-4">
          Please log in to add items to your cart
        </div>
      )}

      {notification && (
        <div 
          className={`alert ${notification.type === 'error' ? 'alert-danger' : 'alert-success'} mb-4`}
          role="alert"
        >
          {notification.message}
        </div>
      )}

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {products.map((product) => (
          <div key={product._id} className="col">
            <div className="card h-100">
              <img
                src={product.imageUrl}
                className="card-img-top"
                alt={product.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text fw-bold fs-5 mb-3">
                  ${product.price?.toFixed(2) ?? 'N/A'}
                </p>
                <button
                  className={`btn ${addingToCart[product._id] ? 'btn-secondary' : 'btn-primary'} mt-auto`}
                  onClick={() => addToCart(product._id)}
                  disabled={addingToCart[product._id] || !userId}
                >
                  {addingToCart[product._id] ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Adding...
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No products available. Please check back later.</p>
        </div>
      )}
    </div>
  );
};

export default ProductListing;