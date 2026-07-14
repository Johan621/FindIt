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
  if (!stats) return <div className="text-center mt-20 text-rose-400 font-medium">Failed to load stats</div>;

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
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(139,92,246,0.1),_transparent_28%)]" />

      <nav className="relative bg-slate-900/80 border-b border-white/10 backdrop-blur-md px-6 py-4 flex justify-between items-center z-10">
        <h1 className="text-xl font-bold tracking-[0.24em] text-cyan-200 uppercase">
          Reports & Statistics
        </h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm hover:underline cursor-pointer"
        >
          Back to Dashboard
        </button>
      </nav>

      <div className="relative p-6 max-w-7xl mx-auto z-10">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Items', value: stats.totalItems, color: 'text-white border-white/10' },
            { label: 'Pending', value: stats.pendingCount, color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5' },
            { label: 'Verified', value: stats.verifiedCount, color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5' },
            { label: 'Recovered', value: stats.recoveredCount, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
            { label: 'Rejected', value: stats.rejectedCount, color: 'text-rose-400 border-rose-500/20 bg-rose-500/5' }
          ].map((card) => (
            <div key={card.label} className={`border rounded-2xl p-5 text-center backdrop-blur-md bg-slate-900/40 shadow-lg ${card.color.split(' ')[1]}`}>
              <p className={`text-3xl font-extrabold ${card.color.split(' ')[0]}`}>{card.value}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-2">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Breakdown Pie Chart */}
          <div className="bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <h3 className="font-semibold text-slate-200 mb-4 text-sm uppercase tracking-wider">Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={{ fill: '#94a3b8', fontSize: 11 }}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                <Legend formatter={(value) => <span className="text-slate-300 text-xs font-semibold">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Lost vs Found Pie Chart */}
          <div className="bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <h3 className="font-semibold text-slate-200 mb-4 text-sm uppercase tracking-wider">Lost vs Found</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={typeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={{ fill: '#94a3b8', fontSize: 11 }}
                >
                  <Cell fill="#f43f5e" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                <Legend formatter={(value) => <span className="text-slate-300 text-xs font-semibold">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown Bar Chart */}
          <div className="bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <h3 className="font-semibold text-slate-200 mb-4 text-sm uppercase tracking-wider">Items by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis allowDecimals={false} stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                <Bar dataKey="count" fill="#22d3ee" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Trend Line Chart */}
          <div className="bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <h3 className="font-semibold text-slate-200 mb-4 text-sm uppercase tracking-wider">Reports Trend (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis allowDecimals={false} stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />
                <Line type="monotone" dataKey="count" stroke="#a78bfa" strokeWidth={3} dot={{ fill: '#a78bfa', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}