import { Link } from 'react-router-dom';
import { Shield, Truck, Award } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer__inner">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon">TD</div>
              <span className="footer__logo-text">ThisDat</span>
            </div>
            <p className="footer__description">
              Your trusted online pharmacy. Browse genuine medicines, get great discounts, and have them delivered right to your doorstep.
            </p>
            <div className="footer__trust-badges">
              <div className="footer__trust-badge">
                <Shield size={16} className="footer__trust-badge-icon" />
                100% Genuine
              </div>
              <div className="footer__trust-badge">
                <Truck size={16} className="footer__trust-badge-icon" />
                Fast Delivery
              </div>
              <div className="footer__trust-badge">
                <Award size={16} className="footer__trust-badge-icon" />
                Best Prices
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer__section-title">Quick Links</h4>
            <nav className="footer__links">
              <Link to="/" className="footer__link">Home</Link>
              <Link to="/products" className="footer__link">All Medicines</Link>
              <Link to="/cart" className="footer__link">Cart</Link>
              <Link to="/profile" className="footer__link">My Account</Link>
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h4 className="footer__section-title">Categories</h4>
            <nav className="footer__links">
              <Link to="/products?category=pain-relief" className="footer__link">Pain Relief</Link>
              <Link to="/products?category=cold-flu" className="footer__link">Cold & Flu</Link>
              <Link to="/products?category=vitamins" className="footer__link">Vitamins</Link>
              <Link to="/products?category=diabetes" className="footer__link">Diabetes Care</Link>
              <Link to="/products?category=skin-care" className="footer__link">Skin Care</Link>
              <Link to="/products?category=digestive" className="footer__link">Digestive Health</Link>
            </nav>
          </div>

          {/* Info */}
          <div>
            <h4 className="footer__section-title">Information</h4>
            <nav className="footer__links">
              <span className="footer__link">About Us</span>
              <span className="footer__link">Privacy Policy</span>
              <span className="footer__link">Terms of Use</span>
              <span className="footer__link">Contact Us</span>
              <span className="footer__link">FAQs</span>
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {new Date().getFullYear()} ThisDat. All rights reserved.
          </p>
          <p className="footer__disclaimer">
            Disclaimer: The information on this site is not intended as medical advice. Always consult a qualified healthcare professional before taking any medication.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
