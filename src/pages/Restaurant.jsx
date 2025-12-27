import React, { useEffect, useState } from 'react';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function isYouTubeUrl(url) {
  return /youtube\.com|youtu\.be/.test(url);
}

export default function Restaurant() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [mainIndex, setMainIndex] = useState(0);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`${apiBase}/api/restaurant`);
        const data = await res.json();
        setRestaurant(data[0] || null);
      } catch (err) {
        setError('Unable to load restaurant info');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading restaurant...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!restaurant) return <div className="p-8 text-center">No restaurant configured yet.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Hero */}
        <div className="relative">
          {restaurant.coverImage ? (
            <img src={restaurant.coverImage} alt={restaurant.name} className="w-full h-64 object-cover" />
          ) : (
            <div className="w-full h-64 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold">{restaurant.name}</div>
          )}
          <div className="absolute bottom-4 left-6 bg-white/80 backdrop-blur py-2 px-4 rounded">
            <h1 className="text-2xl font-extrabold text-gray-900">{restaurant.name}</h1>
            <p className="text-sm text-gray-700">{restaurant.description}</p>
          </div>
        </div>

        <div className="p-6">
          {/* Quick Info Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
              <div className="text-2xl mb-2">⭐</div>
              <div className="text-sm text-gray-600">Rating</div>
              <div className="text-2xl font-bold text-green-600">{restaurant.rating || '4.5'}/5</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="text-2xl mb-2">🚀</div>
              <div className="text-sm text-gray-600">Delivery</div>
              <div className="text-sm font-semibold text-blue-600">{restaurant.deliveryTime || '30-45 min'}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-sm text-gray-600">Min Order</div>
              <div className="text-sm font-semibold text-orange-600">${restaurant.minOrder || '15.00'}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
              <div className="text-2xl mb-2">✔️</div>
              <div className="text-sm text-gray-600">Status</div>
              <div className="text-sm font-semibold text-purple-600">Open Now</div>
            </div>
          </div>

          {/* Contact & Info Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pb-8 border-b">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Address</p>
                    <p className="text-gray-900">{restaurant.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">📞</span>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Phone</p>
                    <p className="text-gray-900">{restaurant.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xl">⏰</span>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Hours</p>
                    <p className="text-gray-900">{restaurant.hours}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {restaurant.specialties && restaurant.specialties.length > 0 ? (
                  restaurant.specialties.map((s, i) => (
                    <span key={i} className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">{s}</span>
                  ))
                ) : (
                  <p className="text-gray-600">No specialties listed</p>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-8 pb-8 border-b">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">About {restaurant.name}</h2>
            <p className="text-gray-700 leading-relaxed text-lg mb-4">
              {restaurant.description || 'Welcome to our restaurant! We pride ourselves on delivering the finest dining experience.'}
            </p>
            {restaurant.longDescription && (
              <p className="text-gray-600 leading-relaxed mb-4">
                {restaurant.longDescription}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">🍽️ Quality</h4>
                <p className="text-sm text-gray-600">We use only the freshest ingredients sourced from trusted suppliers.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">⚡ Speed</h4>
                <p className="text-sm text-gray-600">Fast and reliable delivery to your doorstep within 30-45 minutes.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">❤️ Care</h4>
                <p className="text-sm text-gray-600">We care about your satisfaction and always strive for excellence.</p>
              </div>
            </div>
          </div>

          {/* Gallery: main viewer + thumbnails */}
          {restaurant.gallery && restaurant.gallery.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Gallery</h2>

              <div className="w-full rounded overflow-hidden bg-gray-100">
                <img
                  src={restaurant.gallery[mainIndex]}
                  alt={`${restaurant.name}-photo-${mainIndex}`}
                  className="w-full h-80 sm:h-96 object-cover transition-transform duration-300 hover:scale-105 cursor-zoom-in"
                  loading="lazy"
                  onClick={() => setPreviewImage(restaurant.gallery[mainIndex])}
                />
              </div>

              <div className="mt-3 flex gap-2 overflow-x-auto py-2">
                {restaurant.gallery.map((g, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainIndex(idx)}
                    className={`flex-shrink-0 rounded overflow-hidden ring-2 ${idx === mainIndex ? 'ring-green-600' : 'ring-transparent'} focus:outline-none`}
                    aria-label={`Show photo ${idx + 1}`}
                  >
                    <img src={g} alt={`thumb-${idx}`} className="h-20 w-28 object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {restaurant.videos && restaurant.videos.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Videos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {restaurant.videos.map((v, i) => (
                  <div key={i} className="aspect-video bg-black rounded overflow-hidden">
                    {isYouTubeUrl(v) ? (
                      <iframe
                        className="w-full h-full"
                        src={v.includes('embed') ? v : v.replace('watch?v=', 'embed/')}
                        title={`video-${i}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video src={v} controls className="w-full h-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Why Choose Us Section */}
          <div className="mt-6 mb-8 pb-8 border-b">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Why Choose Us?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 text-3xl">🎯</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Authentic Flavors</h3>
                  <p className="text-sm text-gray-600">Experience traditional recipes prepared by our expert chefs with years of culinary experience.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 text-3xl">🥗</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fresh Ingredients</h3>
                  <p className="text-sm text-gray-600">We source the finest fresh ingredients daily from local and premium suppliers.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 text-3xl">🚚</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quick Delivery</h3>
                  <p className="text-sm text-gray-600">Fast and reliable delivery with professional delivery personnel to ensure food arrives hot and fresh.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 text-3xl">💳</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Easy Payment</h3>
                  <p className="text-sm text-gray-600">Multiple payment options including cash, card, UPI and digital wallets for your convenience.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 text-3xl">⭐</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Customer Ratings</h3>
                  <p className="text-sm text-gray-600">Trusted by thousands of customers with excellent reviews and consistent quality service.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 text-3xl">🔒</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Hygiene & Safety</h3>
                  <p className="text-sm text-gray-600">Certified food safety standards and strict hygiene protocols in all food preparation.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sections / Menu */}
          <div className="mt-6 mb-8 pb-8 border-b">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Our Menu</h2>
            {restaurant.sections && restaurant.sections.length > 0 ? (
              restaurant.sections.map((section) => (
                <div key={section.title} className="mb-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold">{section.title}</h3>
                    {section.description && <p className="text-gray-500">{section.description}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {section.items && section.items.length > 0 ? (
                      section.items.map((it, idx) => (
                        <div key={idx} className="border rounded-lg p-4 bg-gray-50">
                          {it.imageUrl && <img src={it.imageUrl} alt={it.name} className="h-32 w-full object-cover rounded-md mb-3" />}
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium">{it.name}</h4>
                            <div className="text-green-600 font-bold">${it.price?.toFixed(2)}</div>
                          </div>
                          {it.description && <p className="text-sm text-gray-600 mt-2">{it.description}</p>}
                          <button className="mt-4 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Add to cart</button>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">No items in this section.</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No sections configured for this restaurant.</div>
            )}
          </div>

          {/* Customer Testimonials Section */}
          <div className="mt-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">What Our Customers Say</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm mb-3 italic">"Amazing food! The flavors are authentic and the delivery was super fast. Highly recommend!"</p>
                <p className="font-semibold text-gray-900">Sarah Johnson</p>
                <p className="text-xs text-gray-600">Verified Customer</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm mb-3 italic">"Best restaurant in town! Fresh ingredients and excellent customer service. Will order again!"</p>
                <p className="font-semibold text-gray-900">Mike Chen</p>
                <p className="text-xs text-gray-600">Verified Customer</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm mb-3 italic">"Consistently good quality and taste. Great value for money. Highly satisfied with every order!"</p>
                <p className="font-semibold text-gray-900">Emma Davis</p>
                <p className="text-xs text-gray-600">Verified Customer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image preview lightbox */}
      {previewImage && (
        <Lightbox images={restaurant.gallery} start={previewImage} onClose={() => setPreviewImage(null)} />
      )}
    </div>
  );
}

function Lightbox({ images = [], start = null, onClose }) {
  const [idx, setIdx] = useState(start ? images.indexOf(start) : 0);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
      if (e.key === 'ArrowRight') setIdx((i) => (i === images.length - 1 ? 0 : i + 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [images.length, onClose]);

  if (!images || images.length === 0) return null;

  const prev = () => setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <button onClick={onClose} className="absolute right-6 top-6 text-white text-2xl">✕</button>
      <button onClick={prev} className="absolute left-6 text-white text-4xl">‹</button>
      <div className="max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
        <img src={images[idx]} alt={`lightbox-${idx}`} className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-xl" loading="lazy" />
      </div>
      <button onClick={next} className="absolute right-6 text-white text-4xl">›</button>
    </div>
  );
}
