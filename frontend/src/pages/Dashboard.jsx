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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-slate-50 dark:bg-none dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative">
      {/* Attractive Background Overlays */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-60 dark:opacity-20 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-indigo-200 to-fuchsia-200 dark:from-indigo-900 dark:to-fuchsia-900 blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-bl from-cyan-200 to-blue-200 dark:from-cyan-900 dark:to-blue-900 blur-3xl opacity-50" />
      </div>

      <nav className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 relative z-50 shadow-sm">
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
          FindIt
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="text-slate-600 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1.5 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
            {user?.name} <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase">({user?.role})</span>
          </span>
          
          <NotificationBell />

          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white px-4 py-1.5 rounded-md transition font-medium shadow-md border border-transparent"
          >
            Home
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white px-4 py-1.5 rounded-md transition font-medium shadow-md border border-transparent"
          >
            My Profile
          </button>

          <button
            onClick={() => navigate('/messages')}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-1.5 rounded-md transition font-medium shadow-md border border-transparent cursor-pointer"
          >
            Messages
          </button>

          {user?.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-4 py-1.5 rounded-md transition font-medium shadow-md border border-transparent"
            >
              Admin Panel
            </button>
          )}
          <button
            onClick={() => navigate('/report')}
            className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-600 hover:to-fuchsia-600 text-white px-4 py-1.5 rounded-md transition font-medium shadow-md border border-transparent"
          >
            Report Item
          </button>
          <button
            onClick={() => navigate('/search')}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-1.5 rounded-md transition font-medium shadow-md border border-transparent"
          >
            Search
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-500 hover:to-emerald-600 text-white px-4 py-1.5 rounded-md transition font-medium shadow-md border border-transparent"
          >
            Reports
          </button>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-4 py-1.5 rounded-md transition font-medium shadow-md border border-transparent"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-7xl mx-auto relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-3">
          <span>Recent Items</span>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2.5 py-1 rounded-md">
            {items.length} total
          </span>
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-slate-500 dark:text-slate-400 text-lg">Loading items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No items reported yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/items/${item._id}`)}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 cursor-pointer hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition duration-300 flex flex-col justify-between"
              >
                <div>
                  {item.photoUrl && (
                    <div className="overflow-hidden rounded-lg mb-4 h-44 border border-slate-100 dark:border-slate-800">
                      <img
                        src={item.photoUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition duration-200">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
                  <span
                    className={`px-3 py-1 rounded-md ${
                      item.type === 'lost'
                        ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50'
                        : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50'
                    }`}
                  >
                    {item.type.toUpperCase()}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 uppercase tracking-wider">
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