import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, CheckCircle, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import { medicines, categories } from '../data/medicines';
import { calculateDiscount } from '../utils/helpers';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, updateQuantity, removeFromCart, getItemQuantity, isInCart } = useCart();
  const toast = useToast();
  const [activeSection, setActiveSection] = useState('overview');

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
  const discount = calculateDiscount(product.price, product.discountPrice);
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
                <span className="product-detail__meta-label">MARKETER</span>
                <Link to="#" className="product-detail__meta-value">{product.manufacturer}</Link>
              </div>
              <div className="product-detail__meta-item">
                <span className="product-detail__meta-label">SALT COMPOSITION</span>
                <span className="product-detail__meta-value product-detail__meta-value--black">
                  {product.tags?.[0] ? product.tags[0].charAt(0).toUpperCase() + product.tags[0].slice(1) : 'Active Ingredients'} (Standard w/w)
                </span>
              </div>
              <div className="product-detail__meta-item">
                <span className="product-detail__meta-label">STORAGE</span>
                <span className="product-detail__meta-value product-detail__meta-value--black">Store below 30°C</span>
              </div>
            </div>

            <div className="product-detail__image-container">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <div className="product-detail__image-placeholder">{categoryData?.icon || '💊'}</div>
              )}
            </div>

            <div className="product-detail__alert-banner">
              <div className="product-detail__alert-text">
                <CheckCircle size={16} />
                24% cheaper alternative available with same salt composition
              </div>
              <Link to="#" style={{color: '#ff6f61', fontSize: '12px', fontWeight: '700', textDecoration: 'none'}}>View substitutes</Link>
            </div>

            <div id="overview" className="product-detail__section">
              <h2>PRODUCT INTRODUCTION</h2>
              <p>{product.description}</p>
              <p>{product.name} is used in the treatment of conditions related to {categoryData?.name?.toLowerCase()}. It helps relieve symptoms effectively and safely when used as directed.</p>
              <p>Some of the common side effects may include mild allergic reactions or skin peeling if used topically. If the side effects bother you or do not go away, let your doctor know.</p>
            </div>

            <div id="uses" className="product-detail__section">
              <h2>USES OF {product.name.toUpperCase()}</h2>
              <ul>
                <li>Treatment of {product.tags?.[0] || 'symptoms'}</li>
                <li>Management of {categoryData?.name?.toLowerCase()}</li>
              </ul>
            </div>

            <div className="product-detail__section">
              <h2>BENEFITS OF {product.name.toUpperCase()}</h2>
              <p>In treatment of {categoryData?.name?.toLowerCase()}:<br/>
              {product.name} is an effective medicine. It kills and prevents the growth of the condition-causing elements. This relieves the symptoms caused by the issue. You should keep using it for as long as it is prescribed even if your symptoms have gone. This will prevent the issue from coming back.</p>
            </div>

            <div id="how-to-use" className="product-detail__section">
              <h2>HOW TO USE {product.name.toUpperCase()}</h2>
              <p>
                {product.dosageForm === 'Tablet' || product.dosageForm === 'Capsule' ? 'Take this medicine in the dose and duration as advised by your doctor. Swallow it as a whole. Do not chew, crush or break it.' :
                 product.dosageForm === 'Syrup' ? 'Take this medicine in the dose and duration as advised by your doctor. Check the label for directions before use. Measure it with a measuring cup and take it by mouth. Shake well before use.' :
                 product.dosageForm === 'Cream' || product.dosageForm === 'Lotion' || product.dosageForm === 'Spray' ? 'This medicine is for external use only. Use it in the dose and duration as advised by your doctor. Check the label for directions before use. Clean and dry the affected area and apply the medicine.' :
                 product.dosageForm === 'Eye Drop' ? 'This medicine is for external use only. Use it in the dose and duration as advised by your doctor. Check the label for directions before use. Hold the dropper close to the eye without touching it. Gently squeeze the dropper and place the medicine inside the lower eyelid.' :
                 'Use this medicine in the dose and duration as advised by your doctor. Check the label for directions before use.'}
              </p>
            </div>

            <div id="safety" className="product-detail__section">
              <h2>SAFETY ADVICE</h2>
              <ul>
                <li>Read the label carefully before use.</li>
                <li>Store in a cool and dry place away from direct sunlight.</li>
                <li>Keep out of reach of children.</li>
                {product.requiresPrescription && <li><strong>Prescription Required:</strong> Do not exceed the recommended dosage without consulting a doctor.</li>}
              </ul>
            </div>

          </div>

          {/* --- Right Sidebar (Action/Price) --- */}
          <div className="product-detail__sidebar-right">
            
            <div className="product-detail__price-card">
              {discount > 0 && (
                <div className="product-detail__mrp-row">
                  <span className="product-detail__mrp-label">MRP</span>
                  <span className="product-detail__mrp-value">₹{product.price.toFixed(2)}</span>
                  <span className="product-detail__discount-badge">{discount}% OFF</span>
                </div>
              )}
              
              <div className="product-detail__current-price-row">
                <span className="product-detail__price-symbol">₹</span>
                <span className="product-detail__price-value">
                  {(product.discountPrice || product.price).toFixed(2)}
                </span>
              </div>
              
              <div className="product-detail__tax-info">
                inclusive of all taxes
              </div>

              <select className="product-detail__pack-selector" defaultValue="1">
                <option value="1">1 {product.dosageForm} - {product.packSize}</option>
                <option value="2">2 {product.dosageForm}s - {parseInt(product.packSize) * 2 || 'Double'}</option>
              </select>

              {product.inStock ? (
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

              <div className="product-detail__delivery-info">
                <div className="product-detail__delivery-title">Get in 60 minutes</div>
                <div className="product-detail__delivery-desc">
                  Delivering to: <span style={{fontWeight: '700', color: '#212121'}}>110020, New Delhi </span>
                </div>
              </div>
            </div>

            {/* Generic alternative card placeholder */}
            <div style={{background: '#eefbee', border: '1px solid #c9e7c9', borderRadius: '4px', padding: '16px', marginBottom: '16px'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                <span style={{background: '#1aab2a', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'}}>₹</span>
                <span style={{fontSize: '13px', fontWeight: '700', color: '#212121'}}>Generic alternative available<br/><span style={{fontWeight: '400', color: '#1aab2a'}}>with 24% savings</span></span>
              </div>
              <button style={{width: '100%', background: 'white', border: '1px solid #1aab2a', color: '#1aab2a', padding: '8px', borderRadius: '4px', fontSize: '13px', fontWeight: '700', cursor: 'pointer'}}>
                View alternative
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
