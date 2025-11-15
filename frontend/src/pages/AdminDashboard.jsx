import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats, updateFeedbackStatus, deleteAnyFeedback } from '../api/admin';
import { getFeedbacks } from '../api/feedback';
import { getCategories } from '../api/category';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    page: 1
  });

  useEffect(() => {
    fetchStats();
    fetchFeedbacks();
    fetchCategories();
  }, [filters]);

  const fetchStats = async () => {
    try {
      const res = await getStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await getFeedbacks({ ...filters, limit: 10 });
      setFeedbacks(res.data.feedbacks);
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

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateFeedbackStatus(id, status);
      fetchFeedbacks();
      fetchStats();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
      await deleteAnyFeedback(id);
      fetchFeedbacks();
      fetchStats();
    } catch (err) {
      console.error('Failed to delete feedback:', err);
      alert(err.response?.data?.message || 'Failed to delete feedback');
    }
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage feedback and monitor system statistics</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-indigo-100 mb-1">Total Users</h3>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-emerald-100 mb-1">Total Feedback</h3>
              <p className="text-3xl font-bold">{stats.totalFeedback}</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-yellow-100 mb-1">Average Rating</h3>
              <p className="text-3xl font-bold">{stats.avgRating} ⭐</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-medium text-purple-100 mb-1">Categories</h3>
              <p className="text-3xl font-bold">{stats.categoryCount}</p>
            </div>
          </div>
        )}

        {/* Status Breakdown */}
        {stats?.statusCounts && stats.statusCounts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Status Breakdown
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.statusCounts.map((item) => (
                <div key={item._id} className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-3xl font-bold text-gray-900 mb-1">{item.count}</p>
                  <p className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${getStatusBadge(item._id)}`}>
                    {item._id}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Usage */}
        {stats?.categoryUsage && stats.categoryUsage.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Category Usage
            </h2>
            <div className="space-y-3">
              {stats.categoryUsage.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                  <span className="font-semibold text-gray-900">{item.categoryName}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full" 
                        style={{ width: `${(item.count / stats.totalFeedback) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-indigo-600 min-w-[60px] text-right">{item.count} feedbacks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Management */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Manage Feedback
            </h2>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <select
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="In-progress">In-progress</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
            <select
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No feedback found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <div key={feedback._id} className="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                  <Link to={`/feedback/${feedback._id}`}>
                    <h3 className="text-lg font-bold text-indigo-600 hover:text-indigo-700 mb-2">
                      {feedback.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{feedback.message}</p>
                  <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                    <span className="text-gray-600">By: <span className="font-semibold">{feedback.user?.name}</span></span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-600">Category: <span className="font-semibold">{feedback.category?.name}</span></span>
                    <span className="text-gray-300">•</span>
                    <span className="text-yellow-500 font-semibold">{'⭐'.repeat(feedback.rating)}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-600">Upvotes: <span className="font-semibold">{feedback.upvotes?.length || 0}</span></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={feedback.status}
                      onChange={(e) => handleStatusUpdate(feedback._id, e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                      <option value="Open">Open</option>
                      <option value="In-progress">In-progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <button
                      onClick={() => handleDelete(feedback._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
