// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [cartData, setCartData] = useState({
    items: [],
    total: 0
  });
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = 'http://localhost:5000';

  const fetchCart = async () => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/cart/${user._id}`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      setCartData(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartData({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart when user auth state changes
  useEffect(() => {
    fetchCart();
  }, [user, isAuthenticated]);

  const updateCartItem = async (productId, newQuantity) => {
    if (!isAuthenticated || !user) {
      throw new Error('Please log in to update cart');
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          productId,
          quantity: newQuantity
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update cart');
      const data = await response.json();
      setCartData(data);
      return data;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated || !user) {
      throw new Error('Please log in to remove items');
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/cart/${user._id}/${productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to remove item');
      const data = await response.json();
      setCartData(data);
      return data;
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  };

  // Add this method for adding items to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated || !user) {
      throw new Error('Please log in to add items to cart');
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          productId,
          quantity
        }),
      });

      if (!response.ok) throw new Error('Failed to add item to cart');
      const data = await response.json();
      setCartData(data);
      return data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const value = {
    cartData,
    loading,
    fetchCart,
    updateCartItem,
    removeFromCart,
    addToCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}