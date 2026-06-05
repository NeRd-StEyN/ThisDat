import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, MapPin, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import { medicines } from '../data/medicines';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getItemCount } = useCart();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { info } = useToast();
  const itemCount = getItemCount();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const searchResults = searchQuery.length > 0 
    ? medicines.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  const handleLogout = async () => {
    try {
      await logout();
      setProfileOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="navbar-1mg">
      {/* Tier 1: Top Nav */}
      <div className="navbar-1mg__top">
        <div className="navbar-1mg__container">
          <div className="navbar-1mg__top-left">
            <Link to="/" className="navbar-1mg__logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <img src="/favicon.svg" alt="TD Logo" style={{ width: '32px', height: '32px' }} />
              <strong style={{ fontSize: '22px', color: '#333' }}>ThisDat</strong>
            </Link>
            <div className="navbar-1mg__top-links">
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>HOME</Link>
              <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>MEDICINES</Link>
            </div>
          </div>

          <div className="navbar-1mg__search-wrapper" style={{ position: 'relative', flex: 1, margin: '0 32px', maxWidth: '600px' }}>
            <div className="navbar-1mg__search">
              <input 
                type="text" 
                placeholder="Search for Medicines and Health Products" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim().length > 0) {
                    e.preventDefault();
                    setShowDropdown(false);
                    if (searchResults.length > 0) {
                      navigate(`/product/${searchResults[0].id}`);
                      setSearchQuery('');
                    } else {
                      navigate('/products');
                    }
                  }
                }}
              />
              <Search size={18} color="#666" />
            </div>
            
            {showDropdown && searchQuery.length > 0 && (
              <div className="navbar-1mg__search-dropdown animate-slide-down" style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#fff',
                border: '1px solid #dfdfdf',
                borderTop: 'none',
                borderRadius: '0 0 4px 4px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                zIndex: 1000,
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {searchResults.length > 0 ? (
                  searchResults.slice(0, 8).map(product => (
                    <div 
                      key={product.id} 
                      className="search-dropdown-item"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 12px',
                        textDecoration: 'none',
                        color: '#333',
                        borderBottom: '1px solid #f5f5f5',
                        cursor: 'pointer'
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault(); 
                        setSearchQuery('');
                        setShowDropdown(false);
                        navigate(`/product/${product.id}`);
                      }}
                    >
                      <Search size={14} color="#999" style={{ marginRight: '10px' }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '500' }}>{product.name}</div>
                        <div style={{ fontSize: '11px', color: '#666' }}>{product.category}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '12px', fontSize: '13px', color: '#666' }}>
                    No matching results found
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="navbar-1mg__top-right">
            {isAuthenticated ? (
              <div className="navbar-1mg__auth-links" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Link to="/profile">Profile</Link> | 
                <Link to="/profile">Orders</Link> | 
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#4a4a4a', cursor: 'pointer', fontSize: '14px', padding: 0 }}>Logout</button>
              </div>
            ) : (
              <div className="navbar-1mg__auth-links">
                <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
              </div>
            )}
            <Link to="/cart" className="navbar-1mg__cart-icon">
              <ShoppingCart size={20} />
              {itemCount > 0 && <span className="navbar-1mg__cart-badge">{itemCount}</span>}
            </Link>
            <Link to="#" className="navbar-1mg__help" onClick={(e) => { e.preventDefault(); info('Reach us at support@thisdat.com or call 1800-THISDAT', 'Contact Support'); }}>Need Help?</Link>
          </div>
        </div>
      </div>



      {/* Tier 3 Removed as requested */}

    </nav>
  );
};

export default Navbar;
