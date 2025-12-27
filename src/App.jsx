import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import AuthGoogleSuccess from './pages/AuthGoogleSuccess';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import Restaurant from './pages/Restaurant';
import RatingsPage from './pages/RatingsPage';

function PrivateRoute({ children, adminOnly }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/customer-dashboard" element={<PrivateRoute><CustomerDashboard /></PrivateRoute>} />
              <Route path="/restaurant" element={<Restaurant />} />
              <Route path="/rate" element={<RatingsPage />} />
              <Route path="/admin-dashboard" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
              <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth/google/success" element={<AuthGoogleSuccess />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
