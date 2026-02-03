import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const getApiUrl = () => import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
      }
      axios.defaults.withCredentials = true;
      return parsedUser;
    }
    return null;
  });

  const persistUser = (token, userData) => {
    const userWithToken = { ...userData, token };
    setUser(userWithToken);
    localStorage.setItem('user', JSON.stringify(userWithToken));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.defaults.withCredentials = true;
    return userWithToken;
  };

  const login = async (email, password) => {
    const res = await axios.post(`${getApiUrl()}/api/auth/login`, { email, password });
    const { token, user: userData } = res.data;
    return persistUser(token, userData);
  };

  const loginWithFirebaseIdToken = async (idToken) => {
    const res = await axios.post(`${getApiUrl()}/api/auth/firebase`, { idToken });
    const { token, user: userData } = res.data;
    return persistUser(token, userData);
  };

  const setUserFromToken = async (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.defaults.withCredentials = true;
      const res = await axios.get(`${getApiUrl()}/api/auth/me`);
      const userData = res.data.user;
      persistUser(token, userData);
    }
  };

  const signup = async (name, email, password) => {
    const res = await axios.post(`${getApiUrl()}/api/auth/signup`, { name, email, password });
    const { token, user: userData } = res.data;
    return persistUser(token, userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, setUserFromToken, loginWithFirebaseIdToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
