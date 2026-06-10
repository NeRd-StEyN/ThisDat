import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { MapPin, Send, AlertCircle, Package, CheckCircle, Edit3, Bookmark, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { formatPrice, getOrderId, saveOrder, saveAddress, getSavedAddress } from '../utils/helpers';
import { categories } from '../data/medicines';
import './Checkout.css';

// Replace with your Formspree form ID
// const FORMSPREE_URL = 'https://formspree.io/f/xwvzdbez';
const FORMSPREE_URL = 'https://formspree.io/f/xnjyawqd';

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
    country: 'India',
    pincode: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pinError, setPinError] = useState('');
  const [saveAddr, setSaveAddr] = useState(true);
  const [usingSaved, setUsingSaved] = useState(false);
  const [isLocationValid, setIsLocationValid] = useState(true);
  const [checkingLocation, setCheckingLocation] = useState(true);

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

  // Geolocation check
  useEffect(() => {
    const checkLocation = async () => {
      try {
        const res = await fetch('https://api.country.is');
        const data = await res.json();
        if (data.country !== 'IN') {
          setIsLocationValid(false);
        }
      } catch (err) {
        console.warn('Geolocation check failed:', err);
        // Fail open if the API is down
      } finally {
        setCheckingLocation(false);
      }
    };
    checkLocation();
  }, []);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'pincode') setPinError('');
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
    setPinError('');

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

    // Verify PIN code via API
    try {
      const pinRes = await fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`);
      const pinData = await pinRes.json();
      if (!pinData || !pinData[0] || pinData[0].Status === 'Error') {
        setPinError('Invalid PIN code. The entered PIN code does not exist in India.');
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Pincode validation API failed:', err);
      // We continue if API fails to avoid blocking users due to third-party downtime
    }

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
      _subject: `ThisDat Request #${orderId}`,
      'Request ID': orderId,
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
        toast.success('Your request has been placed!', 'Request Confirmed');
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

        {checkingLocation ? (
          <div className="checkout-page__layout" style={{ display: 'flex', justifyContent: 'center', padding: '60px 0', width: '100%' }}>
            <div className="spinner" style={{ width: 40, height: 40, borderColor: '#ff6f61', borderTopColor: 'transparent' }} />
          </div>
        ) : !isLocationValid ? (
          <div className="checkout-page__layout" style={{ display: 'flex', justifyContent: 'center', padding: '60px 0', width: '100%' }}>
            <div style={{ textAlign: 'center', maxWidth: '500px', background: '#fff0f0', border: '1px solid #ffcccc', padding: '32px', borderRadius: '8px' }}>
              <AlertCircle size={48} color="#ff4d4f" style={{ marginBottom: '16px' }} />
              <h2 style={{ color: '#d32f2f', marginBottom: '12px', marginTop: 0 }}>Location Restricted</h2>
              <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '24px' }}>
                Sorry, we are currently only accepting requests from within India. 
                Our systems have detected that you are accessing the site from outside our serviceable region.
              </p>
              <button onClick={() => navigate('/')} className="checkout-page__submit-btn" style={{ width: 'auto', padding: '12px 32px' }}>
                Return to Home
              </button>
            </div>
          </div>
        ) : (
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
                    <div className="checkout-page__saved-address-phone"><Phone size={14} style={{display: 'inline', verticalAlign: 'middle'}} /> {savedAddr.phone}</div>
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
                  <label className="checkout-page__label" htmlFor="country">Country *</label>
                  <select
                    id="country"
                    name="country"
                    className="checkout-page__input"
                    value={formData.country || 'India'}
                    onChange={handleChange}
                    required
                    disabled
                  >
                    <option value="India">India</option>
                  </select>
                </div>
                <div className="checkout-page__field">
                  <label className="checkout-page__label" htmlFor="state">State *</label>
                  <select
                    id="state"
                    name="state"
                    className="checkout-page__input"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>Select State</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                    <option value="Ladakh">Ladakh</option>
                    <option value="Lakshadweep">Lakshadweep</option>
                    <option value="Puducherry">Puducherry</option>
                  </select>
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
                    pattern="^[1-9][0-9]{5}$"
                    title="Please enter a valid 6-digit Indian PIN code"
                    maxLength={6}
                  />
                  {pinError && <div style={{ color: '#ff4d4f', fontSize: '13px', marginTop: '6px' }}>{pinError}</div>}
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
              <h3 className="checkout-page__summary-title">Request Summary</h3>

              <div className="checkout-page__summary-items">
                {items.map(item => {
                  const catData = categories.find(c => c.id === item.category);
                  return (
                    <div key={item.id} className="checkout-page__summary-item">
                      <div className="checkout-page__summary-item-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', borderRadius: '4px', width: '40px', height: '40px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#888' }}>{item.name.charAt(0)}</span>
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
                  <><Send size={18} /> Request Order</>
                )}
              </button>


            </div>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default Checkout;
