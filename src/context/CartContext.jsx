import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

import { db } from '../config/firebase';
import { ref, get, set, child } from 'firebase/database';
import { useAuth } from './AuthContext';

const getStorageKey = (userId) => {
  return 'thisdat_cart'; // local storage key for guests
};

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false); // To prevent overwriting remote with empty local cart on mount

  // Load cart on mount or user change
  useEffect(() => {
    if (authLoading) return;

    const loadCart = async () => {
      try {
        if (user?.uid) {
          const dbRef = ref(db);
          const snapshot = await get(child(dbRef, `users/${user.uid}/cart/items`));
          
          if (snapshot.exists()) {
            setItems(snapshot.val() || []);
          } else {
            // First time login on this device? Check if local cart has items
            const local = localStorage.getItem(getStorageKey());
            const localItems = local ? JSON.parse(local) : [];
            if (localItems.length > 0) {
              setItems(localItems);
              const cartRef = ref(db, `users/${user.uid}/cart/items`);
              await set(cartRef, localItems);
            } else {
              setItems([]);
            }
          }
        } else {
          // Guest
          const saved = localStorage.getItem(getStorageKey());
          setItems(saved ? JSON.parse(saved) : []);
        }
      } catch (e) {
        console.error('Failed to load cart', e);
        setItems([]);
      } finally {
        setCartLoaded(true);
      }
    };
    
    setCartLoaded(false);
    loadCart();
  }, [user?.uid, authLoading]);

  // Save cart on items change
  useEffect(() => {
    if (!cartLoaded) return; // Don't save if we haven't finished loading

    const saveCart = async () => {
      try {
        if (user?.uid) {
          const cartRef = ref(db, `users/${user.uid}/cart/items`);
          await set(cartRef, items);
        } else {
          localStorage.setItem(getStorageKey(), JSON.stringify(items));
        }
      } catch (e) {
        console.error('Failed to save cart', e);
      }
    };

    saveCart();
  }, [items, user?.uid, cartLoaded]);

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
