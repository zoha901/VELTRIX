import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('veltrix_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('veltrix_token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore and verify authentication session on mount
  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem('veltrix_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Validate token against /api/auth/me
        const response = await api.get('/auth/me');
        if (response.data && response.data.success && response.data.data) {
          const verifiedUser = response.data.data;
          setUser(verifiedUser);
          localStorage.setItem('veltrix_user', JSON.stringify(verifiedUser));
        }
      } catch (err) {
        // If backend is unavailable or token invalid, check if we have stored user
        console.warn('Session verification notice:', err?.response?.data?.message || err.message);
        if (err?.response?.status === 401) {
          // Token is genuinely invalid or expired
          localStorage.removeItem('veltrix_token');
          localStorage.removeItem('veltrix_user');
          setToken(null);
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  // Login handler
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password,
      });

      if (response.data && response.data.success) {
        const { token: jwtToken, user: authenticatedUser } = response.data.data;
        
        localStorage.setItem('veltrix_token', jwtToken);
        localStorage.setItem('veltrix_user', JSON.stringify(authenticatedUser));
        
        setToken(jwtToken);
        setUser(authenticatedUser);
        setIsLoading(false);
        return { success: true, user: authenticatedUser };
      } else {
        const errorMsg = response.data?.message || 'Login failed. Please verify your credentials.';
        setError(errorMsg);
        setIsLoading(false);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? 'Invalid email or password. Please try again.'
          : 'Unable to connect to the authentication server. Please check your network or try again.');
      setError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  }, []);

  // Register handler (strictly enforced role)
  const register = useCallback(async (name, email, password, role = 'PATIENT') => {
    setIsLoading(true);
    setError(null);

    const normalizedRegRole = String(role).toUpperCase();

    try {
      const response = await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
        role: normalizedRegRole,
      });

      if (response.data && response.data.success) {
        setIsLoading(false);
        return { success: true, data: response.data.data, message: response.data.message };
      } else {
        const errorMsg = response.data?.message || 'Registration failed. Please check your information.';
        setError(errorMsg);
        setIsLoading(false);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.status === 409
          ? 'An account with this email address already exists.'
          : err.response?.status === 400
          ? 'Invalid registration details. Please verify all fields.'
          : 'Unable to connect to the registration server. Please try again.');
      setError(errorMsg);
      setIsLoading(false);
      return { success: false, error: errorMsg };
    }
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem('veltrix_token');
    localStorage.removeItem('veltrix_user');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Canonical role normalization
  const normalizedRole = user?.role ? String(user.role).toUpperCase() : null;
  const isTherapist = normalizedRole === 'THERAPIST';
  const isPatient = normalizedRole === 'PATIENT';
  const isAuthenticated = Boolean(token && user);

  const value = {
    user,
    token,
    role: normalizedRole,
    isTherapist,
    isPatient,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
