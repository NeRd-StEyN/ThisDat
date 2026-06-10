import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, ShieldCheck, Truck, Pill, Bike, CheckCircle } from 'lucide-react';
import './HeroBanner.css';

const heroBanners = [
  {
    tag: <><Pill size={16} style={{display: 'inline', verticalAlign: 'middle', marginRight: '4px'}} /> India's Trusted Online Pharmacy</>,
    title: "Your Health, Delivered at Your Doorstep",
    subtitle: "Browse 55+ medicines and request with ease. Just place your request and we'll handle the rest.",
    primaryAction: { text: "Browse Medicines", link: "/products", icon: Search },
    secondaryAction: { text: "View Capsules", link: "/products", icon: ArrowRight },
    bgClass: "hero-banner--variant-1"
  },
  {
    tag: <><Truck size={16} style={{display: 'inline', verticalAlign: 'middle', marginRight: '4px'}} /> Fast & Free Delivery</>,
    title: "Medicines at Your Door in Hours",
    subtitle: "We ensure fast and reliable delivery of all your healthcare essentials right to your doorstep.",
    primaryAction: { text: "Request Now", link: "/products", icon: Truck },
    secondaryAction: { text: "Track Request", link: "/profile", icon: ArrowRight },
    bgClass: "hero-banner--variant-2"
  },
  {
    tag: <><ShieldCheck size={16} style={{display: 'inline', verticalAlign: 'middle', marginRight: '4px'}} /> 100% Genuine Products</>,
    title: "Quality You Can Trust",
    subtitle: "All our medicines and health products are sourced from verified manufacturers and licensed pharmacies.",
    primaryAction: { text: "Shop Essentials", link: "/products", icon: ShieldCheck },
    secondaryAction: { text: "Need Help?", link: "/contact", icon: ArrowRight },
    bgClass: "hero-banner--variant-3"
  }
];

const HeroBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroBanners.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="hero-banner" id="hero-banner">
      <div 
        className="hero-banner-slider" 
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {heroBanners.map((item, index) => {
          const PrimaryIcon = item.primaryAction?.icon;
          const SecondaryIcon = item.secondaryAction?.icon;

          return (
            <div className={`hero-slide ${item.bgClass}`} key={index}>
              <div className="hero-banner__pattern" />
              
              <div className="hero-banner__content">
                <div className="hero-banner__tag">
                  {item.tag}
                </div>
                <h1 className="hero-banner__title">
                  {item.title}
                </h1>
                <p className="hero-banner__subtitle">
                  {item.subtitle}
                </p>
                <div className="hero-banner__actions">
                  <Link to={item.primaryAction.link} className="hero-banner__btn hero-banner__btn--primary">
                    {PrimaryIcon && <PrimaryIcon size={18} />} {item.primaryAction.text}
                  </Link>
                  {item.secondaryAction && (
                    <Link to={item.secondaryAction.link} className="hero-banner__btn hero-banner__btn--secondary">
                      {item.secondaryAction.text} {SecondaryIcon && <SecondaryIcon size={18} />}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hero-banner__dots">
        {heroBanners.map((_, index) => (
          <button 
            key={index} 
            className={`hero-dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
