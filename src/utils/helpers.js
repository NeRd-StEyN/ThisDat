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
  return products.filter(product => product.category === category);
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

export const getOrderId = () => {
  return 'TD' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
};

export const saveOrder = (order, userId) => {
  try {
    const key = userId ? `thisdat_orders_${userId}` : 'thisdat_orders';
    const orders = JSON.parse(localStorage.getItem(key) || '[]');
    orders.unshift(order);
    localStorage.setItem(key, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save order:', e);
  }
};

export const getOrders = (userId) => {
  try {
    const key = userId ? `thisdat_orders_${userId}` : 'thisdat_orders';
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
};

export const saveAddress = (address, userId) => {
  try {
    const key = userId ? `thisdat_address_${userId}` : 'thisdat_address';
    localStorage.setItem(key, JSON.stringify(address));
  } catch (e) {
    console.error('Failed to save address:', e);
  }
};

export const getSavedAddress = (userId) => {
  try {
    const key = userId ? `thisdat_address_${userId}` : 'thisdat_address';
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};
