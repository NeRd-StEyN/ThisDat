import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { medicines } from '../data/medicines';
import { searchProducts, formatPrice } from '../utils/helpers';
import './SearchBar.css';

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length >= 2) {
      const filtered = searchProducts(medicines, query).slice(0, 8);
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (product) => {
    setQuery('');
    setIsOpen(false);
    if (onClose) onClose();
    navigate(`/product/${product.id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      if (onClose) onClose();
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="search-bar" ref={wrapperRef}>
      <form onSubmit={handleSubmit}>
        <div className="search-bar__input-wrap">
          <Search className="search-bar__icon" size={18} />
          <input
            ref={inputRef}
            type="text"
            className="search-bar__input"
            placeholder="Search for medicines, health products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
            id="search-input"
            autoComplete="off"
          />
          {query && (
            <button type="button" className="search-bar__clear" onClick={() => { setQuery(''); inputRef.current?.focus(); }}>
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {isOpen && (
        <div className="search-bar__dropdown">
          {results.length > 0 ? (
            <>
              <div className="search-bar__section-title">Products</div>
              {results.map(product => (
                <div
                  key={product.id}
                  className="search-bar__result"
                  onClick={() => handleSelect(product)}
                >
                  <div className="search-bar__result-image-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', borderRadius: '4px', width: '40px', height: '40px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#888' }}>{product.name.charAt(0)}</span>
                  </div>
                  <div className="search-bar__result-info">
                    <div className="search-bar__result-name">{product.name}</div>
                    <div className="search-bar__result-meta">{product.manufacturer} · {product.packSize}</div>
                  </div>
                  <div className="search-bar__result-price">
                    {formatPrice(product.price)}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="search-bar__no-results">
              No medicines found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
