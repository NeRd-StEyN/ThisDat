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
    fullName: '', phone: '', address: '', city: '', state: '', pincode: '',
  });

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
    if (savedAddr) setAddrForm({ ...savedAddr });
    else setAddrForm({ fullName: user?.displayName || '', phone: '', address: '', city: '', state: '', pincode: '' });
    setEditingAddress(true);
  };

  const handleSaveAddress = async () => {
    if (!addrForm.fullName || !addrForm.address || !addrForm.city || !addrForm.state || !addrForm.pincode) {
      toast.error('Please fill in all required fields', 'Missing Fields');
      return;
    }
    await saveAddress(addrForm, user?.uid);
    setSavedAddr({ ...addrForm });
    setEditingAddress(false);
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

  const handleAddrChange = (e) => setAddrForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

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
                <input name="state" placeholder="State" value={addrForm.state} onChange={handleAddrChange} />
                <input name="pincode" placeholder="PIN Code" value={addrForm.pincode} onChange={handleAddrChange} />
                <div className="addr-actions">
                  <button onClick={handleSaveAddress} className="btn-save">Save Address</button>
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
            <h3><Package size={20} /> Order History</h3>
            {orders.length > 0 ? (
              <div className="profile-1mg__orders">
                {orders.map((order, i) => (
                  <div key={i} className="profile-1mg__order-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <div>
                        <p style={{ marginBottom: '4px' }}><strong>Order #{order.id}</strong></p>
                        <p style={{ fontSize: '12px', color: '#767676' }}>{new Date(order.date).toLocaleString()}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p className="price" style={{ fontSize: '16px' }}>{formatPrice(order.total)}</p>
                        <p style={{ fontSize: '12px', color: '#1aab2a', fontWeight: 'bold' }}>{order.status}</p>
                      </div>
                    </div>
                    
                    {order.items && order.items.length > 0 && (
                      <div style={{ width: '100%', background: '#f9f9f9', padding: '12px', borderRadius: '4px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#666' }}>ITEMS ORDERED</p>
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
              <p style={{color: '#666', marginTop: '16px'}}>No orders yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
