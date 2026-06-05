import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

import { useAuth } from './AuthContext';

const getStorageKey = (userId) => {
  return userId ? `thisdat_cart_${userId}` : 'thisdat_cart';
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  // Load cart on mount or user change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(getStorageKey(user?.uid));
      setItems(saved ? JSON.parse(saved) : []);
    } catch {
      setItems([]);
    }
  }, [user?.uid]);

  // Save cart on items change
  useEffect(() => {
    localStorage.setItem(getStorageKey(user?.uid), JSON.stringify(items));
  }, [items, user?.uid]);

  const addToCart = useCallback((product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(item => item.id !== productId));
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getSubtotal = useCallback(() => {
    return items.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      return sum + (price * item.quantity);
    }, 0);
  }, [items]);



  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const isInCart = useCallback((productId) => {
    return items.some(item => item.id === productId);
  }, [items]);

  const getItemQuantity = useCallback((productId) => {
    const item = items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }, [items]);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getSubtotal,
    getItemCount,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
