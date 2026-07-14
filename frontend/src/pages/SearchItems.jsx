import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function SearchItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    category: '',
    location: '',
    type: ''
  });
  const navigate = useNavigate();

  const fetchItems = async (activeFilters = filters) => {
    setLoading(true);
    try {
      const params = {};
      Object.keys(activeFilters).forEach((key) => {
        if (activeFilters[key]) params[key] = activeFilters[key];
      });

      const res = await API.get('/items', { params });
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await fetchItems();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(filters);
  };

  const handleClear = () => {
    const cleared = { keyword: '', category: '', location: '', type: '' };
    setFilters(cleared);
    fetchItems(cleared);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(139,92,246,0.1),_transparent_28%)]" />

      <nav className="relative bg-slate-900/80 border-b border-white/10 backdrop-blur-md px-6 py-4 flex justify-between items-center z-10">
        <h1 className="text-xl font-bold tracking-[0.24em] text-cyan-200 uppercase">
          Search Items
        </h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm hover:underline cursor-pointer"
        >
          Back to Dashboard
        </button>
      </nav>

      <div className="relative p-6 max-w-7xl mx-auto z-10">
        <form
          onSubmit={handleSearch}
          className="bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-2xl p-5 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 shadow-xl"
        >
          <input
            type="text"
            name="keyword"
            placeholder="Search keyword..."
            value={filters.keyword}
            onChange={handleChange}
            className="bg-slate-950/60 border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20 text-white rounded-lg px-4 py-2.5 outline-none transition duration-200 placeholder:text-slate-650"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={filters.category}
            onChange={handleChange}
            className="bg-slate-950/60 border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20 text-white rounded-lg px-4 py-2.5 outline-none transition duration-200 placeholder:text-slate-650"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleChange}
            className="bg-slate-950/60 border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20 text-white rounded-lg px-4 py-2.5 outline-none transition duration-200 placeholder:text-slate-650"
          />
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="bg-slate-950/60 border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20 text-white rounded-lg px-4 py-2.5 outline-none transition duration-200"
          >
            <option value="" className="bg-slate-950 text-slate-300">All Types</option>
            <option value="lost" className="bg-slate-950 text-slate-300">Lost</option>
            <option value="found" className="bg-slate-950 text-slate-300">Found</option>
          </select>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold px-4 py-2.5 rounded-full transition cursor-pointer flex-1 text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/10"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="border border-white/10 hover:border-cyan-300/50 hover:bg-white/5 text-slate-200 px-4 py-2.5 rounded-full transition cursor-pointer text-sm font-semibold"
            >
              Clear
            </button>
          </div>
        </form>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-slate-500 text-lg">Loading...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-lg">No items match your search.</p>
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
                  <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5 font-medium">
                    📍 {item.location} • {item.category}
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