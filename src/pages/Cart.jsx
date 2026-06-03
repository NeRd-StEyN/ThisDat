import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';
import { formatPrice } from '../utils/helpers';
import './Cart.css';

const Cart = () => {
  const { items, getSubtotal, getDiscountTotal, getSavings, getItemCount, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (items.length === 0) {
    return (
      <div className="cart-page page-enter">
        <div className="container">
          <h1 className="cart-page__title">Your Cart</h1>
          <div className="cart-page__empty">
            <div className="cart-page__empty-icon">🛒</div>
            <h2 className="cart-page__empty-title">Your cart is empty</h2>
            <p className="cart-page__empty-text">Looks like you haven't added any medicines yet</p>
            <Link to="/products" className="cart-page__empty-btn">
              <ShoppingBag size={18} /> Browse Medicines
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const total = getDiscountTotal();
  const savings = getSavings();
  const itemCount = getItemCount();

  return (
    <div className="cart-page page-enter">
      <div className="container">
        <h1 className="cart-page__title">Your Cart ({itemCount} item{itemCount !== 1 ? 's' : ''})</h1>

        <div className="cart-page__layout">
          {/* Cart Items */}
          <div className="cart-page__items">
            {items.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Summary */}
          <div className="cart-page__summary" id="cart-summary">
            <h3 className="cart-page__summary-title">Order Summary</h3>

            <div className="cart-page__summary-row">
              <span className="cart-page__summary-label">Subtotal ({itemCount} items)</span>
              <span className="cart-page__summary-value">{formatPrice(subtotal)}</span>
            </div>

            {savings > 0 && (
              <div className="cart-page__summary-row">
                <span className="cart-page__summary-label">Discount</span>
                <span className="cart-page__summary-value cart-page__summary-value--savings">
                  -{formatPrice(savings)}
                </span>
              </div>
            )}

            <div className="cart-page__summary-row">
              <span className="cart-page__summary-label">Delivery</span>
              <span className="cart-page__summary-value cart-page__summary-value--savings">FREE</span>
            </div>

            <div className="cart-page__summary-divider" />

            <div className="cart-page__summary-row">
              <span className="cart-page__summary-label cart-page__summary-total">Total</span>
              <span className="cart-page__summary-value cart-page__summary-total">{formatPrice(total)}</span>
            </div>

            {savings > 0 && (
              <div className="cart-page__summary-row" style={{ paddingTop: 0 }}>
                <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-success)', fontWeight: 'var(--fw-semibold)' }}>
                  You save {formatPrice(savings)} on this order 🎉
                </span>
              </div>
            )}

            <Link
              to={isAuthenticated ? '/checkout' : '/login'}
              className="cart-page__checkout-btn"
              id="checkout-btn"
            >
              {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
              <ArrowRight size={18} />
            </Link>

            <button className="cart-page__clear-btn" onClick={clearCart}>
              <Trash2 size={14} /> Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
