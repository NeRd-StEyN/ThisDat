import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Star, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import { categories } from '../data/products';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [imgError, setImgError] = useState(false);
  const { addToCart, removeFromCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);
  const categoryData = categories.find(c => c.id === product.category);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity <= 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  };

  return (
    <div className={`product-card${product.inStock === false ? ' product-card--out-of-stock' : ''}`} id={`product-${product.id}`}>
      <Link to={`/product/${product.id}`} className="product-card__link">
        <div className="product-card__image-wrap">
          {product.image && !imgError ? (
            <img 
              src={product.image} 
              alt={product.name} 
              loading="lazy"
              className="product-card__image" 
              style={{width: '100%', height: '100%', objectFit: 'contain'}} 
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="product-card__image-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', borderRadius: '4px', width: '100%', height: '100%' }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#ccc' }}>{product.name.charAt(0)}</span>
            </span>
          )}
          <div className="product-card__badges">
            {product.requiresPrescription && (
              <span className="product-card__badge product-card__badge--rx">
                <ShieldCheck size={10} /> Rx
              </span>
            )}
          </div>
        </div>
        <div className="product-card__body">
          <h3 className="product-card__name">{product.name}</h3>
          {product.specifications?.['Product Type'] && <p className="product-card__manufacturer">{product.specifications['Product Type']}</p>}
          <p className="product-card__pack">{product.specifications?.['Packing'] || product.category}</p>
        </div>
      </Link>

      <div className="product-card__footer">
        <div className="product-card__price-wrap">
          <span className="product-card__price">
            {formatPrice(product.price)}
          </span>
        </div>

        {product.inStock === false ? (
          <span className="product-card__oos-label">Out of Stock</span>
        ) : quantity > 0 ? (
          <div className="product-card__qty-controls">
            <button className="product-card__qty-btn" onClick={handleDecrement} aria-label="Decrease quantity">
              <Minus size={14} />
            </button>
            <span className="product-card__qty-value">{quantity}</span>
            <button className="product-card__qty-btn" onClick={handleIncrement} aria-label="Increase quantity">
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button className="product-card__add-btn product-card__add-btn--add" onClick={handleAdd} aria-label="Add to cart">
            <Plus size={14} /> Add
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
