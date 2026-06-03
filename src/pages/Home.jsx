import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, BadgePercent, Clock, Pill } from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { medicines, categories } from '../data/medicines';
import './Home.css';

const Home = () => {
  const featuredProducts = medicines.filter(m => m.rating >= 4.4).slice(0, 8);
  const dealsProducts = medicines
    .filter(m => m.discountPrice && m.discountPrice < m.price)
    .sort((a, b) => {
      const discA = ((a.price - a.discountPrice) / a.price) * 100;
      const discB = ((b.price - b.discountPrice) / b.price) * 100;
      return discB - discA;
    })
    .slice(0, 8);

  return (
    <div className="home-page page-enter">
      <div className="container">
        {/* Hero Banner */}
        <section className="home-page__hero">
          <HeroBanner />
        </section>

        {/* Categories */}
        <section className="home-section" id="categories-section">
          <div className="home-section__header">
            <div>
              <h2 className="home-section__title">Shop by Category</h2>
              <p className="home-section__subtitle">Find the right medicine for your needs</p>
            </div>
            <Link to="/products" className="home-section__link">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="home-categories__grid">
            {categories.map(cat => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        {/* Offer Banner */}
        <section className="home-offer" id="offer-banner">
          <div className="home-offer__content">
            <span className="home-offer__tag">🔥 LIMITED OFFER</span>
            <h3 className="home-offer__title">Up to 25% OFF on Vitamins</h3>
            <p className="home-offer__desc">Boost your immunity with premium supplements at unbeatable prices</p>
          </div>
          <Link to="/products?category=vitamins" className="home-offer__btn">
            Shop Now <ArrowRight size={16} />
          </Link>
        </section>

        {/* Featured Products */}
        <section className="home-section" id="featured-section">
          <div className="home-section__header">
            <div>
              <h2 className="home-section__title">⭐ Top Rated Products</h2>
              <p className="home-section__subtitle">Highest rated by our customers</p>
            </div>
            <Link to="/products" className="home-section__link">
              See All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="home-products__grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Best Deals */}
        <section className="home-section" id="deals-section">
          <div className="home-section__header">
            <div>
              <h2 className="home-section__title">🏷️ Best Deals</h2>
              <p className="home-section__subtitle">Maximum savings on popular medicines</p>
            </div>
            <Link to="/products" className="home-section__link">
              See All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="home-products__grid">
            {dealsProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Trust Section */}
        <section className="home-trust" id="trust-section">
          <h2 className="home-trust__title">Why Choose ThisDat?</h2>
          <div className="home-trust__grid">
            <div className="home-trust__item">
              <div className="home-trust__icon">
                <Shield size={28} />
              </div>
              <h3 className="home-trust__item-title">100% Genuine</h3>
              <p className="home-trust__item-desc">
                All medicines are sourced from licensed pharmacies and verified suppliers
              </p>
            </div>
            <div className="home-trust__item">
              <div className="home-trust__icon">
                <BadgePercent size={28} />
              </div>
              <h3 className="home-trust__item-title">Best Prices</h3>
              <p className="home-trust__item-desc">
                Get up to 25% off on your favorite medicines and health products
              </p>
            </div>
            <div className="home-trust__item">
              <div className="home-trust__icon">
                <Truck size={28} />
              </div>
              <h3 className="home-trust__item-title">Fast Delivery</h3>
              <p className="home-trust__item-desc">
                Reliable delivery right to your doorstep with real-time tracking
              </p>
            </div>
            <div className="home-trust__item">
              <div className="home-trust__icon">
                <Clock size={28} />
              </div>
              <h3 className="home-trust__item-title">Easy Ordering</h3>
              <p className="home-trust__item-desc">
                Simple checkout with order confirmation sent directly to your email
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
