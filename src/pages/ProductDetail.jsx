import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Star, ShieldCheck, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import ProductCard from '../components/ProductCard';
import { medicines, categories } from '../data/medicines';
import { formatPrice, calculateDiscount } from '../utils/helpers';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, updateQuantity, removeFromCart, getItemQuantity, isInCart } = useCart();
  const toast = useToast();
  const product = medicines.find(m => m.id === id);

  if (!product) {
    return (
      <div className="product-detail page-enter">
        <div className="container">
          <div className="product-detail__not-found">
            <div className="product-detail__not-found-icon">💊</div>
            <h2 className="product-detail__not-found-title">Product Not Found</h2>
            <p>The medicine you're looking for doesn't exist or has been removed.</p>
            <Link to="/products" className="product-detail__not-found-btn">
              <ArrowLeft size={16} /> Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categoryData = categories.find(c => c.id === product.category);
  const discount = calculateDiscount(product.price, product.discountPrice);
  const quantity = getItemQuantity(product.id);
  const inCart = isInCart(product.id);

  const relatedProducts = medicines
    .filter(m => m.category === product.category && m.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`, 'Added to Cart');
  };

  const handleIncrement = () => updateQuantity(product.id, quantity + 1);
  const handleDecrement = () => {
    if (quantity <= 1) removeFromCart(product.id);
    else updateQuantity(product.id, quantity - 1);
  };

  const savings = product.discountPrice ? product.price - product.discountPrice : 0;

  return (
    <div className="product-detail page-enter">
      <div className="container">
        <Link to="/products" className="product-detail__back">
          <ArrowLeft size={18} /> Back to Products
        </Link>

        <div className="product-detail__main">
          {/* Image */}
          <div className="product-detail__image-section">
            <div className="product-detail__image">
              {categoryData?.icon || '💊'}
            </div>
          </div>

          {/* Info */}
          <div className="product-detail__info">
            <div className="product-detail__badges">
              {discount > 0 && (
                <span className="product-detail__badge product-detail__badge--discount">
                  {discount}% OFF
                </span>
              )}
              {product.requiresPrescription && (
                <span className="product-detail__badge product-detail__badge--rx">
                  <ShieldCheck size={12} /> Prescription Required
                </span>
              )}
              {product.inStock && (
                <span className="product-detail__badge product-detail__badge--instock">
                  <Check size={12} /> In Stock
                </span>
              )}
            </div>

            <h1 className="product-detail__name">{product.name}</h1>
            <p className="product-detail__manufacturer">{product.manufacturer}</p>

            {product.rating && (
              <div className="product-detail__rating">
                <span className="product-detail__rating-badge">
                  <Star size={14} fill="white" /> {product.rating}
                </span>
                <span className="product-detail__rating-text">
                  {product.reviewCount?.toLocaleString()} ratings
                </span>
              </div>
            )}

            <div className="product-detail__price-section">
              <span className="product-detail__price">
                {formatPrice(product.discountPrice || product.price)}
              </span>
              {discount > 0 && (
                <>
                  <span className="product-detail__price--original">
                    {formatPrice(product.price)}
                  </span>
                  <span className="product-detail__price-save">
                    You save {formatPrice(savings)}
                  </span>
                </>
              )}
            </div>

            <div className="product-detail__meta">
              <div className="product-detail__meta-item">
                <span className="product-detail__meta-label">Pack Size</span>
                <span className="product-detail__meta-value">{product.packSize}</span>
              </div>
              <div className="product-detail__meta-item">
                <span className="product-detail__meta-label">Form</span>
                <span className="product-detail__meta-value">{product.dosageForm}</span>
              </div>
              <div className="product-detail__meta-item">
                <span className="product-detail__meta-label">Category</span>
                <span className="product-detail__meta-value">{categoryData?.name || product.category}</span>
              </div>
              <div className="product-detail__meta-item">
                <span className="product-detail__meta-label">Availability</span>
                <span className="product-detail__meta-value" style={{ color: product.inStock ? 'var(--color-success)' : 'var(--color-error)' }}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="product-detail__actions">
              {product.inStock && (
                inCart ? (
                  <div className="product-detail__qty-controls">
                    <button className="product-detail__qty-btn" onClick={handleDecrement}>
                      <Minus size={18} />
                    </button>
                    <span className="product-detail__qty-value">{quantity}</span>
                    <button className="product-detail__qty-btn" onClick={handleIncrement}>
                      <Plus size={18} />
                    </button>
                  </div>
                ) : (
                  <button className="product-detail__add-btn product-detail__add-btn--primary" onClick={handleAddToCart} id="add-to-cart-btn">
                    <ShoppingCart size={20} /> Add to Cart
                  </button>
                )
              )}
            </div>

            <div className="product-detail__description">
              <h3 className="product-detail__desc-title">Description</h3>
              <p className="product-detail__desc-text">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="product-detail__related">
            <h2 className="product-detail__related-title">Related Products</h2>
            <div className="product-detail__related-grid">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
