import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, UserPlus, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import './Auth.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, name);
      toast.success('Account created successfully!', 'Welcome to ThisDat');
      navigate('/');
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use' ? 'An account with this email already exists'
        : err.code === 'auth/invalid-email' ? 'Invalid email address'
        : err.code === 'auth/weak-password' ? 'Password is too weak. Use at least 6 characters.'
        : 'Sign up failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Welcome to ThisDat!', 'Account Ready');
      navigate('/');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="signup-page">
      <div className="auth-card">
        <div className="auth-card__logo">
          <div className="auth-card__logo-icon">TD</div>
          <span className="auth-card__logo-text">ThisDat</span>
        </div>

        <h1 className="auth-card__title">Create Account</h1>
        <p className="auth-card__subtitle">Join ThisDat for the best medicine deals</p>

        <form className="auth-form" onSubmit={handleSubmit} id="signup-form">
          {error && (
            <div className="auth-form__error">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="signup-name">Full Name</label>
            <div className="auth-form__input-wrap">
              <User size={18} className="auth-form__input-icon" />
              <input
                id="signup-name"
                type="text"
                className="auth-form__input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="signup-email">Email Address</label>
            <div className="auth-form__input-wrap">
              <Mail size={18} className="auth-form__input-icon" />
              <input
                id="signup-email"
                type="email"
                className="auth-form__input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="signup-password">Password</label>
            <div className="auth-form__input-wrap">
              <Lock size={18} className="auth-form__input-icon" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                className="auth-form__input"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-form__toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="auth-form__field">
            <label className="auth-form__label" htmlFor="signup-confirm-password">Confirm Password</label>
            <div className="auth-form__input-wrap">
              <Lock size={18} className="auth-form__input-icon" />
              <input
                id="signup-confirm-password"
                type={showPassword ? 'text' : 'password'}
                className="auth-form__input"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className="auth-form__submit" disabled={loading} id="signup-submit">
            {loading ? <div className="spinner spinner--white" style={{ width: 20, height: 20 }} /> : (
              <><UserPlus size={18} /> Create Account</>
            )}
          </button>

          <div className="auth-form__divider">
            <div className="auth-form__divider-line" />
            <span className="auth-form__divider-text">or</span>
            <div className="auth-form__divider-line" />
          </div>

          <button type="button" className="auth-form__google-btn" onClick={handleGoogleSignup} disabled={loading} id="google-signup">
            <svg className="auth-form__google-icon" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <div className="auth-card__footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
