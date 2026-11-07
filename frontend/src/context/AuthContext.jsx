import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('cafe_admin_token') || null;
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const user = localStorage.getItem('cafe_admin_user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  });

  const login = async (username, password) => {
    try {
      const response = await api.post('/admin/login', { username, password });
      if (response.data && response.data.success) {
        const { token: receivedToken, admin } = response.data;
        setToken(receivedToken);
        setAdminUser(admin);
        localStorage.setItem('cafe_admin_token', receivedToken);
        localStorage.setItem('cafe_admin_user', JSON.stringify(admin));
        return { success: true };
      }
      return { success: false, message: response.data.message || 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, message };
    }
  };

  const logout = () => {
    setToken(null);
    setAdminUser(null);
    try {
      localStorage.removeItem('cafe_admin_token');
      localStorage.removeItem('cafe_admin_user');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        adminUser,
        isAuthenticated: Boolean(token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

