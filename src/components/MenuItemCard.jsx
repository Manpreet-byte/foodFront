import React, { useState } from 'react';
import MenuItemModal from './MenuItemModal';

// Helper function to generate estimated delivery time
const getDeliveryTime = (category) => {
  const deliveryTimes = {
    'Pizza': '35-45',
    'Burger': '25-35',
    'Pasta': '30-40',
    'Salad': '15-25',
    'Dessert': '20-30',
    'Beverage': '10-15',
    'Appetizer': '20-30',
    'Asian': '30-40',
    'Mexican': '25-35',
  };
  return deliveryTimes[category] || '30-40';
};

export default function MenuItemCard({ item }) {
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = () => {
    if (!item.available) {
      return;
    }
    setShowModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer transform hover:scale-105 transition-transform">
        <div className="relative" onClick={handleViewDetails}>
          <img
            src={item.imageUrl || 'https://via.placeholder.com/400x300?text=Delicious+Food'}
            alt={item.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Delicious+Food';
            }}
          />
          {!item.available && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-xl">Unavailable</span>
            </div>
          )}
          {item.available && (
            <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow text-xs font-medium text-gray-700">
              🕒 {getDeliveryTime(item.category)} min
            </div>
          )}
          {item.isVegetarian && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              🌱 Veg
            </div>
          )}
        </div>
        
        <div className="p-4" onClick={handleViewDetails}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-800 flex-1">{item.name}</h3>
            {item.rating && (
              <div className="flex items-center ml-2">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs text-gray-600 ml-1">{item.rating}</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 mb-3 text-sm line-clamp-2">{item.description}</p>
          
          {item.category && (
            <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded mb-3 font-medium">
              {item.category}
            </span>
          )}
          
          <div className="flex justify-between items-center mt-4">
            <span className="text-2xl font-bold text-orange-600">
              ₹{item.price?.toFixed(2) || '0.00'}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails();
              }}
              disabled={!item.available}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                item.available
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white cursor-pointer shadow-md'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {item.available ? 'View Details' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <MenuItemModal 
          item={item} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
}
