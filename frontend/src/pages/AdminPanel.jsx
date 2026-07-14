import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';

export default function AdminPanel() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');

  const fetchPendingItems = async () => {
    setLoading(true);
    try {
      const res = await API.get('/items', { params: { status: 'pending' } });
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    void (async () => {
      await fetchPendingItems();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleVerify = async (id, status) => {
    setActionError('');
    try {
      await API.patch(`/items/${id}/verify`, { status });
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setActionError(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(139,92,246,0.1),_transparent_28%)]" />

      <nav className="relative bg-slate-900/80 border-b border-white/10 backdrop-blur-md px-6 py-4 flex justify-between items-center z-10">
        <h1 className="text-xl font-bold tracking-[0.24em] text-cyan-200 uppercase">
          Admin Verification Panel
        </h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm hover:underline cursor-pointer"
        >
          Back to Dashboard
        </button>
      </nav>

      <div className="relative p-6 max-w-7xl mx-auto z-10">
        {actionError && (
          <p className="text-rose-400 bg-rose-500/10 border border-rose-500/20 text-sm mb-6 py-2.5 px-3 rounded-lg text-center max-w-md mx-auto">
            {actionError}
          </p>
        )}

        <h2 className="text-2xl font-semibold mb-6 text-slate-200 flex items-center gap-2">
          <span>Pending Verification</span>
          <span className="text-sm font-normal text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
            {items.length} left
          </span>
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-slate-500 text-lg">Loading...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-lg">No items pending verification. 🎉</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="group bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-2xl p-5 flex flex-col justify-between shadow-lg"
              >
                <div>
                  {item.photoUrl && (
                    <div className="overflow-hidden rounded-xl mb-4 h-44">
                      <img
                        src={item.photoUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition duration-200">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-xs text-slate-500 font-medium">
                    <p>📍 Location: {item.location} • {item.category}</p>
                    <p>👤 Reported by: {item.reportedBy?.name || 'Unknown'}</p>
                  </div>
                </div>

                <div className="flex gap-2.5 mt-6">
                  <button
                    onClick={() => handleVerify(item._id, 'verified')}
                    className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-2 rounded-full transition cursor-pointer text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/10"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => handleVerify(item._id, 'rejected')}
                    className="flex-1 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 font-bold py-2 rounded-full transition cursor-pointer text-xs uppercase tracking-wider"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}