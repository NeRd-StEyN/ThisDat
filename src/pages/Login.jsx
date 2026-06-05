import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';
import AuthCarousel from '../components/AuthCarousel';
import './AuthModal.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error("Login error:", err);
      let errorMsg = err.message;
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email') {
        errorMsg = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/wrong-password') {
        errorMsg = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMsg = 'Too many attempts. Please try again later.';
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      console.error("Google login error:", err);
      let errorMsg = err.message;
      if (err.code === 'auth/popup-closed-by-user') {
        errorMsg = 'Google sign-in was cancelled.';
      }
      setError('Failed to log in with Google: ' + errorMsg);
    }
  };

  return (
    <div className="auth-1mg-backdrop" style={{ animation: 'fadeIn 0.3s ease forwards' }}>
      <div className="auth-1mg-modal animate-pop-in">
        <button className="auth-1mg-close" onClick={() => navigate('/')}>
          <X size={24} />
        </button>
        <div className="auth-1mg-left">
          <AuthCarousel />
        </div>
        <div className="auth-1mg-right">
          <h2>Login</h2>
          <p className="auth-subtitle">Get access to your orders, lab tests & doctor consultations</p>
          
          <form onSubmit={handleSubmit} className="auth-1mg-form">
            <div className="auth-1mg-input-group">
              <label>Enter Your email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="auth-1mg-input-group" style={{ marginTop: '16px' }}>
              <label>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <div className="auth-1mg-error">{error}</div>}

            <button type="submit" className="auth-1mg-submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>OR</span>
          </div>
          
          <button 
            type="button" 
            className="auth-google-btn" 
            onClick={handleGoogleLogin}
            style={{
              background: '#fff',
              border: '1px solid #ddd',
              color: '#333',
              padding: '10px',
              borderRadius: '4px',
              width: '100%',
              marginBottom: '16px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <div className="auth-1mg-footer">
            <p>New on ThisDat? <Link to="/signup">Sign Up</Link></p>
            <p className="terms">By logging in, you agree to our<br/>
            <Link to="/terms" onClick={(e) => { e.stopPropagation(); navigate('/terms'); }}>Terms and Conditions</Link> & <Link to="/privacy" onClick={(e) => { e.stopPropagation(); navigate('/privacy'); }}>Privacy Policy</Link></p>
            <Link to="/contact" className="need-help" style={{display: 'block'}} onClick={(e) => { e.stopPropagation(); navigate('/contact'); }}>Need Help? Get In Touch</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
