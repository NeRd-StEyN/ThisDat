import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, MapPin, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SearchBar from './SearchBar';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getItemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const itemCount = getItemCount();

  const handleLogout = async () => {
    try {
      await logout();
      setMobileOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="header" id="main-header">
      {/* Top Strip (Desktop Only) */}
      <div className="header__top-strip">
        <div className="container header__top-inner">
          <div className="header__top-links">
            <Link to="/products" className="header__top-link header__top-link--active">MEDICINES</Link>
            <Link to="/products" className="header__top-link">LAB TESTS <span className="header__safe-badge">SAFE</span></Link>
            <Link to="/products" className="header__top-link">CONSULT DOCTORS</Link>
            <Link to="/products" className="header__top-link">COVID-19</Link>
            <Link to="/products" className="header__top-link">AYURVEDA</Link>
            <Link to="/products" className="header__top-link">CARE PLAN <span className="header__save-badge">SAVE MORE</span></Link>
          </div>
          <div className="header__top-actions">
            {isAuthenticated ? (
              <div className="header__auth-group">
                <Link to="/profile" className="header__auth-link">{user.displayName || user.email?.split('@')[0]}</Link>
                <span className="header__divider">|</span>
                <button onClick={handleLogout} className="header__auth-link">Logout</button>
              </div>
            ) : (
              <div className="header__auth-group">
                <Link to="/login" className="header__auth-link">Login</Link>
                <span className="header__divider">|</span>
                <Link to="/signup" className="header__auth-link">Sign Up</Link>
              </div>
            )}
            <Link to="/offers" className="header__auth-link header__offers-link">Offers</Link>
          </div>
        </div>
      </div>

      {/* Main Header (Logo, Location, Search, Cart) */}
      <div className="header__main">
        <div className="container header__main-inner">
          
          <button className="header__mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" className="header__logo">
            <span className="header__logo-t">This</span><span className="header__logo-d">Dat</span>
          </Link>

          <div className="header__search-container">
            <div className="header__location-picker">
              <MapPin size={16} className="header__location-icon" />
              <span className="header__location-text">New Delhi</span>
              <ChevronDown size={14} className="header__location-arrow" />
            </div>
            <div className="header__search-box">
              <SearchBar />
            </div>
          </div>

          <div className="header__actions-right">
            <div className="header__help">
              <span className="header__help-icon">⚡</span>
              <div className="header__help-text">
                Need Help?
              </div>
            </div>

            <Link to="/cart" className="header__cart-btn">
              <ShoppingCart size={22} className="header__cart-icon" />
              {itemCount > 0 && <span className="header__cart-badge">{itemCount}</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Nav Strip (Categories dropdown mock) */}
      <div className="header__bottom-strip">
        <div className="container header__bottom-inner">
          <Link to="/products" className="header__bottom-link">Health Resource Center <ChevronDown size={14}/></Link>
          <Link to="/products" className="header__bottom-link">Vitamins & Nutrition <ChevronDown size={14}/></Link>
          <Link to="/products" className="header__bottom-link">Diabetes <ChevronDown size={14}/></Link>
          <Link to="/products" className="header__bottom-link">Healthcare Devices <ChevronDown size={14}/></Link>
          <Link to="/products" className="header__bottom-link">Personal Care <ChevronDown size={14}/></Link>
          <Link to="/products" className="header__bottom-link">Health Conditions <ChevronDown size={14}/></Link>
          <Link to="/products" className="header__bottom-link">Ayurveda Products <ChevronDown size={14}/></Link>
          <Link to="/products" className="header__bottom-link">Homeopathy <ChevronDown size={14}/></Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="header__mobile-menu">
          {isAuthenticated ? (
            <div className="header__mobile-user">
              <User size={24} />
              <span>{user.displayName || user.email}</span>
            </div>
          ) : (
            <div className="header__mobile-user">
              <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
              <span> / </span>
              <Link to="/signup" onClick={() => setMobileOpen(false)}>Sign Up</Link>
            </div>
          )}
          <nav className="header__mobile-nav">
            <Link to="/products" onClick={() => setMobileOpen(false)}>Medicines</Link>
            <Link to="/products" onClick={() => setMobileOpen(false)}>Lab Tests</Link>
            <Link to="/products" onClick={() => setMobileOpen(false)}>Consult Doctors</Link>
            <Link to="/cart" onClick={() => setMobileOpen(false)}>Cart ({itemCount})</Link>
            {isAuthenticated && (
              <button onClick={handleLogout} className="header__mobile-logout">Logout</button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
