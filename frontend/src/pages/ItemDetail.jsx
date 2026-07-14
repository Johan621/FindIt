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
    pending: 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-400',
    verified: 'bg-cyan-500/10 border border-cyan-500/25 text-cyan-400',
    matched: 'bg-purple-500/10 border border-purple-500/25 text-purple-400',
    recovered: 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400',
    rejected: 'bg-rose-500/10 border border-rose-500/25 text-rose-400'
  };

  if (loading) return <div className="text-center mt-20 text-slate-500 text-lg">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-rose-400 font-medium">{error}</div>;
  if (!item) return null;

  const userId = user?.id || user?._id;
  const isOwner = item.reportedBy?._id === userId || item.reportedBy === userId;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden py-10 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(139,92,246,0.1),_transparent_28%)]" />

      <div className="relative max-w-2xl mx-auto z-10">
        <button
          onClick={() => navigate(-1)}
          className="text-cyan-400 hover:text-cyan-300 transition mb-6 inline-flex items-center gap-1 text-sm font-semibold cursor-pointer"
        >
          ← Back
        </button>

        <div className="bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl">
          {item.photoUrl && (
            <div className="w-full h-80 overflow-hidden relative border-b border-white/10">
              <img
                src={item.photoUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold text-white tracking-tight">{item.title}</h1>
              <div>
                <span
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold uppercase tracking-wider ${statusColor[item.status]}`}
                >
                  {item.status}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <span
                className={`inline-block text-xs px-3 py-1 rounded-full font-semibold ${
                  item.type === 'lost'
                    ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                    : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                }`}
              >
                {item.type.toUpperCase()}
              </span>
            </div>

            <p className="text-slate-350 leading-relaxed mb-8 text-base bg-slate-950/20 border border-white/5 rounded-xl p-4">
              {item.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-slate-950/40 border border-white/5 rounded-xl p-5 mb-8 text-slate-400">
              <div>
                <span className="font-semibold text-slate-200">Category:</span> {item.category}
              </div>
              <div>
                <span className="font-semibold text-slate-200">Location:</span> {item.location}
              </div>
              <div>
                <span className="font-semibold text-slate-200">Date Reported:</span>{' '}
                {new Date(item.date).toLocaleDateString()}
              </div>
              <div>
                <span className="font-semibold text-slate-200">Reported by:</span>{' '}
                {item.reportedBy?.name || 'Unknown'}
              </div>
            </div>

            {error && (
              <p className="text-rose-400 bg-rose-500/10 border border-rose-500/20 text-sm mb-4 py-2 px-3 rounded-lg text-center">
                {error}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              {item.status === 'verified' && (
                <button
                  onClick={handleMarkRecovered}
                  disabled={updating}
                  className="bg-emerald-500 hover:bg-emerald-455 text-slate-950 font-bold px-6 py-2.5 rounded-full transition cursor-pointer shadow-lg shadow-emerald-500/10 disabled:opacity-50 text-sm"
                >
                  {updating ? 'Updating...' : 'Mark as Recovered'}
                </button>
              )}

              {(isOwner || user?.role === 'admin') && (
                <button
                  onClick={handleDelete}
                  className="bg-rose-500/10 border border-rose-500/35 hover:bg-rose-500/20 text-rose-300 font-bold px-6 py-2.5 rounded-full transition cursor-pointer text-sm"
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