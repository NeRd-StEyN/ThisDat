import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import './HeroBanner.css';

const HeroBanner = () => {
  return (
    <section className="hero-banner" id="hero-banner">
      <div className="hero-banner__overlay" />
      <div className="hero-banner__pattern" />
      <div className="hero-banner__content">
        <div className="hero-banner__tag">
          💊 India's Trusted Online Pharmacy
        </div>
        <h1 className="hero-banner__title">
          Your Health, Delivered at Your Doorstep
        </h1>
        <p className="hero-banner__subtitle">
          Browse 55+ medicines, get great discounts, and order with ease. No payment hassles — just place your order and we'll handle the rest.
        </p>
        <div className="hero-banner__actions">
          <Link to="/products" className="hero-banner__btn hero-banner__btn--primary">
            <Search size={18} /> Browse Medicines
          </Link>
          <Link to="/products?category=vitamins" className="hero-banner__btn hero-banner__btn--secondary">
            Explore Vitamins <ArrowRight size={18} />
          </Link>
        </div>
      </div>
      <div className="hero-banner__floating">💊</div>
    </section>
  );
};

export default HeroBanner;
