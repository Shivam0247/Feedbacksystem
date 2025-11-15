import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFeedback, toggleUpvote } from '../api/feedback';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const FeedbackDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, [id]);

  const fetchFeedback = async () => {
    try {
      const res = await getFeedback(id);
      setFeedback(res.data);
    } catch (err) {
      console.error('Failed to fetch feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!user) return;
    try {
      const res = await toggleUpvote(id);
      setFeedback(res.data);
    } catch (err) {
      console.error('Failed to upvote:', err);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  if (!feedback) {
    return <div className="container mx-auto px-4 py-8 text-center">Feedback not found</div>;
  }

  const isUpvoted = user && feedback.upvotes?.some(u => u._id === user._id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/feedback" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Feedback List
      </Link>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{feedback.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span>By: {feedback.user?.name}</span>
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
            </div>
          </div>
          <button
            onClick={handleUpvote}
            disabled={!user}
            className={`flex flex-col items-center px-4 py-2 rounded ${
              isUpvoted ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            } disabled:opacity-50`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>{feedback.upvotes?.length || 0}</span>
          </button>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{feedback.message}</p>
        </div>

        <div className="mt-6 pt-4 border-t text-sm text-gray-500">
          <p>Created: {new Date(feedback.createdAt).toLocaleString()}</p>
          {feedback.updatedAt !== feedback.createdAt && (
            <p>Updated: {new Date(feedback.updatedAt).toLocaleString()}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetail;

