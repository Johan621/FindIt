import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import API from '../api/axios';

export default function ReportItem() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'lost',
    location: '',
    date: ''
  });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (photo) data.append('photo', photo);

      await API.post('/items', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Item reported successfully!');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-x-hidden py-10 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.08),_transparent_26%),linear-gradient(180deg,_rgba(15,23,42,1)_0%,_rgba(2,6,23,1)_100%)] fixed" />

      <div className="relative max-w-lg mx-auto z-10">
        <button
          onClick={() => navigate(-1)}
          className="text-cyan-400 hover:text-cyan-300 transition mb-6 inline-flex items-center gap-1 text-sm font-semibold cursor-pointer"
        >
          ← Back
        </button>

        <div className="bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-white tracking-wide text-center">
            Report an Item
          </h2>

          {error && (
            <p className="text-rose-400 bg-rose-500/10 border border-rose-500/20 text-sm mb-4 py-2 px-3 rounded-lg text-center">
              {error}
            </p>
          )}
          {success && (
            <p className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 text-sm mb-4 py-2 px-3 rounded-lg text-center">
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center gap-2 border rounded-xl py-3 cursor-pointer transition ${formData.type === 'lost' ? 'bg-rose-500/10 border-rose-500/50 text-rose-400 font-semibold' : 'border-white/10 bg-slate-950/40 text-slate-400 hover:bg-slate-900'}`}>
                <input
                  type="radio"
                  name="type"
                  value="lost"
                  checked={formData.type === 'lost'}
                  onChange={handleChange}
                  className="sr-only"
                />
                🔴 Lost Item
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 border rounded-xl py-3 cursor-pointer transition ${formData.type === 'found' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-semibold' : 'border-white/10 bg-slate-950/40 text-slate-400 hover:bg-slate-900'}`}>
                <input
                  type="radio"
                  name="type"
                  value="found"
                  checked={formData.type === 'found'}
                  onChange={handleChange}
                  className="sr-only"
                />
                🟢 Found Item
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                Item Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Blue Water Bottle, Black Leather Wallet"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-slate-950/60 border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20 text-white rounded-lg px-4 py-3 outline-none transition duration-200 placeholder:text-slate-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                Detailed Description
              </label>
              <textarea
                name="description"
                placeholder="Describe key features, brand, color, serial numbers, or contents..."
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-950/60 border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20 text-white rounded-lg px-4 py-3 outline-none transition duration-200 placeholder:text-slate-600"
                rows="3"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g. Electronics, Books"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20 text-white rounded-lg px-4 py-3 outline-none transition duration-200 placeholder:text-slate-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Main Library, Room 204"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-slate-950/60 border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20 text-white rounded-lg px-4 py-3 outline-none transition duration-200 placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                Date {formData.type === 'lost' ? 'Lost' : 'Found'}
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  min="2000-01-01"
                  className="w-full bg-slate-950/60 border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20 text-white rounded-lg pl-11 pr-4 py-3 outline-none transition duration-200 placeholder:text-slate-650 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
                  required
                />
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 ml-1">
                Photo (optional)
              </label>
              <div className="relative border border-dashed border-white/20 rounded-xl p-4 bg-slate-950/40 hover:bg-slate-950/60 transition flex flex-col items-center justify-center cursor-pointer min-h-[90px]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <span className="text-sm text-cyan-400 font-medium text-center">
                  {photo ? `📁 ${photo.name}` : '📷 Select image file or drag here'}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3.5 rounded-full transition duration-200 uppercase tracking-wider text-sm cursor-pointer shadow-lg shadow-cyan-500/10 disabled:opacity-50 mt-6"
            >
              {submitting ? 'Submitting Report...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}