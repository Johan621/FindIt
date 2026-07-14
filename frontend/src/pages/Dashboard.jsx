import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import NotificationBell from '../components/NotificationBell';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/items')
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(139,92,246,0.1),_transparent_28%)]" />

      <nav className="relative bg-slate-900/80 border-b border-white/10 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 z-10">
        <h1 className="text-xl font-bold tracking-[0.24em] text-cyan-200 uppercase">
          FindIt
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="text-slate-400 bg-white/5 border border-white/5 rounded-full px-3.5 py-1.5 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block"></span>
            {user?.name} <span className="text-xs text-cyan-300 uppercase">({user?.role})</span>
          </span>
          
          <NotificationBell />

          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="bg-amber-500/10 border border-amber-500/30 text-amber-200 px-4 py-1.5 rounded-full hover:bg-amber-500/20 transition cursor-pointer font-medium"
            >
              Admin Panel
            </button>
          )}
          <button
            onClick={() => navigate('/report')}
            className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 px-4 py-1.5 rounded-full transition cursor-pointer font-semibold shadow-lg shadow-cyan-500/10"
          >
            Report Item
          </button>
          <button
            onClick={() => navigate('/search')}
            className="border border-white/10 hover:border-cyan-300/50 hover:bg-white/5 text-slate-200 px-4 py-1.5 rounded-full transition cursor-pointer font-medium"
          >
            Search
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="bg-teal-500/10 border border-teal-500/30 text-teal-200 px-4 py-1.5 rounded-full hover:bg-teal-500/20 transition cursor-pointer font-medium"
          >
            Reports
          </button>
          <button
            onClick={handleLogout}
            className="border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 px-4 py-1.5 rounded-full transition cursor-pointer font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="relative p-6 max-w-7xl mx-auto z-10">
        <h2 className="text-2xl font-semibold mb-6 text-slate-200 flex items-center gap-2">
          <span>Recent Items</span>
          <span className="text-sm font-normal text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
            {items.length} total
          </span>
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-slate-500 text-lg">Loading items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-lg">No items reported yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/items/${item._id}`)}
                className="group bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-2xl p-5 cursor-pointer hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-900/80 transition duration-300 flex flex-col justify-between shadow-lg"
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
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5 text-xs font-semibold">
                  <span
                    className={`px-3 py-1 rounded-full ${
                      item.type === 'lost'
                        ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                        : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {item.type.toUpperCase()}
                  </span>
                  <span className="text-slate-500 uppercase tracking-wider">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}