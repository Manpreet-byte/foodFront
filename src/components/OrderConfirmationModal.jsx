import React from 'react';
import { useNavigate } from 'react-router-dom';
import MapView from './MapView';

export default function OrderConfirmationModal({ open, order, onClose }) {
  const navigate = useNavigate();
  if (!open) return null;

  const orderIdShort = order?._id ? order._id.slice(-8).toUpperCase() : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold">Order Confirmed</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="mt-4">
          <p className="text-gray-700">Thank you! Your order <span className="font-semibold">#{orderIdShort}</span> has been placed.</p>
          <p className="text-gray-600 mt-2">Total: <span className="font-bold text-green-600">${order?.totalAmount?.toFixed(2)}</span></p>

          {order?.latitude && order?.longitude && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Delivery Location</h4>
              <MapView latitude={order.latitude} longitude={order.longitude} height={200} />
            </div>
          )}

          <div className="mt-4">
            <h3 className="font-medium">Items</h3>
            <ul className="mt-2 space-y-2 max-h-40 overflow-auto">
              {order?.items?.map((it, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>{it.menuItem?.name || it.menuItem} × {it.quantity}</span>
                  <span className="font-medium">${(it.price * it.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={() => { onClose(); navigate('/order-history'); }} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">View Order History</button>
            <button onClick={() => { onClose(); navigate('/'); }} className="flex-1 border border-gray-300 py-2 rounded">Continue Browsing</button>
          </div>
        </div>
      </div>
    </div>
  );
}
