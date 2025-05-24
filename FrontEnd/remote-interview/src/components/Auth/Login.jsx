import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/landing');
    } catch (error) {
      setError('Failed to sign in: ' + error.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111b21]">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#202c33] rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-white">Sign In</h2>
        </div>
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-white text-sm">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[#2a3942] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005c4b]"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-white text-sm">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[#2a3942] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005c4b]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#005c4b] hover:bg-[#006d5b] text-white font-semibold rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-300">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-[#5ea8ff] hover:underline font-medium"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 