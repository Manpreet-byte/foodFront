import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-green-600 p-4 flex justify-between items-center text-white shadow-lg">
      <Link to="/" className="font-bold text-2xl hover:text-green-100 transition">
        FoodOrder
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link 
              to="/" 
              className="hover:text-green-100 transition font-medium"
            >
              Home
            </Link>
            {user.isAdmin ? (
              <Link 
                to="/admin-dashboard" 
                className="hover:text-green-100 transition font-medium"
              >
                Admin Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/customer-dashboard" 
                  className="hover:text-green-100 transition font-medium"
                >
                  Menu
                </Link>
                <Link
                  to="/restaurant"
                  className="hover:text-green-100 transition font-medium"
                >
                  Restaurant
                </Link>
                <Link
                  to="/rate"
                  className="hover:text-green-100 transition font-medium"
                >
                  Rate
                </Link>
                <Link 
                  to="/checkout" 
                  className="relative hover:text-green-100 transition font-medium flex items-center"
                >
                  Cart
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            <span className="text-sm hidden md:inline">
              Hi, {user.name}!
            </span>
            <button 
              onClick={handleLogout} 
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-medium transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/restaurant"
              className="hover:text-green-100 transition font-medium"
            >
              Restaurant
            </Link>
            <Link
              to="/rate"
              className="hover:text-green-100 transition font-medium"
            >
              Rate
            </Link>
            <Link 
              to="/login" 
              className="hover:text-green-100 transition font-medium"
            >
              Login
            </Link>
            <Link 
              to="/signup"
              className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded font-medium transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
