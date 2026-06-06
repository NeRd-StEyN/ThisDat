import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { MapPin, Send, AlertCircle, Package, CheckCircle, Edit3, Bookmark } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { formatPrice, getOrderId, saveOrder, saveAddress, getSavedAddress } from '../utils/helpers';
import { categories } from '../data/medicines';
import './Checkout.css';

// Replace with your Formspree form ID
const FORMSPREE_URL = 'https://formspree.io/f/xwvzdbez';

const Checkout = () => {
  const { items, getSubtotal, getItemCount, clearCart } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [savedAddr, setSavedAddr] = useState(null);

  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveAddr, setSaveAddr] = useState(true);
  const [usingSaved, setUsingSaved] = useState(false);

  // Auto-fill from saved address on mount
  useEffect(() => {
    const fetchAddress = async () => {
      const address = await getSavedAddress(user?.uid);
      if (address) {
        setSavedAddr(address);
        setFormData(prev => ({
          ...prev,
          fullName: address.fullName || prev.fullName,
          phone: address.phone || prev.phone,
          address: address.address || prev.address,
          city: address.city || prev.city,
          state: address.state || prev.state,
          pincode: address.pincode || prev.pincode,
        }));
        setUsingSaved(true);
      }
    };
    fetchAddress();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (usingSaved) setUsingSaved(false);
  };

  const handleUseSavedAddress = () => {
    if (!savedAddr) return;
    setFormData(prev => ({
      ...prev,
      fullName: savedAddr.fullName || prev.fullName,
      phone: savedAddr.phone || prev.phone,
      address: savedAddr.address || prev.address,
      city: savedAddr.city || prev.city,
      state: savedAddr.state || prev.state,
      pincode: savedAddr.pincode || prev.pincode,
    }));
    setUsingSaved(true);
    toast.success('Saved address loaded', 'Address Filled');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    // Save address if checkbox is checked
    if (saveAddr) {
      await saveAddress({
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      }, user?.uid);
    }

    const orderId = getOrderId();
    const subtotal = getSubtotal();

    // Build order summary text for email
    const orderItems = items.map(item => {
      const price = item.price;
      return `${item.name} (${item.packSize}) x${item.quantity} = ₹${(price * item.quantity).toFixed(2)}`;
    }).join('\n');

    const emailBody = {
      _subject: `🧾 ThisDat Order #${orderId}`,
      'Order ID': orderId,
      'Customer Name': formData.fullName,
      'Email': formData.email,
      'Phone': formData.phone,
      'Delivery Address': `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      'Order Items': orderItems,
      'Total Items': getItemCount(),
      'Subtotal': `₹${getSubtotal().toFixed(2)}`,
      'Total Amount': `₹${subtotal.toFixed(2)}`,
      'Special Notes': formData.notes || 'None',
      'Order Date': new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })
    };

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(emailBody)
      });

      if (response.ok) {
        // Save order locally
        await saveOrder({
          id: orderId,
          items: [...items],
          total: subtotal,
          savings: 0,
          address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
          date: new Date().toISOString(),
          status: 'Confirmed'
        }, user?.uid);

        clearCart();
        toast.success('Your order has been placed!', 'Order Confirmed');
        navigate('/order-success', { state: { orderId, total: subtotal } });
      } else {
        // If Formspree fails (e.g., invalid form ID), still save order locally
        await saveOrder({
          id: orderId,
          items: [...items],
          total: subtotal,
          savings: 0,
          address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
          date: new Date().toISOString(),
          status: 'Confirmed (Email pending)'
        }, user?.uid);

        clearCart();
        toast.warning('Order placed but email confirmation may be delayed.', 'Order Placed');
        navigate('/order-success', { state: { orderId, total: subtotal } });
      }
    } catch (err) {
      // Network error — save locally anyway
      await saveOrder({
        id: orderId,
        items: [...items],
        total: subtotal,
        savings: 0,
        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        date: new Date().toISOString(),
        status: 'Confirmed (Offline)'
      }, user?.uid);

      clearCart();
      toast.info('Order saved! Email will be sent when you are back online.', 'Order Saved');
      navigate('/order-success', { state: { orderId, total: subtotal } });
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getSubtotal();

  return (
    <div className="checkout-page page-enter">
      <div className="container">
        <h1 className="checkout-page__title">Checkout</h1>

        <form className="checkout-page__layout" onSubmit={handleSubmit} id="checkout-form">
          {/* Form */}
          <div className="checkout-page__form-section">
            {error && (
              <div className="checkout-page__error">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {/* Saved Address Card */}
            {savedAddr && usingSaved && (
              <div className="checkout-page__saved-address" id="saved-address-card">
                <div className="checkout-page__saved-address-header">
                  <div className="checkout-page__saved-address-badge">
                    <CheckCircle size={16} />
                    <span>Saved Address</span>
                  </div>
                  <button
                    type="button"
                    className="checkout-page__saved-address-edit"
                    onClick={() => setUsingSaved(false)}
                    id="edit-address-btn"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                </div>
                <div className="checkout-page__saved-address-body">
                  <div className="checkout-page__saved-address-name">{savedAddr.fullName}</div>
                  <div className="checkout-page__saved-address-detail">
                    {savedAddr.address}, {savedAddr.city}, {savedAddr.state} - {savedAddr.pincode}
                  </div>
                  {savedAddr.phone && (
                    <div className="checkout-page__saved-address-phone">📞 {savedAddr.phone}</div>
                  )}
                </div>
              </div>
            )}

            {/* Delivery Address */}
            <div className="checkout-page__section">
              <h2 className="checkout-page__section-title">
                <MapPin size={20} /> Delivery Address
                {savedAddr && !usingSaved && (
                  <button
                    type="button"
                    className="checkout-page__use-saved-btn"
                    onClick={handleUseSavedAddress}
                    id="use-saved-address-btn"
                  >
                    <Bookmark size={14} /> Use saved address
                  </button>
                )}
              </h2>
              <div className="checkout-page__form-grid">
                <div className="checkout-page__field">
                  <label className="checkout-page__label" htmlFor="fullName">Full Name *</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="checkout-page__input"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="checkout-page__field">
                  <label className="checkout-page__label" htmlFor="email">Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="checkout-page__input"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="checkout-page__field checkout-page__field--full">
                  <label className="checkout-page__label" htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="checkout-page__input"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="checkout-page__field checkout-page__field--full">
                  <label className="checkout-page__label" htmlFor="address">Street Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    className="checkout-page__input checkout-page__textarea"
                    placeholder="House no., Street, Locality"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="checkout-page__field">
                  <label className="checkout-page__label" htmlFor="city">City *</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    className="checkout-page__input"
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="checkout-page__field">
                  <label className="checkout-page__label" htmlFor="state">State *</label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    className="checkout-page__input"
                    placeholder="Maharashtra"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="checkout-page__field">
                  <label className="checkout-page__label" htmlFor="pincode">PIN Code *</label>
                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    className="checkout-page__input"
                    placeholder="400001"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    maxLength={6}
                  />
                </div>
                <div className="checkout-page__field">
                  <label className="checkout-page__label" htmlFor="notes">Special Notes</label>
                  <input
                    id="notes"
                    name="notes"
                    type="text"
                    className="checkout-page__input"
                    placeholder="Any delivery instructions"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Save address checkbox */}
              <label className="checkout-page__save-checkbox" htmlFor="save-address-check">
                <input
                  type="checkbox"
                  id="save-address-check"
                  checked={saveAddr}
                  onChange={(e) => setSaveAddr(e.target.checked)}
                />
                <Bookmark size={14} />
                <span>Save this address for future orders</span>
              </label>
            </div>
          </div>

          {/* Sidebar */}
          <div className="checkout-page__sidebar">
            <div className="checkout-page__summary">
              <h3 className="checkout-page__summary-title">Order Summary</h3>

              <div className="checkout-page__summary-items">
                {items.map(item => {
                  const catData = categories.find(c => c.id === item.category);
                  return (
                    <div key={item.id} className="checkout-page__summary-item">
                      <div className="checkout-page__summary-item-icon">
                        {catData?.icon || '💊'}
                      </div>
                      <div className="checkout-page__summary-item-info">
                        <div className="checkout-page__summary-item-name">{item.name}</div>
                        <div className="checkout-page__summary-item-qty">
                          Qty: {item.quantity} · {item.packSize}
                        </div>
                      </div>
                      <div className="checkout-page__summary-item-price">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="checkout-page__summary-divider" />

              <div className="checkout-page__summary-row">
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span style={{ fontWeight: 'var(--fw-semibold)' }}>{formatPrice(subtotal)}</span>
              </div>
              <div className="checkout-page__summary-row">
                <span style={{ color: 'var(--text-secondary)' }}>Delivery</span>
                <span style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--color-success)' }}>FREE</span>
              </div>

              <div className="checkout-page__summary-divider" />

              <div className="checkout-page__summary-row">
                <span style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-extrabold)' }}>Total</span>
                <span style={{ fontSize: 'var(--fs-xl)', fontWeight: 'var(--fw-extrabold)' }}>{formatPrice(subtotal)}</span>
              </div>

              <button
                type="submit"
                className="checkout-page__submit-btn"
                disabled={loading}
                id="place-order-btn"
              >
                {loading ? (
                  <div className="spinner spinner--white" style={{ width: 20, height: 20 }} />
                ) : (
                  <><Send size={18} /> Place Order</>
                )}
              </button>


            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
