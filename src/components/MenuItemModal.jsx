import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const MenuItemModal = ({ item, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeView, setActiveView] = useState('photos'); // 'photos' | 'video'
  const { addToCart } = useCart();

  if (!item) return null;

  // Use imageGallery if available, otherwise fall back to single image
  const images = item.imageGallery && item.imageGallery.length > 0 
    ? item.imageGallery 
    : [item.image || item.imageUrl || 'https://via.placeholder.com/800x600?text=Delicious+Food'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
    toast.success(`${quantity} × ${item.name} added to cart!`);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Gallery Section */}
          <div className="relative h-96 md:h-auto bg-gray-100">
            {/* Toggle between Photos and Video when available */}
            {item.videoUrl && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/90 rounded-full shadow flex overflow-hidden">
                <button
                  className={`px-4 py-1 text-sm ${activeView === 'photos' ? 'bg-orange-500 text-white' : 'text-gray-700'}`}
                  onClick={() => setActiveView('photos')}
                >
                  Photos
                </button>
                <button
                  className={`px-4 py-1 text-sm ${activeView === 'video' ? 'bg-orange-500 text-white' : 'text-gray-700'}`}
                  onClick={() => setActiveView('video')}
                >
                  Video
                </button>
              </div>
            )}

            {activeView === 'video' && item.videoUrl ? (
              <div className="w-full h-full">
                {/[?&]v=|youtu\.be|youtube\.com/.test(item.videoUrl) ? (
                  <iframe
                    className="w-full h-full"
                    src={item.videoUrl.includes('embed') ? item.videoUrl : item.videoUrl.replace('watch?v=', 'embed/')}
                    title={`${item.name} video`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={item.videoUrl} controls className="w-full h-full object-cover" />
                )}
              </div>
            ) : (
              <img
                src={images[currentImageIndex]}
                alt={`${item.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600?text=Delicious+Food';
                }}
              />
            )}
            
            {/* Image Navigation Arrows - Only show if multiple images */}
            {activeView === 'photos' && images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all transform hover:scale-110"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all transform hover:scale-110"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {images.length}
                </div>

                {/* Thumbnail Preview */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-orange-500 scale-110' 
                          : 'border-white/50 hover:border-white'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`Thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80x80?text=Food';
                        }}
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
            
            {/* Badges */}
            {item.isVegetarian && (
              <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <span className="text-lg">🌱</span> Vegetarian
              </div>
            )}
            {item.category && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                {item.category}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              {/* Header */}
              <div className="mb-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{item.name}</h2>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(item.rating || 4.5) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-gray-600 text-sm">({item.rating || '4.5'}/5)</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-orange-500">₹{item.price}</p>
                {item.preparationTime && (
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ready in {item.preparationTime} mins
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>

              {/* Ingredients */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergens */}
              {item.allergens && item.allergens.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span>⚠️</span> Allergen Information
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.allergens.map((allergen, index) => (
                      <span
                        key={index}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nutritional Information */}
              {item.nutritionalInfo && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Nutritional Information</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {item.nutritionalInfo.calories && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Calories</p>
                        <p className="text-lg font-bold text-blue-600">{item.nutritionalInfo.calories}</p>
                      </div>
                    )}
                    {item.nutritionalInfo.protein && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Protein</p>
                        <p className="text-lg font-bold text-green-600">{item.nutritionalInfo.protein}</p>
                      </div>
                    )}
                    {item.nutritionalInfo.carbs && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Carbs</p>
                        <p className="text-lg font-bold text-yellow-600">{item.nutritionalInfo.carbs}</p>
                      </div>
                    )}
                    {item.nutritionalInfo.fat && (
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Fat</p>
                        <p className="text-lg font-bold text-orange-600">{item.nutritionalInfo.fat}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Section */}
            <div className="border-t pt-6 mt-6">
              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-gray-700 font-semibold">Quantity:</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-10 h-10 rounded-full font-bold transition-colors"
                  >
                    −
                  </button>
                  <span className="text-xl font-bold text-gray-800 w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 w-10 h-10 rounded-full font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Add {quantity} to Cart - ₹{item.price * quantity}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemModal;
