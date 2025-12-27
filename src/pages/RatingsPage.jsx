import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function RatingsPage() {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [allRatings, setAllRatings] = useState([]);
  const [stats, setStats] = useState({ average: 0, total: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ratings`);
      setAllRatings(res.data.ratings);
      setStats(res.data.stats);
    } catch (err) {
      console.error('Error fetching ratings:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a rating');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ratings`, {
        rating,
        comment,
        userName: user.name,
        userEmail: user.email,
      });
      toast.success('Thank you for your rating!');
      setRating(0);
      setComment('');
      fetchRatings();
    } catch (err) {
      toast.error('Failed to submit rating');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ratingId) => {
    if (!window.confirm('Are you sure you want to delete this rating?')) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ratings/${ratingId}`);
      toast.success('Rating deleted successfully');
      fetchRatings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete rating');
      console.error(err);
    }
  };

  const renderStars = (ratingValue, interactive = false, onHover = null, onClick = null) => {
    const displayRating = interactive && hoverRating > 0 ? hoverRating : ratingValue;
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onMouseEnter={interactive ? () => onHover && onHover(star) : undefined}
            onMouseLeave={interactive ? () => onHover && onHover(0) : undefined}
            onClick={interactive ? () => onClick && onClick(star) : undefined}
            disabled={!interactive}
            className={`text-3xl transition-all duration-150 ${
              star <= displayRating
                ? 'text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'hover:scale-125 cursor-pointer transform' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const getRatingText = (ratingValue) => {
    switch(ratingValue) {
      case 5: return '⭐ Excellent!';
      case 4: return '😊 Very Good!';
      case 3: return '🙂 Good';
      case 2: return '😐 Fair';
      case 1: return '😞 Needs Improvement';
      default: return 'Click to rate';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with Overall Stats */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow-xl p-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">Rate Our Service</h1>
        <div className="flex items-center gap-6">
          <div>
            <div className="text-6xl font-bold">{stats.average.toFixed(1)}</div>
            <div className="flex gap-1 mt-2">
              {renderStars(Math.round(stats.average))}
            </div>
          </div>
          <div className="text-lg">
            <p>Based on <strong>{stats.total}</strong> {stats.total === 1 ? 'review' : 'reviews'}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Rating Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Submit Your Rating</h2>
          {user ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Your Rating *</label>
                {renderStars(rating, true, setHoverRating, setRating)}
                <p className="text-sm text-gray-500 mt-2">
                  {getRatingText(hoverRating || rating)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Your Review (Optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                  className="w-full border rounded p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Tell us about your experience..."
                />
              </div>
              <button
                type="submit"
                disabled={loading || rating === 0}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Rating'}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Please login to submit a rating</p>
              <a href="/login" className="text-green-600 font-medium hover:underline">
                Go to Login →
              </a>
            </div>
          )}
        </div>

        {/* Recent Ratings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Reviews</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {allRatings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to rate us!</p>
            ) : (
              allRatings.map((r) => (
                <div key={r._id} className="border-b pb-4 hover:bg-gray-50 px-3 py-2 rounded transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-gray-900">{r.userName}</p>
                          <div className="flex gap-1">
                            {renderStars(r.rating)}
                          </div>
                        </div>
                        {user && user.email === r.userEmail && (
                          <button
                            onClick={() => handleDelete(r._id)}
                            className="px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded border border-red-200 transition-all duration-200 flex items-center gap-1"
                            title="Delete your rating"
                          >
                            <span>✕</span> Remove
                          </button>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(r.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                  {r.comment && (
                    <p className="text-gray-700 text-sm mt-3 ml-0 pl-0">{r.comment}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
