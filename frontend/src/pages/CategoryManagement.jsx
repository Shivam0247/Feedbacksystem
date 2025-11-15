import { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/category';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editingId) {
        await updateCategory(editingId, formData);
        setEditingId(null);
      } else {
        await createCategory(formData);
      }
      setFormData({ name: '' });
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({ name: category.name });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '' });
    setError('');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Category Management</h1>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit Category' : 'Create New Category'}
        </h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              required
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Category name"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">All Categories</h2>
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No categories found</div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-md hover:bg-gray-50"
              >
                <span className="text-lg">{category.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManagement;

