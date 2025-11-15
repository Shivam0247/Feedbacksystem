import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeedbacks, toggleUpvote } from '../api/feedback';
import { getCategories } from '../api/category';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    rating: '',
    sort: '-createdAt',
    page: 1
  });
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchFeedbacks();
    fetchCategories();
  }, [filters]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await getFeedbacks(filters);
      setFeedbacks(res.data.feedbacks);
      setPagination({
        page: res.data.page,
        pages: res.data.pages,
        total: res.data.total
      });
    } catch (err) {
      console.error('Failed to fetch feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleUpvote = async (id) => {
    if (!user) return;
    try {
      const res = await toggleUpvote(id);
      setFeedbacks(feedbacks.map(f => f._id === id ? res.data : f));
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const getStatusBadge = (status) => {
    const styles = {
      'Open': 'bg-blue-100 text-blue-800 border-blue-200',
      'In-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Completed': 'bg-green-100 text-green-800 border-green-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200'
    };
    return styles[status] || styles['Open'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Feedback</h1>
          <p className="text-gray-600">Discover and engage with community feedback</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search feedback..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="In-progress">In-progress</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <select
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="-rating">Highest Rating</option>
              <option value="rating">Lowest Rating</option>
              <option value="-upvotes">Most Upvoted</option>
            </select>
          </div>
        </div>

        {/* Feedback List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">Loading feedback...</p>
            </div>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No feedback found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {feedbacks.map((feedback) => {
                const isUpvoted = user && feedback.upvotes?.some(u => u._id === user._id);
                return (
                  <div key={feedback._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden group">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => handleUpvote(feedback._id)}
                          disabled={!user}
                          className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl transition-all ${
                            isUpvoted 
                              ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-300' 
                              : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-indigo-50 hover:border-indigo-200'
                          } disabled:opacity-50 disabled:cursor-not-allowed min-w-[70px]`}
                        >
                          <svg className={`w-6 h-6 mb-1 ${isUpvoted ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          <span className="text-sm font-bold">{feedback.upvotes?.length || 0}</span>
                          <span className="text-xs text-gray-500">votes</span>
                        </button>
                        
                        <div className="flex-1">
                          <Link to={`/feedback/${feedback._id}`}>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors group-hover:underline">
                              {feedback.title}
                            </h3>
                          </Link>
                          <p className="text-gray-600 mb-4 line-clamp-2">{feedback.message}</p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="font-medium">{feedback.user?.name}</span>
                            </div>
                            <span className="text-gray-300">•</span>
                            <div className="flex items-center gap-2 text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              <span>{feedback.category?.name}</span>
                            </div>
                            <span className="text-gray-300">•</span>
                            <div className="flex items-center gap-1 text-yellow-500">
                              <span className="font-semibold">{feedback.rating}</span>
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(feedback.status)}`}>
                              {feedback.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-8">
                <button
                  onClick={() => handleFilterChange('page', filters.page - 1)}
                  disabled={filters.page === 1}
                  className="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg border border-gray-200 disabled:hover:bg-white disabled:hover:text-gray-700"
                >
                  Previous
                </button>
                <div className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg">
                  Page {pagination.page} of {pagination.pages}
                </div>
                <button
                  onClick={() => handleFilterChange('page', filters.page + 1)}
                  disabled={filters.page === pagination.pages}
                  className="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg border border-gray-200 disabled:hover:bg-white disabled:hover:text-gray-700"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackList;
