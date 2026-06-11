import { useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Headset, Search, FileText, CheckCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import HeroBanner from '../components/HeroBanner';
import { products as medicines, categories } from '../data/products';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const featuredProducts = useMemo(() => {
    return [...medicines].sort(() => 0.5 - Math.random()).slice(0, 6);
  }, []);

  // Intersection Observer for scroll animations
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="home-1mg page-enter">
      {/* Top Banner Row */}
      <div style={{ maxWidth: '1440px', margin: '16px auto', padding: '0 16px' }}>
        <HeroBanner />
      </div>

      {/* Trust Signals Banner */}
      <section className="home-1mg__trust-banner scroll-animate">
        <div className="trust-grid">
          <div className="trust-item">

            <div className="trust-text">
              <h3>100% Genuine</h3>
              <p>Authentic medicines</p>
            </div>
          </div>
          <div className="trust-item">

            <div className="trust-text">
              <h3>Fast Delivery</h3>
              <p>To your doorstep</p>
            </div>
          </div>
          <div className="trust-item">

            <div className="trust-text">
              <h3>24/7 Support</h3>
              <p>Always here for you</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="home-1mg__how-it-works scroll-animate">
        <div className="section-header center">
          <h2>How It Works</h2>
          <p>Get your healthcare essentials in three simple steps</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

              <span className="step-number">1</span>
            </div>
            <h3>Search Medicines</h3>
            <p>Find your prescribed medicines or browse health products.</p>
          </div>
          <div className="step-arrow"><ArrowRight size={24} /></div>
          <div className="step-card">
            <div className="step-icon-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

              <span className="step-number">2</span>
            </div>
            <h3>Add Details</h3>
            <p>Provide delivery address and quickly confirm your request.</p>
          </div>
          <div className="step-arrow"><ArrowRight size={24} /></div>
          <div className="step-card">
            <div className="step-icon-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

              <span className="step-number">3</span>
            </div>
            <h3>Fast Delivery</h3>
            <p>Receive your authentic medicines quickly at your doorstep.</p>
          </div>
        </div>
      </section>

      {/* Shop by Categories */}
      <section className="home-1mg__categories-section scroll-animate">
        <div className="section-header">
          <h2>Shop by Category</h2>
        </div>
        <div className="categories-grid">
          {categories.filter(c => c.id !== 'All Categories').map(cat => (
            <div 
              key={cat.id} 
              className="category-card" 
              onClick={() => navigate(`/products?category=${encodeURIComponent(cat.id)}`)}
            >
              <h3>{cat.name}</h3>
              <div className="category-card-hover">
                <span>Explore</span> <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="home-1mg__featured-section scroll-animate">
        <div className="section-header flex-between">
          <h2>Featured Products</h2>
          <Link to="/products" className="view-all-btn">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
