import { Link } from 'react-router-dom';
import { useToast } from './Toast';
import './Footer.css';

const Footer = () => {
  const { info } = useToast();
  
  const showInfo = (e, message, title) => {
    e.preventDefault();
    info(message, title);
  };

  return (
    <footer className="footer-1mg">
      <div className="footer-1mg__container">
        <h2>India's premier healthcare platform</h2>

        <div className="footer-links-grid">
          <div className="link-col">
            <h4>Know Us</h4>
            <Link to="#" onClick={(e) => showInfo(e, "ThisDat is India's leading online pharmacy and healthcare platform.", "About Us")}>About Us</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="#" onClick={(e) => showInfo(e, "We are currently not hiring. Please check back later.", "Careers")}>Careers</Link>
          </div>
          <div className="link-col">
            <h4>Our Policies</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms and Conditions</Link>
            <Link to="#" onClick={(e) => showInfo(e, "We offer a 7-day hassle-free return policy on most medicines.", "Return Policy")}>Return Policy</Link>
          </div>
          <div className="link-col">
            <h4>Our Services</h4>
            <Link to="/products">Order Medicines</Link>
          </div>
          <div className="link-col">
            <h4>Connect</h4>
            <p>Social Links</p>
            <div className="social-icons" style={{cursor: 'pointer'}} onClick={(e) => showInfo(e, "Follow our official handles on Facebook, Twitter, and Instagram!", "Social Media")}>
              <span>📘</span><span>🐦</span><span>📸</span><span>👔</span>
            </div>
          </div>
        </div>

        <div className="footer-badges">
          <div className="badge-item">
            <div className="icon">🛡️</div>
            <div className="text">
              <h5>Reliable</h5>
              <p>All products displayed on ThisDat are procured from verified and licensed pharmacies.</p>
            </div>
          </div>
          <div className="badge-item">
            <div className="icon">🔒</div>
            <div className="text">
              <h5>Secure</h5>
              <p>ThisDat uses Secure Sockets Layer (SSL) 128-bit encryption and is PCI DSS compliant.</p>
            </div>
          </div>
          <div className="badge-item">
            <div className="icon">💸</div>
            <div className="text">
              <h5>Affordable</h5>
              <p>Find affordable medicine substitutes, save up to 50% on health products.</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ThisDat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
