import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/auth/register', formData);
      setSuccess('Registered successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.15),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.1),_transparent_26%),linear-gradient(180deg,_rgba(15,23,42,1)_0%,_rgba(2,6,23,1)_100%)]" />
      <div className="absolute left-1/2 top-[-8rem] h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      <form
        onSubmit={handleSubmit}
        className="relative bg-slate-900/60 border border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-sm z-10"
      >
        <div className="text-center mb-6">
          <Link to="/" className="text-sm font-semibold tracking-[0.24em] text-cyan-200/65 uppercase hover:text-cyan-200 transition">
            FindIt
          </Link>
          <h2 className="text-3xl font-bold mt-2 text-white tracking-wide">
            Create Account
          </h2>
        </div>

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

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-950/60 border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20 text-white rounded-lg px-4 py-3 outline-none transition duration-200 placeholder:text-slate-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@domain.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-950/60 border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20 text-white rounded-lg px-4 py-3 outline-none transition duration-200 placeholder:text-slate-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-slate-950/60 border border-white/10 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20 text-white rounded-lg px-4 py-3 outline-none transition duration-200 placeholder:text-slate-600"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold py-3 rounded-full transition duration-200 uppercase tracking-wider text-sm cursor-pointer shadow-lg shadow-cyan-500/10"
        >
          Register
        </button>

        <p className="text-sm text-center mt-6 text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}