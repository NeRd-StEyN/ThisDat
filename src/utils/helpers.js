export const formatPrice = (price) => {
  if (typeof price === 'string') return price;
  return `₹${price.toFixed(2)}`;
};



export const searchProducts = (products, query) => {
  if (!query || query.trim() === '') return products;
  const lowerQuery = query.toLowerCase().trim();
  return products.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    (product.manufacturer && product.manufacturer.toLowerCase().includes(lowerQuery)) ||
    product.category.toLowerCase().includes(lowerQuery) ||
    (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
  );
};

export const filterByCategory = (products, category) => {
  if (!category || category === 'all' || category === 'All Categories') return products;
  const target = category.toLowerCase().replace(/ /g, '-');
  return products.filter(product => product.category && product.category.toLowerCase().replace(/ /g, '-') === target);
};

export const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  const getNumPrice = (p) => typeof p.price === 'number' ? p.price : 0;
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => getNumPrice(a) - getNumPrice(b));
    case 'price-high':
      return sorted.sort((a, b) => getNumPrice(b) - getNumPrice(a));
    case 'name-az':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-za':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));

    default:
      return sorted;
  }
};

import { db } from '../config/firebase';
import { ref, set, get, child } from 'firebase/database';

export const getOrderId = () => {
  return 'TD' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
};

export const saveOrder = async (order, userId) => {
  try {
    if (userId) {
      // Save to Realtime Database
      const orderRef = ref(db, `users/${userId}/orders/${order.id}`);
      await set(orderRef, order);
    } else {
      // Fallback to local storage for guests
      const key = 'thisdat_orders';
      const orders = JSON.parse(localStorage.getItem(key) || '[]');
      orders.unshift(order);
      localStorage.setItem(key, JSON.stringify(orders));
    }
  } catch (e) {
    console.error('Failed to save order:', e);
  }
};

export const getOrders = async (userId) => {
  try {
    if (userId) {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, `users/${userId}/orders`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Convert object to array and sort by date descending
        return Object.values(data).sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      return [];
    } else {
      const key = 'thisdat_orders';
      return JSON.parse(localStorage.getItem(key) || '[]');
    }
  } catch (e) {
    console.error('Failed to get orders:', e);
    return [];
  }
};

export const saveAddress = async (address, userId) => {
  try {
    if (userId) {
      const addressRef = ref(db, `users/${userId}/address`);
      await set(addressRef, address);
    } else {
      const key = 'thisdat_address';
      localStorage.setItem(key, JSON.stringify(address));
    }
  } catch (e) {
    console.error('Failed to save address:', e);
  }
};

export const getSavedAddress = async (userId) => {
  try {
    if (userId) {
      const dbRef = ref(db);
      const snapshot = await get(child(dbRef, `users/${userId}/address`));
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return null;
    } else {
      const key = 'thisdat_address';
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
  } catch (e) {
    console.error('Failed to get address:', e);
    return null;
  }
};
