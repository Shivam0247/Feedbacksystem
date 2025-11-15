import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeedbacks, updateFeedback, deleteFeedback } from '../api/feedback';
import { getCategories } from '../api/category';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const MyFeedback = () => {
  const { user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', message: '', category: '', rating: 5 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFeedbacks();
      fetchCategories();
    }
  }, [user]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await getFeedbacks({ user: user._id });
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

  const handleEdit = (feedback) => {
    setEditingId(feedback._id);
    setEditForm({
      title: feedback.title,
      message: feedback.message,
      category: feedback.category._id,
      rating: feedback.rating
    });
  };

  const handleUpdate = async (id) => {
    try {
      await updateFeedback(id, editForm);
      setEditingId(null);
      fetchFeedbacks();
    } catch (err) {
      console.error('Failed to update feedback:', err);
      alert(err.response?.data?.message || 'Failed to update feedback');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
      await deleteFeedback(id);
      fetchFeedbacks();
    } catch (err) {
      console.error('Failed to delete feedback:', err);
      alert(err.response?.data?.message || 'Failed to delete feedback');
    }
  };

  if (!user) {
    return <div className="container mx-auto px-4 py-8">Please login to view your feedback</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Feedback</h1>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">You haven't submitted any feedback yet</div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((feedback) => (
            <div key={feedback._id} className="bg-white p-6 rounded-lg shadow-md">
              {editingId === feedback._id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={editForm.message}
                    onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                  />
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div>
                    <label>Rating: {editForm.rating} ⭐</label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={editForm.rating}
                      onChange={(e) => setEditForm({ ...editForm, rating: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(feedback._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Link to={`/feedback/${feedback._id}`}>
                    <h3 className="text-xl font-semibold text-blue-600 hover:underline">
                      {feedback.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mt-2">{feedback.message}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                    <span>Category: {feedback.category?.name}</span>
                    <span>Rating: {'⭐'.repeat(feedback.rating)}</span>
                    <span className={`px-2 py-1 rounded ${
                      feedback.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      feedback.status === 'In-progress' ? 'bg-yellow-100 text-yellow-800' :
                      feedback.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {feedback.status}
                    </span>
                    <span>Upvotes: {feedback.upvotes?.length || 0}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(feedback)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(feedback._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFeedback;

