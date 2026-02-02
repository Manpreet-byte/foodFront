import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from './MapView';
import { Confetti } from './AnimatedElements';

export default function OrderConfirmationModal({ open, order, onClose }) {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    if (open) {
      setShowConfetti(true);
      // Keep confetti for 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [open]);

  if (!open) return null;

  const orderIdShort = order?._id ? order._id.slice(-8).toUpperCase() : '';

  return (
    <>
      <Confetti active={showConfetti} />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-pop-in">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pop-in">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed! 🎉</h2>
            <p className="text-gray-600">Your delicious food is on its way</p>
          </div>

          <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-bold text-lg text-gray-900">#{orderIdShort}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="font-black text-2xl text-green-600">₹{order?.totalAmount?.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="mt-4 flex items-center justify-center gap-2 text-orange-600 bg-orange-50 rounded-lg py-3">
            <svg className="w-5 h-5 animate-floating" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">Estimated delivery: 30-45 minutes</span>
          </div>

          {order?.latitude && order?.longitude && (
            <div className="mt-4">
              <h4 className="font-medium mb-2 text-gray-700">📍 Delivery Location</h4>
              <div className="rounded-xl overflow-hidden border-2 border-gray-200">
                <MapView latitude={order.latitude} longitude={order.longitude} height={180} />
              </div>
            </div>
          )}

          <div className="mt-4">
            <h3 className="font-semibold text-gray-700 mb-2">🛒 Order Items</h3>
            <ul className="space-y-2 max-h-32 overflow-auto bg-gray-50 rounded-lg p-3">
              {order?.items?.map((it, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700">{it.menuItem?.name || it.menuItem} × {it.quantity}</span>
                  <span className="font-medium text-gray-900">₹{(it.price * it.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex gap-3">
            <button 
              onClick={() => { onClose(); navigate('/order-history'); }} 
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105"
            >
              Track Order
            </button>
            <button 
              onClick={() => { onClose(); navigate('/'); }} 
              className="flex-1 border-2 border-gray-300 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
