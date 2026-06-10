import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, Plus, ChevronRight, LogOut, Package, MapPin, CheckCircle, Save, Edit3, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';
import { updateProfile } from 'firebase/auth';
import { useToast } from '../components/Toast';
import { getOrders, formatPrice, saveAddress, getSavedAddress } from '../utils/helpers';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || '');
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const [savedAddr, setSavedAddr] = useState(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);
  const [editingAddress, setEditingAddress] = useState(false);
  const [addrForm, setAddrForm] = useState({
    fullName: '', phone: '', address: '', city: '', state: '', pincode: '', country: 'India',
  });
  const [pinError, setPinError] = useState('');
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.uid) {
        setIsLoadingOrders(true);
        setIsLoadingAddress(true);
        
        try {
          const [fetchedOrders, fetchedAddress] = await Promise.all([
            getOrders(user.uid),
            getSavedAddress(user.uid)
          ]);
          setOrders(fetchedOrders || []);
          setSavedAddr(fetchedAddress);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoadingOrders(false);
          setIsLoadingAddress(false);
        }
      } else {
        // Handle guest case if needed, though profile usually requires login
        setIsLoadingOrders(false);
        setIsLoadingAddress(false);
      }
    };
    
    fetchData();
  }, [user?.uid]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.info('You have been logged out', 'Goodbye');
      navigate('/');
    } catch (err) {
      toast.error('Logout failed', 'Error');
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      toast.error('Name cannot be empty', 'Error');
      return;
    }
    try {
      setIsUpdatingName(true);
      await updateProfile(auth.currentUser, { displayName: newName.trim() });
      // We force a local update by reloading the page or we just let it be, 
      // but reloading is easiest to ensure all components see the new name.
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update name', 'Error');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleEditAddress = () => {
    if (savedAddr) setAddrForm({ ...savedAddr, country: 'India' });
    else setAddrForm({ fullName: user?.displayName || '', phone: '', address: '', city: '', state: '', pincode: '', country: 'India' });
    setEditingAddress(true);
  };

  const handleSaveAddress = async () => {
    setPinError('');
    if (!addrForm.fullName || !addrForm.address || !addrForm.city || !addrForm.state || !addrForm.pincode) {
      toast.error('Please fill in all required fields', 'Missing Fields');
      return;
    }

    setIsSavingAddress(true);
    try {
      const pinRes = await fetch(`https://api.postalpincode.in/pincode/${addrForm.pincode}`);
      const pinData = await pinRes.json();
      if (!pinData || !pinData[0] || pinData[0].Status === 'Error') {
        setPinError('Invalid PIN code. The entered PIN code does not exist in India.');
        setIsSavingAddress(false);
        return;
      }
    } catch (err) {
      console.warn('Pincode validation API failed:', err);
    }

    await saveAddress({ ...addrForm, country: 'India' }, user?.uid);
    setSavedAddr({ ...addrForm, country: 'India' });
    setEditingAddress(false);
    setIsSavingAddress(false);
    toast.success('Address saved successfully!', 'Address Saved');
  };

  const handleDeleteAddress = async () => {
    const key = user?.uid ? `thisdat_address_${user.uid}` : 'thisdat_address';
    localStorage.removeItem(key);
    // Note: If you want to delete from Firestore, you would need a deleteAddress helper, 
    // but for now we just remove from state/local and let save overwrite later.
    setSavedAddr(null);
    setEditingAddress(false);
    toast.info('Address removed', 'Deleted');
  };

  const handleAddrChange = (e) => {
    setAddrForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'pincode') setPinError('');
  };

  return (
    <div className="profile-1mg page-enter">
      <div className="profile-1mg__container">
        
        {/* Main 1mg Profile Header Grid */}
        <div className="profile-1mg__grid-header">
          
          {/* Left Side: Contact Info */}
          <div className="profile-1mg__contact-box" style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {isEditingName ? (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    style={{ padding: '4px 8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                  <button onClick={handleUpdateName} disabled={isUpdatingName} style={{ background: '#ff6f61', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                    {isUpdatingName ? 'Saving...' : 'Save'}
                  </button>
                  <button onClick={() => { setIsEditingName(false); setNewName(user?.displayName || ''); }} style={{ background: '#eee', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                </div>
              ) : (
                <h2 style={{ margin: 0 }}>Hi {user?.displayName || 'there'}! <button onClick={() => setIsEditingName(true)} style={{ background: 'none', border: 'none', color: '#ff6f61', cursor: 'pointer', fontSize: '14px', marginLeft: '8px' }}><Edit3 size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }}/>Edit Name</button></h2>
              )}
            </div>

            <div className="profile-1mg__contact-row" style={{ marginTop: '24px' }}>
              <Mail size={18} color="#999" />
              <div className="profile-1mg__contact-details">
                <span className="label">Primary Email address</span>
                <span className="val">{user?.email || 'test@example.com'}</span>
              </div>
            </div>
            
            <button className="profile-1mg__logout-btn" onClick={handleLogout} style={{ marginTop: '16px' }}>Logout</button>
          </div>
        </div>

        {/* Existing App Features (Addresses & Orders) styled to match */}
        <div className="profile-1mg__features">
          <div className="profile-1mg__card">
            <h3><MapPin size={20} /> Delivery Address</h3>
            {editingAddress ? (
              <div className="profile-1mg__addr-form">
                <input name="fullName" placeholder="Full Name" value={addrForm.fullName} onChange={handleAddrChange} />
                <input name="phone" placeholder="Phone" value={addrForm.phone} onChange={handleAddrChange} />
                <textarea name="address" placeholder="Street Address" value={addrForm.address} onChange={handleAddrChange} />
                <input name="city" placeholder="City" value={addrForm.city} onChange={handleAddrChange} />
                <select name="country" value={addrForm.country || 'India'} onChange={handleAddrChange} disabled style={{ backgroundColor: '#f5f5f5', color: '#666' }}>
                  <option value="India">India</option>
                </select>
                <select name="state" value={addrForm.state} onChange={handleAddrChange}>
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
                <div style={{ marginBottom: '12px' }}>
                  <input name="pincode" placeholder="PIN Code" value={addrForm.pincode} onChange={handleAddrChange} maxLength={6} pattern="^[1-9][0-9]{5}$" title="Please enter a valid 6-digit Indian PIN code" style={{ marginBottom: 0 }} />
                  {pinError && <div style={{ color: '#ff4d4f', fontSize: '13px', marginTop: '6px' }}>{pinError}</div>}
                </div>
                <div className="addr-actions">
                  <button onClick={handleSaveAddress} className="btn-save" disabled={isSavingAddress}>{isSavingAddress ? 'Saving...' : 'Save Address'}</button>
                  <button onClick={() => setEditingAddress(false)} className="btn-cancel">Cancel</button>
                </div>
              </div>
            ) : savedAddr ? (
              <div className="profile-1mg__saved-addr">
                <p><strong>{savedAddr.fullName}</strong> <CheckCircle size={14} color="green" /></p>
                <p>{savedAddr.address}, {savedAddr.city}, {savedAddr.state} - {savedAddr.pincode}</p>
                <div className="addr-actions mt-2">
                  <button onClick={handleEditAddress} className="btn-edit"><Edit3 size={14}/> Edit</button>
                  <button onClick={handleDeleteAddress} className="btn-delete"><Trash2 size={14}/> Remove</button>
                </div>
              </div>
            ) : (
              <button className="btn-add-addr" onClick={handleEditAddress}>+ Add New Address</button>
            )}
          </div>

          <div className="profile-1mg__card">
            <h3><Package size={20} /> Request History</h3>
            {orders.length > 0 ? (
              <div className="profile-1mg__orders">
                {orders.map((order, i) => (
                  <div key={i} className="profile-1mg__order-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <div>
                        <p style={{ marginBottom: '4px' }}><strong>Request #{order.id}</strong></p>
                        <p style={{ fontSize: '12px', color: '#767676' }}>{new Date(order.date).toLocaleString()}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p className="price" style={{ fontSize: '16px' }}>{formatPrice(order.total)}</p>
                        <p style={{ fontSize: '12px', color: '#1aab2a', fontWeight: 'bold' }}>{order.status}</p>
                      </div>
                    </div>
                    
                    {order.items && order.items.length > 0 && (
                      <div style={{ width: '100%', background: '#f9f9f9', padding: '12px', borderRadius: '4px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#666' }}>ITEMS REQUESTED</p>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                            <span style={{ color: '#333' }}>{item.quantity}x {item.name} ({item.packSize})</span>
                            <span style={{ color: '#666' }}>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div style={{ fontSize: '12px', color: '#666', borderTop: '1px solid #eaeaea', paddingTop: '8px', width: '100%' }}>
                      <strong>Delivering to:</strong> {order.address}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{color: '#666', marginTop: '16px'}}>No requests yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
