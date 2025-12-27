import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Custom Arrow Components
const NextArrow = ({ onClick }) => (
  <div
    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/90 hover:bg-white rounded-full p-2 shadow-lg"
    onClick={onClick}
  >
    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/90 hover:bg-white rounded-full p-2 shadow-lg"
    onClick={onClick}
  >
    <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </div>
);

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingStats, setRatingStats] = useState({ average: 0, total: 0 });

  useEffect(() => {
    fetchMenuItems();
    fetchRatings();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/menu`);
      setMenuItems(response.data.filter(item => item.available));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu:', error);
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/ratings/average`);
      setRatingStats(response.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  // Group items by category
  const categories = ['Pizza', 'Burger', 'Pasta', 'Salad', 'Dessert', 'Beverage', 'Asian'];
  
  const getItemsByCategory = (category) => {
    let items = menuItems.filter(item => item.category === category);
    // Limit Dessert, Beverage, and Asian to 4 items
    if (['Dessert', 'Beverage', 'Asian'].includes(category) && items.length > 4) {
      items = items.slice(0, 4);
    }
    return items;
  };

  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  const handleExploreMenu = () => {
    if (user) {
      if (user.isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/customer-dashboard');
      }
    } else {
      navigate('/login');
    }
  };

  const handleItemClick = () => {
    handleExploreMenu();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading delicious food... 🍕</div>
      </div>
    );
  }

  // Hero image carousel settings
  const heroCarouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    fade: true,
    arrows: false,
    pauseOnHover: false,
  };

  // Hero images - beautiful food photography
  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&h=700&fit=crop&q=80',
      title: 'Delicious Pizza',
      subtitle: 'Fresh from the oven, made with love'
    },
    {
      url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&h=700&fit=crop&q=80',
      title: 'Juicy Burgers',
      subtitle: 'Made with premium ingredients'
    },
    {
      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600&h=700&fit=crop&q=80',
      title: 'Healthy Salads',
      subtitle: 'Fresh and nutritious every day'
    },
    {
      url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=1600&h=700&fit=crop&q=80',
      title: 'Authentic Pasta',
      subtitle: 'Italian perfection in every bite'
    },
    {
      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&h=700&fit=crop&q=80',
      title: 'Wood-Fired Pizza',
      subtitle: 'Crispy crust, amazing flavors'
    },
    {
      url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&h=700&fit=crop&q=80',
      title: 'Gourmet Burgers',
      subtitle: 'Stacked high with fresh toppings'
    },
    {
      url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=1600&h=700&fit=crop&q=80',
      title: 'Fresh Pasta Dishes',
      subtitle: 'Homemade pasta, traditional sauces'
    },
    {
      url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=700&fit=crop&q=80',
      title: 'Delightful Meals',
      subtitle: 'Prepared fresh daily'
    },
    {
      url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1600&h=700&fit=crop&q=80',
      title: 'Healthy Bowls',
      subtitle: 'Nutritious and delicious options'
    },
    {
      url: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=1600&h=700&fit=crop&q=80',
      title: 'Fresh Ingredients',
      subtitle: 'Quality you can taste'
    },
    {
      url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1600&h=700&fit=crop&q=80',
      title: 'Gourmet Burgers',
      subtitle: 'Flame-grilled to perfection'
    },
    {
      url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1600&h=700&fit=crop&q=80',
      title: 'Artisan Pizza',
      subtitle: 'Handcrafted with finest ingredients'
    },
    {
      url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1600&h=700&fit=crop&q=80',
      title: 'Creamy Pasta',
      subtitle: 'Rich flavors, perfect texture'
    },
    {
      url: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=1600&h=700&fit=crop&q=80',
      title: 'Breakfast Delights',
      subtitle: 'Start your day right'
    },
    {
      url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600&h=700&fit=crop&q=80',
      title: 'Vibrant Salads',
      subtitle: 'Farm to table freshness'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image Carousel */}
      <div className="relative overflow-hidden">
        <Slider {...heroCarouselSettings}>
          {heroImages.map((image, index) => (
            <div key={index} className="relative">
              <div className="relative h-[500px] md:h-[600px]">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/1200x600/10b981/ffffff?text=Delicious+Food';
                  }}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                
                {/* Text overlay */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-6">
                    <div className="max-w-2xl text-white">
                      <h2 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">
                        {image.title}
                      </h2>
                      <p className="text-2xl md:text-3xl mb-8 opacity-90">
                        {image.subtitle}
                      </p>
                      <div className="flex items-center gap-6 mb-8">
                        {ratingStats.total > 0 && (
                          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-400 text-2xl">⭐</span>
                              <span className="text-2xl font-bold">{ratingStats.average.toFixed(1)}</span>
                              <span className="text-lg opacity-80">({ratingStats.total} reviews)</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-4 flex-wrap">
                        <button
                          onClick={handleExploreMenu}
                          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transform hover:scale-105 transition-all shadow-lg"
                        >
                          🍽️ Order Now
                        </button>
                        {!user && (
                          <button
                            onClick={() => navigate('/signup')}
                            className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg"
                          >
                            Get Started
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Get your food delivered in 30-45 minutes</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold mb-2">Fresh & Quality</h3>
            <p className="text-gray-600">Made with fresh ingredients daily</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">💯</div>
            <h3 className="text-xl font-bold mb-2">100% Satisfaction</h3>
            <p className="text-gray-600">We guarantee you'll love our food</p>
          </div>
        </div>
      </div>

      {/* Food Carousels - 7 Categories */}
      <div className="container mx-auto px-6 pb-16">
        {categories.map((category, index) => {
          const items = getItemsByCategory(category);
          if (items.length === 0) return null;

          return (
            <div key={category} className="mb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  {category === 'Pizza' && '🍕'} 
                  {category === 'Burger' && '🍔'} 
                  {category === 'Pasta' && '🍝'} 
                  {category === 'Salad' && '🥗'} 
                  {category === 'Dessert' && '🍰'} 
                  {category === 'Beverage' && '🥤'} 
                  {category === 'Asian' && '🍜'} 
                  {' '}{category}
                </h2>
                <button
                  onClick={handleExploreMenu}
                  className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2"
                >
                  View All
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="relative">
                <Slider {...carouselSettings}>
                  {items.map((item) => (
                    <div key={item._id} className="px-2">
                      <div
                        onClick={handleItemClick}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer"
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={item.imageUrl || 'https://via.placeholder.com/400x300?text=Delicious+Food'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x300?text=Delicious+Food';
                            }}
                          />
                          <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            ${item.price.toFixed(2)}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2 truncate">{item.name}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">⏱️ 30-45 min</span>
                            <button className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition">
                              Order Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of satisfied customers</p>
          <button
            onClick={handleExploreMenu}
            className="bg-white text-green-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all shadow-lg"
          >
            Order Now 🍕
          </button>
        </div>
      </div>
    </div>
  );
}
