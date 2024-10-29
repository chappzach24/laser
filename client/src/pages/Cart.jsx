import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartData, loading, updateCartItem, removeFromCart } = useCart();
  const [updating, setUpdating] = useState({});
  const [notification, setNotification] = useState(null);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(prev => ({ ...prev, [productId]: true }));
    try {
      await updateCartItem(productId, newQuantity);
      setNotification({
        type: 'success',
        message: 'Cart updated successfully!'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to update cart'
      });
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }));
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleRemoveItem = async (productId) => {
    setUpdating(prev => ({ ...prev, [productId]: true }));
    try {
      await removeFromCart(productId);
      setNotification({
        type: 'success',
        message: 'Item removed from cart!'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to remove item'
      });
    } finally {
      setUpdating(prev => ({ ...prev, [productId]: false }));
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Shopping Cart</h2>

      {notification && (
        <div 
          className={`alert ${notification.type === 'error' ? 'alert-danger' : 'alert-success'} mb-4`}
          role="alert"
        >
          {notification.message}
        </div>
      )}

      {(!cartData.items || cartData.items.length === 0) ? (
        <div className="text-center py-5">
          <p className="text-muted">Your cart is empty</p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Product</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-end">Price</th>
                  <th className="text-end">Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartData.items.map((item) => (
                  <tr key={item.product._id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="me-3"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                        <div>
                          <h6 className="mb-0">{item.product.name}</h6>
                          <small className="text-muted">{item.product.description}</small>
                        </div>
                      </div>
                    </td>
                    <td className="text-center" style={{ width: '200px' }}>
                      <div className="input-group">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                          disabled={updating[item.product._id] || item.quantity <= 1}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          className="form-control text-center"
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                          disabled={updating[item.product._id]}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-end">
                      ${item.product.price.toFixed(2)}
                    </td>
                    <td className="text-end">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleRemoveItem(item.product._id)}
                        disabled={updating[item.product._id]}
                      >
                        {updating[item.product._id] ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          'Remove'
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end fw-bold">Total:</td>
                  <td className="text-end fw-bold">${cartData.total?.toFixed(2) || '0.00'}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <Link to="/" className="btn btn-outline-primary">
              Continue Shopping
            </Link>
            <button className="btn btn-primary">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;