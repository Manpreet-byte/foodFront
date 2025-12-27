import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentItems, setRecentItems] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Fetch recent orders to show order history
  useEffect(() => {
    const fetchRecentOrders = async () => {
      if (!user) {
        setLoadingRecent(false);
        return;
      }
      
      setLoadingRecent(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/orders/my-orders`);
        
        if (!res.data || res.data.length === 0) {
          setRecentItems([]);
          setLoadingRecent(false);
          return;
        }
        
        // Extract unique menu items from recent orders (last 3 orders)
        const recentOrders = res.data.slice(0, 3);
        const itemsMap = new Map();
        
        recentOrders.forEach(order => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach(({ menuItem }) => {
              if (menuItem && menuItem._id && !itemsMap.has(menuItem._id)) {
                itemsMap.set(menuItem._id, menuItem);
              }
            });
          }
        });
        
        const items = Array.from(itemsMap.values()).slice(0, 6); // Show max 6 items
        setRecentItems(items);
      } catch (err) {
        console.error('Error fetching recent orders:', err);
        setRecentItems([]);
      } finally {
        setLoadingRecent(false);
      }
    };

    fetchRecentOrders();
  }, [user]);

  const handleAddRecentItem = (item) => {
    addToCart(item);
  };

  if (cart.items.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        <p className="text-gray-500">Your cart is empty</p>

        {/* Recently Ordered Section for Empty Cart */}
        {user && recentItems.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recently Ordered
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentItems.map((item) => (
                <div key={item._id} className="flex gap-3 border rounded-lg p-3 hover:shadow-md transition">
                  <img 
                    src={item.imageUrl || item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
                    <button
                      onClick={() => handleAddRecentItem(item)}
                      className="mt-1 text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    >
                      + Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart ({cart.items.length} items)</h2>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item._id} className="flex gap-4 border-b pb-4">
            <img 
              src={item.imageUrl} 
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-gray-600 text-sm">${item.price.toFixed(2)} each</p>
              
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="px-3 py-1 hover:bg-gray-100 text-lg font-semibold"
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-4 py-1 border-x min-w-[3rem] text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-100 text-lg font-semibold"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold">Total:</span>
          <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-semibold"
        >
          Proceed to Checkout
        </button>
      </div>

      {/* Recently Ordered Section */}
      {user && recentItems.length > 0 && (
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recently Ordered
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentItems.map((item) => (
              <div key={item._id} className="flex gap-3 border rounded-lg p-3 hover:shadow-md transition">
                <img 
                  src={item.imageUrl || item.image} 
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                  <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
                  <button
                    onClick={() => handleAddRecentItem(item)}
                    className="mt-1 text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                  >
                    + Add Again
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
