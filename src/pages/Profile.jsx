import { Link, useNavigate } from 'react-router-dom';
import { UserCircle, Mail, LogOut, Package, ShoppingBag, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { getOrders, formatPrice } from '../utils/helpers';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const orders = getOrders(user?.uid);

  const handleLogout = async () => {
    try {
      await logout();
      toast.info('You have been logged out', 'Goodbye');
      navigate('/');
    } catch (err) {
      toast.error('Logout failed', 'Error');
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

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="profile-page page-enter" id="profile-page">
      <div className="container">
        <h1 className="profile-page__title">My Account</h1>

        <div className="profile-page__grid">
          {/* User Info Card */}
          <div className="profile-page__card">
            <h2 className="profile-page__card-title">
              <UserCircle size={22} /> Profile
            </h2>

            <div className="profile-page__user-header">
              <div className="profile-page__avatar">
                {getUserInitials()}
              </div>
              <div className="profile-page__user-info">
                <h3 className="profile-page__user-name">
                  {user?.displayName || 'User'}
                </h3>
                <p className="profile-page__user-email">
                  <Mail size={14} />
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="profile-page__info-grid">
              <div className="profile-page__info-item">
                <div className="profile-page__info-label">Member Since</div>
                <div className="profile-page__info-value">
                  {user?.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                    : 'N/A'}
                </div>
              </div>
              <div className="profile-page__info-item">
                <div className="profile-page__info-label">Total Orders</div>
                <div className="profile-page__info-value">{orders.length}</div>
              </div>
              <div className="profile-page__info-item">
                <div className="profile-page__info-label">Auth Provider</div>
                <div className="profile-page__info-value">
                  {user?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'Email'}
                </div>
              </div>
              <div className="profile-page__info-item">
                <div className="profile-page__info-label">Email Verified</div>
                <div className="profile-page__info-value" style={{ color: user?.emailVerified ? 'var(--color-success)' : 'var(--color-warning)' }}>
                  {user?.emailVerified ? '✓ Verified' : 'Pending'}
                </div>
              </div>
            </div>

            <button className="profile-page__logout-btn" onClick={handleLogout} id="logout-btn">
              <LogOut size={18} /> Sign Out
            </button>
          </div>

          {/* Order History */}
          <div className="profile-page__card">
            <h2 className="profile-page__card-title">
              <Package size={22} /> Order History
            </h2>

            {orders.length > 0 ? (
              <div className="profile-page__orders">
                {orders.map((order, index) => (
                  <div key={index} className="profile-page__order">
                    <div className="profile-page__order-info">
                      <div className="profile-page__order-id">#{order.id}</div>
                      <div className="profile-page__order-date">
                        <Clock size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                        {formatDate(order.date)}
                      </div>
                      <div className="profile-page__order-items">
                        {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                        {order.items?.length > 0 && ` · ${order.items.slice(0, 2).map(i => i.name).join(', ')}${order.items.length > 2 ? '...' : ''}`}
                      </div>
                    </div>
                    <div className="profile-page__order-right">
                      <div className="profile-page__order-total">{formatPrice(order.total)}</div>
                      <span className="profile-page__order-status profile-page__order-status--confirmed">
                        {order.status || 'Confirmed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="profile-page__no-orders">
                <div className="profile-page__no-orders-icon">📦</div>
                <p>No orders yet</p>
                <Link to="/products" className="profile-page__no-orders-btn">
                  <ShoppingBag size={14} /> Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
