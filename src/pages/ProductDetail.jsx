import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ShieldCheck, User, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import { products as medicines, categories } from '../data/products';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, updateQuantity, removeFromCart, getItemQuantity, isInCart } = useCart();
  const toast = useToast();
  const [imgError, setImgError] = useState(false);

  const product = medicines.find(m => m.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="pd-page">
        <div className="pd-container">
          <div className="pd-not-found">
            <h2>Product Not Found</h2>
            <Link to="/products" className="pd-back-link">
              <ArrowLeft size={16} /> Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categoryData = categories.find(c => c.id === product.category);
  const quantity = getItemQuantity(product.id);
  const inCart = isInCart(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart`, 'Added to Cart');
  };

  const handleIncrement = () => updateQuantity(product.id, quantity + 1);
  const handleDecrement = () => {
    if (quantity <= 1) removeFromCart(product.id);
    else updateQuantity(product.id, quantity - 1);
  };

  // Generate some tags from name/specifications for the tags section
  const productTags = [
    categoryData?.name || product.category || 'Product',
    ...(product.tags || []),
    product.specifications?.['Packing'] ? product.specifications['Packing'].split(' ')[0] : ''
  ].filter(Boolean).slice(0, 6);

  return (
    <div className="pd-page">
      <div className="pd-container">
        
        {/* Breadcrumbs */}
        <div className="pd-breadcrumbs">
          <Link to="/">Home</Link> / <Link to="/products">Products</Link> /{' '}
          <Link to={`/products?category=${product.category}`}>{categoryData?.name || product.category}</Link> /{' '}
          <span className="pd-breadcrumb-active">{product.name}</span>
        </div>

        {/* Back Button */}
        <div className="pd-back-wrapper">
          <Link to="/products" className="pd-back-btn">
            <ArrowLeft size={16} /> Back
          </Link>
        </div>

        {/* Main Grid */}
        <div className="pd-grid">
          
          {/* Left Column: Image */}
          <div className="pd-image-col">
            <div className="pd-image-wrapper">
              {product.image && !imgError ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="pd-image-placeholder">
                  {product.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="pd-info-col">
            <div className="pd-category-label">
              {categoryData?.name || product.category || 'Medicine'}
            </div>
            
            <h1 className="pd-title">{product.name}</h1>
            
            <p className="pd-description">
              {product.description}
            </p>

            {/* Action Box */}
            <div className="pd-action-card">
              <div className="pd-price-row">
                <span className="pd-price">
                  {typeof product.price === 'string' ? product.price : `₹${product.price.toFixed(2)}`}
                </span>
                <span className="pd-tax-info">inclusive of all taxes</span>
              </div>

              {/* Quantity / Pack Info inside the action box cleanly */}
              <div className="pd-action-controls">
                <div className="pd-pack-info">
                  <span className="pd-pack-label">Pack Size</span>
                  <span className="pd-pack-value">{product.specifications?.['Packing'] || `1 ${product.dosageForm || 'Unit'}`}</span>
                </div>
                
                {product.inStock !== false ? (
                  inCart ? (
                    <div className="pd-qty-widget">
                      <button className="pd-qty-btn" onClick={handleDecrement}><Minus size={16} /></button>
                      <span className="pd-qty-num">{quantity}</span>
                      <button className="pd-qty-btn" onClick={handleIncrement}><Plus size={16} /></button>
                    </div>
                  ) : (
                    <button className="pd-add-btn" onClick={handleAddToCart}>
                      Add to Cart
                    </button>
                  )
                ) : (
                  <button className="pd-add-btn pd-add-btn--disabled" disabled>
                    Out of Stock
                  </button>
                )}
              </div>
              
              {product.requiresPrescription && (
                <div className="pd-prescription-req">
                  <ShieldCheck size={16} /> Valid prescription required
                </div>
              )}
            </div>

            {/* Tags row */}
            <div className="pd-tags-row">
              {productTags.map((tag, idx) => (
                <span key={idx} className="pd-tag">
                  <Tag size={12} /> {tag.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stacked Details Sections */}
        <div className="pd-details-stack">
          
          <div className="pd-section">
            <h2 className="pd-section-title">Key Benefits</h2>
            <div className="pd-section-box">
              {product.benefits && product.benefits.length > 0 ? (
                <ul className="pd-list">
                  {product.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              ) : (
                <p className="pd-text">
                  Treatment of {product.tags?.[0] || 'symptoms'}. 
                  {product.specifications?.['Indications'] && ` ${product.specifications['Indications']}`}
                </p>
              )}
            </div>
          </div>

          <div className="pd-section">
            <h2 className="pd-section-title">Specifications</h2>
            <div className="pd-spec-table">
              <div className="pd-spec-row">
                <div className="pd-spec-label">Product Type</div>
                <div className="pd-spec-value">{categoryData?.name || product.category || 'Medicine'}</div>
              </div>
              <div className="pd-spec-row">
                <div className="pd-spec-label">Packing</div>
                <div className="pd-spec-value">{product.specifications?.['Packing'] || `1 ${product.dosageForm || 'Unit'}`}</div>
              </div>
              {Object.entries(product.specifications || {}).filter(([key]) => key !== 'Packing').map(([key, value]) => (
                <div className="pd-spec-row" key={key}>
                  <div className="pd-spec-label">{key}</div>
                  <div className="pd-spec-value">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Expert Review Styled like Specifications */}
          <div className="pd-section">
            <h2 className="pd-section-title">Expert Verification</h2>
            <div className="pd-expert-box">
              <div className="pd-expert-profile">
                <div className="pd-expert-avatar"><User size={20}/></div>
                <div className="pd-expert-info">
                  <h4>Written By</h4>
                  <p>Dr. Medical Expert</p>
                </div>
              </div>
              <div className="pd-expert-profile">
                <div className="pd-expert-avatar"><User size={20}/></div>
                <div className="pd-expert-info">
                  <h4>Reviewed By</h4>
                  <p>Dr. Senior Doctor</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
