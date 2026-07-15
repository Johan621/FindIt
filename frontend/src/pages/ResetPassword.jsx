import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../api/axios';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      const res = await API.put(`/auth/resetpassword/${token}`, { password });
      setSuccess(res.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. The link might be expired.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-xl shadow-lg w-full max-w-sm"
      >
        <div className="text-center mb-6">
          <Link to="/" className="text-sm font-bold tracking-tight text-blue-600 dark:text-blue-400 uppercase hover:underline">
            FindIt
          </Link>
          <h2 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
            Create New Password
          </h2>
        </div>

        {error && (
          <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-sm mb-4 py-2 px-3 rounded-md text-center font-medium">
            {error}
          </p>
        )}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 text-sm mb-4 py-3 px-4 rounded-md text-center">
            <p className="text-green-600 dark:text-green-400 font-medium mb-1">{success}</p>
            <p className="text-green-700 dark:text-green-300 text-xs">Redirecting to login...</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              placeholder="•••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white rounded-md px-4 py-2.5 outline-none transition duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="•••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white rounded-md px-4 py-2.5 outline-none transition duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md transition duration-200 shadow-sm"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}
