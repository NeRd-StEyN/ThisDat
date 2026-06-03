import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signUpWithEmail, signInWithEmail, signInWithGoogle, logout } from '../config/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = async (email, password, displayName) => {
    return await signUpWithEmail(email, password, displayName);
  };

  const login = async (email, password) => {
    return await signInWithEmail(email, password);
  };

  const loginWithGoogle = async () => {
    return await signInWithGoogle();
  };

  const logoutUser = async () => {
    return await logout();
  };

  const value = {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout: logoutUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
