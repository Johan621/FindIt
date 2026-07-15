import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchMyItems = async () => {
      try {
        const userId = user.id || user._id;
        const res = await API.get('/items', { params: { reportedBy: userId } });
        setItems(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyItems();
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-slate-50 dark:bg-none dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 relative">
      {/* Attractive Background Overlays */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-60 dark:opacity-20">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-indigo-200 to-fuchsia-200 dark:from-indigo-900 dark:to-fuchsia-900 blur-3xl opacity-50" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-bl from-cyan-200 to-blue-200 dark:from-cyan-900 dark:to-blue-900 blur-3xl opacity-50" />
      </div>

      <nav className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800 px-6 py-4 flex justify-between items-center relative z-10 shadow-sm">
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
          My Profile
        </h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:underline"
        >
          Back to Dashboard
        </button>
      </nav>

      <div className="p-6 max-w-7xl mx-auto relative z-10">
        {/* User Info Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 mb-8 shadow-sm flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {user?.name || 'User'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {user?.email}
            </p>
            <span className="inline-block mt-2 text-xs px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50 uppercase font-semibold tracking-wider">
              {user?.role || 'Student'}
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">
          My Submissions
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Loading submissions...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">You haven't reported any items yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/items/${item._id}`)}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 cursor-pointer hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-700 transition duration-300 flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div>
                  {item.photoUrl && (
                    <div className="overflow-hidden rounded-xl mb-4 h-44 border border-slate-100 dark:border-slate-800">
                      <img
                        src={item.photoUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition duration-200">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-1.5 font-medium">
                    📍 {item.location} • {item.category}
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
