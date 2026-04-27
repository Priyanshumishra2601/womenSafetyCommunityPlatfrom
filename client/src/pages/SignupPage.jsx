import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 to-white px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
        <p className="mt-1 text-sm text-gray-500">Join the women safety community platform.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
            <input
              name="name"
              type="text"
              required
              value={form.name}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none ring-rose-200 transition focus:ring"
              placeholder="Priyanshu Sharma"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none ring-rose-200 transition focus:ring"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none ring-rose-200 transition focus:ring"
              placeholder="********"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 outline-none ring-rose-200 transition focus:ring"
            >
              <option value="User">User</option>
              <option value="VerifiedHelper">Verified Helper</option>
            </select>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-rose-600 px-4 py-2.5 font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Signup'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link className="font-semibold text-rose-600 hover:text-rose-700" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

