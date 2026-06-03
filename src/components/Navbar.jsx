import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Home, Package, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SearchBar from './SearchBar';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getItemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setMobileOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const getUserInitials = () => {
    if (!user) return '?';
    const name = user.displayName || user.email || '';
    const parts = name.split(/[\s@]/);
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} id="main-navbar">
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo" id="logo-link">
          <div className="navbar__logo-icon">TD</div>
          <span className="navbar__logo-text">ThisDat</span>
        </Link>

        {/* Search — desktop */}
        <div className="navbar__search">
          <SearchBar />
        </div>

        {/* Actions */}
        <div className="navbar__actions">
          {/* Cart */}
          <Link to="/cart" className="navbar__action-btn" id="cart-nav-btn" title="Cart">
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="navbar__cart-badge">{itemCount > 99 ? '99+' : itemCount}</span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <Link to="/profile" className="navbar__user-btn" id="profile-nav-btn">
              <div className="navbar__user-avatar">{getUserInitials()}</div>
              <span className="navbar__user-name">
                {user.displayName || user.email?.split('@')[0] || 'User'}
              </span>
            </Link>
          ) : (
            <Link to="/login" className="navbar__auth-btn" id="login-nav-btn">
              <User size={16} />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            className="navbar__mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            id="mobile-menu-toggle"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="navbar__mobile-menu">
          <SearchBar onClose={() => setMobileOpen(false)} />
          <nav className="navbar__mobile-links">
            <Link to="/" className="navbar__mobile-link" onClick={() => setMobileOpen(false)}>
              <Home size={20} /> Home
            </Link>
            <Link to="/products" className="navbar__mobile-link" onClick={() => setMobileOpen(false)}>
              <Package size={20} /> All Medicines
            </Link>
            <Link to="/cart" className="navbar__mobile-link" onClick={() => setMobileOpen(false)}>
              <ShoppingCart size={20} /> Cart {itemCount > 0 && `(${itemCount})`}
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="navbar__mobile-link" onClick={() => setMobileOpen(false)}>
                  <UserCircle size={20} /> Profile
                </Link>
                <button className="navbar__mobile-link" onClick={handleLogout}>
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="navbar__mobile-link" onClick={() => setMobileOpen(false)}>
                <User size={20} /> Login / Sign Up
              </Link>
            )}
          </nav>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
