import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import OrderConfirmationModal from '../components/OrderConfirmationModal';
import MapPicker from '../components/MapPicker';
import Cart from '../components/Cart';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    email: '',
    paymentMethod: 'cash',
    deliveryTime: 'asap'
  });
  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!formData.address.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('Please enter phone number');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Please enter email address');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const orderPayload = {
        items: cart.items.map(({ _id, quantity, price }) => ({ 
          menuItem: _id, 
          quantity,
          price 
        })),
        totalAmount: total,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        paymentMethod: formData.paymentMethod,
        deliveryTime: formData.deliveryTime
      };

      // include coordinates when available
      if (typeof formData.latitude === 'number') orderPayload.latitude = formData.latitude;
      if (typeof formData.longitude === 'number') orderPayload.longitude = formData.longitude;

      const response = await axios.post(`${apiUrl}/api/orders`, orderPayload);

      // Show confirmation modal with order details
      setConfirmedOrder(response.data);
      setShowModal(true);
      clearCart();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto p-8">
        <Cart />
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/customer-dashboard')}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Your Order</h1>

      {/* Display Cart Component */}
      <div className="mb-8">
        <Cart />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Delivery Information</h2>
          
          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Delivery Address *</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
                placeholder="Enter your complete delivery address"
                required
              />
              <MapPicker
                initialAddress={formData.address}
                onSelect={({ address, latitude, longitude }) => setFormData({ ...formData, address: address || formData.address, latitude, longitude })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., +1 234 567 8900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., your-email@example.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">We'll send order confirmation and updates to this email</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="styled-select w-full"
              >
                <option value="cash">Cash on Delivery</option>
                <option value="card">Credit/Debit Card</option>
                <option value="upi">UPI/Digital Wallet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Delivery Time</label>
              <select
                value={formData.deliveryTime}
                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                className="styled-select w-full"
              >
                <option value="asap">As Soon As Possible (30-45 min)</option>
                <option value="1hour">In 1 Hour</option>
                <option value="2hours">In 2 Hours</option>
                <option value="evening">This Evening (6-8 PM)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary Section */}
        <div className="bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item._id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-600">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-green-600 text-sm">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-xl font-bold text-green-600">
                ${total.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-600 bg-blue-50 p-3 rounded">
              💡 Add more items from recently ordered to quickly reorder your favorites!
            </p>
          </div>
        </div>
      </div>
    </div>
    <OrderConfirmationModal open={showModal} order={confirmedOrder} onClose={() => setShowModal(false)} />
    </>
  );
}
