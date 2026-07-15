import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import API from '../api/axios';


export default function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/items/stats/summary')
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-20 text-slate-500 text-lg">Loading stats...</div>;
  if (!stats) return <div className="text-center mt-20 text-red-600 dark:text-red-400 font-medium">Failed to load stats</div>;

  const statusData = [
    { name: 'Pending', value: stats.pendingCount },
    { name: 'Verified', value: stats.verifiedCount },
    { name: 'Recovered', value: stats.recoveredCount },
    { name: 'Rejected', value: stats.rejectedCount }
  ];

  const typeData = [
    { name: 'Lost', value: stats.lostCount },
    { name: 'Found', value: stats.foundCount }
  ];

  const categoryData = (stats.categoryBreakdown || []).map((c) => ({
    name: c._id,
    count: c.count
  }));

  const trendData = (stats.dailyTrend || []).map((d) => ({
    date: d._id,
    count: d.count
  }));

  const COLORS = ['#eab308', '#22d3ee', '#10b981', '#f43f5e']; // yellow, cyan, emerald, rose

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
          Reports & Statistics
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
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Items', value: stats.totalItems, color: 'text-slate-900 dark:text-white border-slate-200 dark:border-slate-800' },
            { label: 'Pending', value: stats.pendingCount, color: 'text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/50 bg-yellow-50 dark:bg-yellow-900/20' },
            { label: 'Verified', value: stats.verifiedCount, color: 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Recovered', value: stats.recoveredCount, color: 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20' },
            { label: 'Rejected', value: stats.rejectedCount, color: 'text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20' }
          ].map((card) => (
            <div key={card.label} className={`border rounded-xl p-5 text-center bg-white dark:bg-slate-900 shadow-sm ${card.color.split(' ').slice(1).join(' ')}`}>
              <p className={`text-3xl font-extrabold ${card.color.split(' ')[0]}`}>{card.value}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-2">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Breakdown Pie Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-slate-200 mb-4 text-sm uppercase tracking-wider">Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={{ fill: '#64748b', fontSize: 11 }}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Legend formatter={(value) => <span className="text-slate-600 dark:text-slate-300 text-xs font-medium">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Lost vs Found Pie Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-slate-200 mb-4 text-sm uppercase tracking-wider">Lost vs Found</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={typeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={{ fill: '#64748b', fontSize: 11 }}
                >
                  <Cell fill="#ef4444" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Legend formatter={(value) => <span className="text-slate-600 dark:text-slate-300 text-xs font-medium">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown Bar Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-slate-200 mb-4 text-sm uppercase tracking-wider">Items by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-700" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis allowDecimals={false} stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Trend Line Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-slate-200 mb-4 text-sm uppercase tracking-wider">Reports Trend (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-slate-700" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis allowDecimals={false} stroke="#64748b" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}