import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login, loginWithFirebaseIdToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      toast.success('Logged in successfully!');
      if (userData.isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/customer-dashboard');
      }
    } catch {
      toast.error('Invalid credentials.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      try {
        const userData = await loginWithFirebaseIdToken(idToken);
        toast.success('Logged in with Google!');
        if (userData.isAdmin) {
          navigate('/admin-dashboard');
        } else {
          navigate('/customer-dashboard');
        }
      } catch (apiErr) {
        const errorMsg = apiErr.response?.data?.message || apiErr.message;
        console.error('Firebase API error:', errorMsg);
        
        // If it's a configuration error, show helpful message
        if (apiErr.response?.status === 500) {
          toast.error('Google login is not configured yet. Please use email/password login or contact admin.');
        } else {
          toast.error(errorMsg || 'Google sign-in failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Google sign-in failed', err);
      if (err.code === 'auth/popup-closed-by-user') {
        toast.info('Sign-in cancelled');
      } else if (err.code === 'auth/network-request-failed') {
        toast.error('Network error. Check your internet connection.');
      } else {
        toast.error('Google sign-in failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded shadow">
      <h2 className="text-2xl mb-4 text-center">Login</h2>
      <div className="flex justify-center mb-4">
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full text-center bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-70"
        >
          {googleLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
