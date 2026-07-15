import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchItem = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/items/${id}`);
      setItem(res.data);
    } catch {
      setError('Item not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await fetchItem();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleMarkRecovered = async () => {
    setUpdating(true);
    try {
      await API.patch(`/items/${id}/status`, { status: 'recovered' });
      setItem((prev) => ({ ...prev, status: 'recovered' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await API.delete(`/items/${id}`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete item');
    }
  };

  const statusColor = {
    pending: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/50',
    verified: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50',
    matched: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50',
    recovered: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50',
    rejected: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50'
  };

  if (loading) return <div className="text-center mt-20 text-slate-500 text-lg">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-600 dark:text-red-400 font-medium">{error}</div>;
  if (!item) return null;

  const userId = user?.id || user?._id;
  const isOwner = item.reportedBy?._id === userId || item.reportedBy === userId;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 dark:text-blue-400 hover:underline transition mb-6 inline-flex items-center gap-1 text-sm font-semibold cursor-pointer"
        >
          ← Back
        </button>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          {item.photoUrl && (
            <div className="w-full h-80 overflow-hidden relative border-b border-slate-200 dark:border-slate-800">
              <img
                src={item.photoUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{item.title}</h1>
              <div>
                <span
                  className={`text-xs px-3 py-1.5 rounded-md font-semibold uppercase tracking-wider ${statusColor[item.status]}`}
                >
                  {item.status}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <span
                className={`inline-block text-xs px-3 py-1 rounded-md font-semibold ${
                  item.type === 'lost'
                    ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50'
                    : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50'
                }`}
              >
                {item.type.toUpperCase()}
              </span>
            </div>

            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-8 text-base bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
              {item.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 mb-8 text-slate-600 dark:text-slate-400">
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-200">Category:</span> {item.category}
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-200">Location:</span> {item.location}
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-200">Date Reported:</span>{' '}
                {new Date(item.date).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-200">Reported by:</span>{' '}
                {item.reportedBy?.name || 'Unknown'}
              </div>
            </div>

            {error && (
              <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-sm mb-4 py-2 px-3 rounded-md text-center font-medium">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              {item.status === 'verified' && (
                <button
                  onClick={handleMarkRecovered}
                  disabled={updating}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-md transition duration-200 shadow-sm disabled:opacity-50 text-sm"
                >
                  {updating ? 'Updating...' : 'Mark as Recovered'}
                </button>
              )}

              {(isOwner || user?.role === 'admin') && (
                <button
                  onClick={handleDelete}
                  className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-bold px-6 py-2.5 rounded-md transition duration-200 text-sm"
                >
                  Delete Report
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}