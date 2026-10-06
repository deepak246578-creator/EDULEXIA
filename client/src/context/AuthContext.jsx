/**
 * AUTHENTICATION CONTEXT
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth: check for existing valid session, otherwise prompt login
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('dyslexia_auth_token');
      if (storedToken) {
        try {
          const data = await api.getMe();
          setUser(data.user);
          setProfile(data.profile);
        } catch (err) {
          console.warn('[Auth] Stored session invalid, clearing token:', err.message);
          localStorage.removeItem('dyslexia_auth_token');
          setUser(null);
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loadDemoUser = async (role = 'student') => {
    try {
      const data = await api.switchDemo(role);
      localStorage.setItem('dyslexia_auth_token', data.token);
      setUser(data.user);
      setProfile(data.profile);
    } catch (err) {
      console.error('[Auth] Failed to load demo account:', err);
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await api.login(email, password);
      localStorage.setItem('dyslexia_auth_token', data.token);
      setUser(data.user);
      setProfile(data.profile);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (name, email, password, role, studentId) => {
    setError(null);
    try {
      const data = await api.register(name, email, password, role, studentId);
      localStorage.setItem('dyslexia_auth_token', data.token);
      setUser(data.user);
      setProfile(data.profile);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const switchRole = async (targetRole) => {
    setError(null);
    try {
      const data = await api.switchDemo(targetRole);
      localStorage.setItem('dyslexia_auth_token', data.token);
      setUser(data.user);
      setProfile(data.profile);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('dyslexia_auth_token');
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user && user.role === 'student') {
      try {
        const data = await api.getStudentProfile(user.id);
        setProfile(data.profile);
      } catch (err) {
        console.error('[Auth] Refresh profile error:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        login,
        register,
        switchRole,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
