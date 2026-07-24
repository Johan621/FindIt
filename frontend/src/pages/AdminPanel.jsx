import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';

export default function AdminPanel() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');

  const fetchPendingItems = async () => {
    setLoading(true);
    try {
      const res = await API.get('/items', { params: { status: 'pending' } });
      setItems(res.data);
      const resUsers = await API.get('/admin/blocked-users');
      setBlockedUsers(resUsers.data);
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

  const handleUnblockAndMessage = async (userId, userEmail) => {
    setActionError('');
    try {
      await API.put(`/admin/users/${userId}/unblock`);
      setBlockedUsers((prev) => prev.filter((u) => u._id !== userId));
      // Navigate to messages using search params for the "system" item
      navigate(`/messages?item=system&recipient=${userId}`);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to unblock user');
    }
  };

  const handleExportCSV = () => {
    if (items.length === 0) return;
    const headers = ['ID', 'Title', 'Type', 'Category', 'Location', 'Reported By Email', 'Date Reported'];
    const csvRows = [headers.join(',')];

    items.forEach(item => {
      const row = [
        item._id,
        `"${item.title.replace(/"/g, '""')}"`,
        item.type,
        `"${item.category}"`,
        `"${item.location}"`,
        item.reportedBy?.email || 'Unknown',
        new Date(item.date).toLocaleDateString()
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pending_items_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
          Admin Verification Panel
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/messages')}
            className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline cursor-pointer"
          >
            Messages
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-7xl mx-auto">
        {actionError && (
          <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-sm mb-6 py-2.5 px-3 rounded-md text-center max-w-md mx-auto">
            {actionError}
          </p>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <span>Pending Verification</span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2.5 py-1 rounded-md">
              {items.length} left
            </span>
          </h2>
          <button
            onClick={handleExportCSV}
            disabled={items.length === 0}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-md transition shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export to CSV
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-slate-500 dark:text-slate-400 text-lg">Loading...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No items pending verification. 🎉</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-sm"
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
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white transition duration-200">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <p>📍 Location: {item.location} • {item.category}</p>
                    <p>👤 Reported by: {item.reportedBy?.name || 'Unknown'}</p>
                  </div>
                </div>

                <div className="flex gap-2.5 mt-6">
                  <button
                    onClick={() => handleVerify(item._id, 'verified')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition text-xs uppercase tracking-wider shadow-sm"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => handleVerify(item._id, 'rejected')}
                    className="flex-1 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-semibold py-2 rounded-md transition text-xs uppercase tracking-wider"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blocked Users Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <span>Blocked Users</span>
              <span className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2.5 py-1 rounded-md">
                {blockedUsers.length} total
              </span>
            </h2>
          </div>
          
          {blockedUsers.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center shadow-sm">
              <p className="text-slate-500 dark:text-slate-400">No blocked users. Great!</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                {blockedUsers.map((u) => (
                  <li key={u._id} className="p-4 sm:px-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{u.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{u.email}</p>
                      <p className="text-xs text-red-500 mt-1">Spam Attempts: {u.spamAttempts}</p>
                    </div>
                    <button
                      onClick={() => handleUnblockAndMessage(u._id, u.email)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1.5 px-4 rounded text-sm transition"
                    >
                      Unblock & Message
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}