import { Link, useLocation, Navigate } from 'react-router-dom';
import { Check, ShoppingBag, User, Mail, PartyPopper } from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const { orderId, total } = location.state || {};

  if (!orderId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="order-success page-enter" id="order-success-page">
      <div className="order-success__card">
        <div className="order-success__check">
          <Check size={44} color="white" strokeWidth={3} />
        </div>

        <h1 className="order-success__title">Request Placed! <PartyPopper size={32} style={{display: 'inline', verticalAlign: 'middle', marginLeft: '8px'}} /></h1>
        <p className="order-success__subtitle">
          Thank you for your request. Your medicines will be delivered to your doorstep soon.
        </p>

        <div className="order-success__details">
          <div className="order-success__detail-row">
            <span className="order-success__detail-label">Request ID</span>
            <span className="order-success__detail-value order-success__detail-value--id">
              {orderId}
            </span>
          </div>
          <div className="order-success__detail-row">
            <span className="order-success__detail-label">Amount</span>
            <span className="order-success__detail-value">{formatPrice(total)}</span>
          </div>
          <div className="order-success__detail-row">
            <span className="order-success__detail-label">Payment</span>
            <span className="order-success__detail-value">Cash on Delivery</span>
          </div>
          <div className="order-success__detail-row">
            <span className="order-success__detail-label">Status</span>
            <span className="order-success__detail-value" style={{ color: 'var(--color-success)' }}>
              Confirmed
            </span>
          </div>
        </div>

        <div className="order-success__email-note">
          <Mail size={16} />
          Request details have been sent to your email
        </div>

        <div className="order-success__actions">
          <Link to="/products" className="order-success__btn order-success__btn--primary">
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
          <Link to="/profile" className="order-success__btn order-success__btn--secondary">
            <User size={16} /> View Requests
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
