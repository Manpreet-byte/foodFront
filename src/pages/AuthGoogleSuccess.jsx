import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AuthGoogleSuccess() {
  const navigate = useNavigate();
  const { setUserFromToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    const finish = async () => {
      try {
        if (token) {
          await setUserFromToken(token);
        } else {
          // try cookie-based session
          // ask backend for current user (will include cookie if present)
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, { withCredentials: true });
          const user = res.data.user;
          // set axios header and localStorage
          const userWithToken = { ...user, token: null };
          // If backend used cookie only, we don't have token client-side; but app uses cookie for auth
          localStorage.setItem('user', JSON.stringify(userWithToken));
        }
        navigate('/');
      } catch (err) {
        console.error('Auth google finish error', err);
        navigate('/login');
      }
    };

    finish();
  }, [navigate, setUserFromToken]);

  return (
    <div className="p-8 text-center">
      <h2 className="text-xl">Signing you in...</h2>
    </div>
  );
}
