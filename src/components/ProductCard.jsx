import { Link } from 'react-router-dom';
import { Plus, Minus, Star, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import { categories } from '../data/medicines';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);
  const discount = calculateDiscount(product.price, product.discountPrice);
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
    <div className={`product-card${!product.inStock ? ' product-card--out-of-stock' : ''}`} id={`product-${product.id}`}>
      <Link to={`/product/${product.id}`} className="product-card__link">
        <div className="product-card__image-wrap">
          <span className="product-card__image-placeholder">
            {categoryData?.icon || '💊'}
          </span>
          <div className="product-card__badges">
            {discount > 0 && (
              <span className="product-card__badge product-card__badge--discount">
                {discount}% OFF
              </span>
            )}
            {product.requiresPrescription && (
              <span className="product-card__badge product-card__badge--rx">
                <ShieldCheck size={10} /> Rx
              </span>
            )}
          </div>
        </div>
        <div className="product-card__body">
          <h3 className="product-card__name">{product.name}</h3>
          <p className="product-card__manufacturer">{product.manufacturer}</p>
          <p className="product-card__pack">{product.packSize}</p>
          {product.rating && (
            <div className="product-card__rating">
              <span className="product-card__rating-badge">
                <Star size={10} fill="currentColor" /> {product.rating}
              </span>
              <span className="product-card__rating-count">
                ({product.reviewCount?.toLocaleString()})
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="product-card__footer">
        <div className="product-card__price-wrap">
          <span className="product-card__price">
            {formatPrice(product.discountPrice || product.price)}
          </span>
          {discount > 0 && (
            <span className="product-card__price--original">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {!product.inStock ? (
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
