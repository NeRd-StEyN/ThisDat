import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import { medicines, categories } from '../data/medicines';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, updateQuantity, removeFromCart, getItemQuantity, isInCart } = useCart();
  const toast = useToast();
  const [activeSection, setActiveSection] = useState('overview');
  const [imgError, setImgError] = useState(false);

  const product = medicines.find(m => m.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="product-detail page-enter">
        <div className="container">
          <div className="product-detail__not-found" style={{textAlign: 'center', padding: '100px 0'}}>
            <h2 style={{fontSize: '24px', marginBottom: '16px'}}>Product Not Found</h2>
            <Link to="/products" style={{color: '#ff6f61', fontWeight: 'bold'}}>
              <ArrowLeft size={16} style={{display: 'inline', verticalAlign: 'middle'}}/> Back to Products
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

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="product-detail page-enter">
      <div className="container">
        
        <div className="product-detail__breadcrumbs">
          <Link to="/" style={{color: '#666', textDecoration: 'none'}}>Home</Link> &gt;{' '}
          <Link to="/products" style={{color: '#666', textDecoration: 'none'}}>Medicines</Link> &gt;{' '}
          <span style={{color: '#212121'}}>{product.name}</span>
        </div>

        <div className="product-detail__layout">
          
          {/* --- Left Sidebar (Navigation) --- */}
          <div className="product-detail__sidebar-left">
            <ul className="product-detail__nav-menu">
              <li 
                className={`product-detail__nav-item ${activeSection === 'overview' ? 'product-detail__nav-item--active' : ''}`}
                onClick={() => scrollToSection('overview')}
              >
                Overview
              </li>
              <li 
                className={`product-detail__nav-item ${activeSection === 'uses' ? 'product-detail__nav-item--active' : ''}`}
                onClick={() => scrollToSection('uses')}
              >
                Uses and benefits
              </li>
              <li 
                className={`product-detail__nav-item ${activeSection === 'how-to-use' ? 'product-detail__nav-item--active' : ''}`}
                onClick={() => scrollToSection('how-to-use')}
              >
                How to use
              </li>
              <li 
                className={`product-detail__nav-item ${activeSection === 'safety' ? 'product-detail__nav-item--active' : ''}`}
                onClick={() => scrollToSection('safety')}
              >
                Safety advice
              </li>
            </ul>

            <div className="product-detail__author-box">
              <div className="product-detail__author-title">Author Details</div>
              <div className="product-detail__author-profile">
                <div className="product-detail__author-img">👩‍⚕️</div>
                <div className="product-detail__author-info">
                  <h4>Written By</h4>
                  <p>Dr. Medical Expert</p>
                </div>
              </div>
              <div className="product-detail__author-profile">
                <div className="product-detail__author-img">👨‍⚕️</div>
                <div className="product-detail__author-info">
                  <h4>Reviewed By</h4>
                  <p>Dr. Senior Doctor</p>
                </div>
              </div>
            </div>
          </div>

          {/* --- Main Content (Center) --- */}
          <div className="product-detail__main">
            <h1 className="product-detail__title">{product.name} | For {categoryData?.name}</h1>
            
            <div className="product-detail__meta-row">
              <div className="product-detail__meta-item">
                <span className="product-detail__meta-label">CATEGORY</span>
                <Link to={`/products?category=${product.category}`} className="product-detail__meta-value">{categoryData?.name || product.category}</Link>
              </div>
              <div className="product-detail__meta-item">
                <span className="product-detail__meta-label">PACKING</span>
                <span className="product-detail__meta-value product-detail__meta-value--black">
                  {product.specifications?.['Packing'] || 'Standard Pack'}
                </span>
              </div>
              <div className="product-detail__meta-item">
                <span className="product-detail__meta-label">STATUS</span>
                <span className="product-detail__meta-value product-detail__meta-value--black">
                  {product.specifications?.['Status'] || 'Available'}
                </span>
              </div>
            </div>

            <div className="product-detail__image-container">
              {product.image && !imgError ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  style={{width: '100%', height: '100%', objectFit: 'contain', maxHeight: '400px'}} 
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="product-detail__image-placeholder">{categoryData?.icon || '💊'}</div>
              )}
            </div>



            <div id="overview" className="product-detail__section">
              <h2>PRODUCT INTRODUCTION</h2>
              <p>{product.description}</p>
            </div>

            <div id="uses" className="product-detail__section">
              <h2>USES OF {product.name.toUpperCase()}</h2>
              <ul>
                <li>Treatment of {product.tags?.[0] || 'symptoms'}</li>
                {product.specifications?.['Indications'] && <li>{product.specifications['Indications']}</li>}
              </ul>
            </div>

            <div className="product-detail__section">
              <h2>BENEFITS OF {product.name.toUpperCase()}</h2>
              {product.benefits && product.benefits.length > 0 ? (
                <ul>
                  {product.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              ) : (
                <p>Refer to the composition for therapeutic benefits.</p>
              )}
            </div>

            <div id="how-to-use" className="product-detail__section">
              <h2>HOW TO USE {product.name.toUpperCase()}</h2>
              <p>
                {product.specifications?.['Usage Instructions'] || 'Use under medical guidance. Check the label for directions before use.'}
              </p>
              {product.specifications?.['Dosage - Adults'] && (
                <p><strong>Adults:</strong> {product.specifications['Dosage - Adults']}</p>
              )}
              {product.specifications?.['Dosage - Children'] && (
                <p><strong>Children:</strong> {product.specifications['Dosage - Children']}</p>
              )}
            </div>

            <div id="safety" className="product-detail__section">
              <h2>SAFETY ADVICE</h2>
              <ul>
                <li>{product.specifications?.['Precautions'] || 'Consult your doctor before use'}</li>
                <li>{product.specifications?.['Storage'] || 'Store in a cool and dry place away from direct sunlight.'}</li>
                <li>{product.specifications?.['Disclaimer'] || 'Read the label carefully before use.'}</li>
                <li>{product.specifications?.['Possible Side Effects'] || 'Keep out of reach of children.'}</li>
              </ul>
            </div>

          </div>

          {/* --- Right Sidebar (Action/Price) --- */}
          <div className="product-detail__sidebar-right">
            
            <div className="product-detail__price-card">
              <div className="product-detail__current-price-row">
                <span className="product-detail__price-value" style={{fontSize: '24px'}}>
                  {typeof product.price === 'string' ? product.price : `₹${product.price.toFixed(2)}`}
                </span>
              </div>
              
              <div className="product-detail__tax-info">
                inclusive of all taxes
              </div>

              <select className="product-detail__pack-selector" defaultValue="1">
                <option value="1">1 {product.dosageForm || 'Unit'} - {product.specifications?.['Packing'] || 'Standard'}</option>
                <option value="2">2 {product.dosageForm || 'Unit'}s - Multi-pack</option>
              </select>

              {product.inStock !== false ? (
                inCart ? (
                  <div className="product-detail__qty-widget">
                    <button className="product-detail__qty-btn" onClick={handleDecrement}>
                      <Minus size={18} />
                    </button>
                    <span className="product-detail__qty-number">{quantity}</span>
                    <button className="product-detail__qty-btn" onClick={handleIncrement}>
                      <Plus size={18} />
                    </button>
                  </div>
                ) : (
                  <button className="product-detail__btn-add" onClick={handleAddToCart}>
                    Add to cart
                  </button>
                )
              ) : (
                <button className="product-detail__btn-add" style={{background: '#ccc', cursor: 'not-allowed'}} disabled>
                  Out of Stock
                </button>
              )}
              
              {product.requiresPrescription && (
                <div style={{marginTop: '16px', fontSize: '11px', color: '#767676', display: 'flex', alignItems: 'center', gap: '4px'}}>
                  <ShieldCheck size={14} color="#ff6f61"/> Valid prescription required
                </div>
              )}


            </div>



          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
