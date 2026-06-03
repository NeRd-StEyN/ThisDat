export const formatPrice = (price) => {
  return `₹${price.toFixed(2)}`;
};

export const calculateDiscount = (price, discountPrice) => {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};

export const searchProducts = (products, query) => {
  if (!query || query.trim() === '') return products;
  const lowerQuery = query.toLowerCase().trim();
  return products.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.manufacturer.toLowerCase().includes(lowerQuery) ||
    product.category.toLowerCase().includes(lowerQuery) ||
    (product.tags && product.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
  );
};

export const filterByCategory = (products, category) => {
  if (!category || category === 'all') return products;
  return products.filter(product => product.category === category);
};

export const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    case 'price-high':
      return sorted.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    case 'name-az':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-za':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'discount':
      return sorted.sort((a, b) => {
        const discA = calculateDiscount(a.price, a.discountPrice);
        const discB = calculateDiscount(b.price, b.discountPrice);
        return discB - discA;
      });
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
