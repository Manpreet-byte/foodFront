import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MenuItemCard from '../components/MenuItemCard';
import { toast } from 'react-toastify';

export default function CustomerDashboard() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/menu`);
      setMenuItems(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching menu:', err);
      const errorMsg = err.response?.data?.message || 'Failed to load menu items';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Get unique, sorted, non-empty categories (keeps new items like Seafood visible)
  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category).filter(Boolean))).sort()];

  // Filter and sort menu items
  const filteredItems = menuItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory && item.available;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading delicious menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center bg-white p-8 rounded-lg shadow">
          <p className="text-xl text-red-600 mb-4">⚠️ {error}</p>
          <button
            onClick={fetchMenu}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-2 text-gray-800">Our Menu</h1>
      <p className="text-gray-600 mb-6">Choose from our delicious selection of {menuItems.length} items</p>
      
      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="styled-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'All' ? '📂 All Categories' : `${cat}`}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="styled-select"
          >
            <option value="name">Sort: A-Z</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || selectedCategory !== 'All') && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {searchTerm && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Search: "{searchTerm}"
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Category: {selectedCategory}
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="text-sm text-red-600 hover:text-red-800 underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-xl text-gray-600 mb-4">
            😕 No items found matching your criteria
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <MenuItemCard key={item._id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
