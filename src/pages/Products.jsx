import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Package, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { medicines, categories } from '../data/medicines';
import { searchProducts, filterByCategory, sortProducts } from '../utils/helpers';
import './Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('default');

  const searchQuery = searchParams.get('search') || '';
  const activeCategory = searchParams.get('category') || 'All Categories';

  const filteredProducts = useMemo(() => {
    let result = medicines;
    if (searchQuery) {
      result = searchProducts(result, searchQuery);
    }
    if (activeCategory !== 'all') {
      result = filterByCategory(result, activeCategory);
    }
    result = sortProducts(result, sortBy);
    return result;
  }, [searchQuery, activeCategory, sortBy]);

  const handleCategoryChange = (catId) => {
    const params = new URLSearchParams(searchParams);
    if (catId === 'All Categories') {
      params.delete('category');
    } else {
      params.set('category', catId);
    }
    setSearchParams(params);
  };

  const activeCategoryName = activeCategory === 'All Categories'
    ? 'All Medicines'
    : categories.find(c => c.id === activeCategory)?.name || 'All Medicines';

  return (
    <div className="products-page page-enter">
      <div className="container">
        <div className="products-page__header">
          <h1 className="products-page__title">
            {searchQuery ? `Results for "${searchQuery}"` : activeCategoryName}
          </h1>
          <p className="products-page__count">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        <div className="products-page__controls">
          <div className="products-page__categories">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`products-page__cat-chip${activeCategory === cat.id ? ' products-page__cat-chip--active' : ''}`}
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="products-page__sort">
            <label className="products-page__sort-label" htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              className="products-page__sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-az">Name: A to Z</option>
              <option value="name-za">Name: Z to A</option>
            </select>
          </div>
        </div>

        <div className="products-page__grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="products-page__empty">
              <div className="products-page__empty-icon"><Search size={48} /></div>
              <h3 className="products-page__empty-title">No products found</h3>
              <p className="products-page__empty-text">
                {searchQuery
                  ? `We couldn't find any medicines matching "${searchQuery}"`
                  : 'No products available in this category'}
              </p>
              <Link to="/products" className="products-page__empty-btn" onClick={() => setSearchParams({})}>
                <Package size={16} /> Browse All Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
