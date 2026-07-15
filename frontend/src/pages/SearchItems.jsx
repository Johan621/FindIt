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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
          Search Items
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
        <form
          onSubmit={handleSearch}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 shadow-sm"
        >
          <input
            type="text"
            name="keyword"
            placeholder="Search keyword..."
            value={filters.keyword}
            onChange={handleChange}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white rounded-md px-4 py-2.5 outline-none transition duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={filters.category}
            onChange={handleChange}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white rounded-md px-4 py-2.5 outline-none transition duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleChange}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white rounded-md px-4 py-2.5 outline-none transition duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white rounded-md px-4 py-2.5 outline-none transition duration-200"
          >
            <option value="" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">All Types</option>
            <option value="lost" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">Lost</option>
            <option value="found" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">Found</option>
          </select>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-md transition duration-200 flex-1 text-sm shadow-sm"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-md transition duration-200 text-sm font-semibold"
            >
              Clear
            </button>
          </div>
        </form>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-slate-500 dark:text-slate-400 text-lg">Loading...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No items match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/items/${item._id}`)}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 cursor-pointer hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700 transition duration-300 flex flex-col justify-between shadow-sm hover:shadow-md"
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
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-3 flex items-center gap-1.5 font-medium">
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